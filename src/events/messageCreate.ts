import type { Message } from 'discord.js';
import { getMemberData, setMemberData } from '../firebase/memberData';
import {
  getSleepData,
  removeSleepData,
  setSleepData,
} from '../firebase/sleepData';
import { filterNull } from '../utils/filterNull';
import { formatDuration } from '../utils/formatDuration';

const keyword = {
  おやすみ: ['おやすみ'],
  おはよう: ['おはよう'],
};

export const messageCreate = async (message: Message<boolean>) => {
  if (message.author.bot) return;
  // テストサーバーでのみ動かす
  if (message.guildId !== '503546613155758090') return;

  const date = new Date(
    Date.now() + (-540 - new Date().getTimezoneOffset()) * 60 * 1000
  );

  const sleepData = await getSleepData(message.author.id, date);
  const memberData = await getMemberData(message.author.id);

  if (sleepData === null) {
    if (keyword.おやすみ.includes(message.content)) {
      console.log(`おやすみ by ${message.author.tag}`);

      const isHealthy = 20 < date.getHours() && date.getHours() < 24;
      const content = ['おやすみなさいなのだ'].filter(Boolean).join('\n');
      const reactions = filterNull([isHealthy && '🕒']);
      const streak = isHealthy ? memberData.streak : 0;

      setSleepData({
        member: message.author.id,
        sleep_time: date.getTime(),
        wake_time: null,
      });

      // (3 + 実績数)ポイント
      setMemberData({
        id: message.author.id,
        point: memberData.point + 3 + reactions.length,
        streak,
      });

      message.channel.send(content).then(async (message) => {
        for (let i = 0; i < reactions.length; i++) {
          await message.react(reactions[i]);
        }
      });
    }
  } else {
    if (sleepData.wake_time == null) {
      if (keyword.おはよう.includes(message.content)) {
        console.log(`おはよう by ${message.author.tag}`);

        const sleepDuration = date.getTime() - sleepData.sleep_time;

        const isEnough = sleepDuration > 7 * 60 * 60 * 1000;
        const isHealthy = 5 < date.getHours() && date.getHours() < 9;
        const reactions = filterNull([isEnough && '🛏️', isHealthy && '🕒']);
        const streak = isHealthy ? memberData.streak + 1 : 0;

        const content = [
          'おはようございますなのだ',
          `今日の睡眠時間は${formatDuration(sleepDuration)}なのだ！`,
          streak > 1 && `${streak}日連続健康的なのだ`,
        ]
          .filter(Boolean)
          .join('\n');

        setSleepData({
          ...sleepData,
          wake_time: date.getTime(),
        });

        // (3 + 実績数 + 連続数)ポイント
        // ただし連続は30まで
        setMemberData({
          id: message.author.id,
          point: memberData.point + 3 + reactions.length + Math.min(streak, 30),
          streak,
        });

        message.channel.send(content).then(async (message) => {
          for (let i = 0; i < reactions.length; i++) {
            await message.react(reactions[i]);
          }
        });
      } else {
        message.react('👀');

        removeSleepData(message.author.id, sleepData.sleep_time);

        // -5ポイント
        setMemberData({
          id: message.author.id,
          point: memberData.point - 5,
          streak: 0,
        });
      }
    }
  }
};
