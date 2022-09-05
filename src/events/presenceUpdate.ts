import { Presence } from 'discord.js';
import { getMemberData, setMemberData } from '../firebase/memberData';
import { getSleepData, removeSleepData } from '../firebase/sleepData';

export const presenceUpdate = async (
  _oldPresence: Presence | null,
  newPresence: Presence
) => {
  const member = newPresence.member;
  if (member === null) return;

  const sleepData = await getSleepData(member.id);
  const memberData = await getMemberData(member.id);

  // "おやすみ"と行った後に起きてきたら
  if (
    newPresence.status &&
    newPresence.status !== 'offline' &&
    sleepData !== null &&
    sleepData.wake_time !== null
  ) {
    const date = new Date(
      Date.now() + (-540 - new Date().getTimezoneOffset()) * 60 * 1000
    );

    // 夜なら
    if (20 < date.getHours() && date.getHours() < 5) {
      removeSleepData(member.id, sleepData.sleep_time);

      // -5ポイント
      setMemberData({
        id: member.id,
        point: memberData.point - 5,
        streak: 0,
      });
    }

    // 朝なら
    if (5 < date.getHours() && date.getHours() < 9) {
    }
  }
};
