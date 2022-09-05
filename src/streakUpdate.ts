import { Client } from 'discord.js';
import { getMemberData, setMemberData } from './firebase/memberData';
import { getSleepData } from './firebase/sleepData';

const observeGuilds = ['503546613155758090'];

const checkStreak = (client: Client, type: 'day' | 'night') => {
  observeGuilds.forEach((guildId) => {
    const guild = client.guilds.cache.get(guildId);
    if (guild === undefined) return;

    guild.members.cache.forEach(async (member) => {
      const sleepData = await getSleepData(member.id);
      const memberData = await getMemberData(member.id);

      if (type === 'day') {
        if (sleepData === null) {
          setMemberData({
            ...memberData,
            streak: 0,
          });
        }
      }

      if (type === 'night') {
        if (sleepData === null || sleepData.wake_time === null) {
          setMemberData({
            ...memberData,
            streak: 0,
          });
        }
      }
    });
  });
};

const time_s = 1000;
const time_m = time_s * 60;
const time_h = time_m * 60;
const time_d = time_h * 24;

export const observe = (client: Client) => {
  const date = new Date(
    Date.now() + (-540 - new Date().getTimezoneOffset()) * 60 * 1000
  );
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const ms = date.getMilliseconds();

  const timeByNight = time_d - (h * time_h + m * time_m + s * time_s + ms);
  const timeByDay = timeByNight + time_h * 9;

  setTimeout(() => {
    checkStreak(client, 'night');
    setInterval(() => checkStreak(client, 'night'), time_d);
  }, timeByNight);

  setTimeout(() => {
    checkStreak(client, 'night');
    setInterval(() => checkStreak(client, 'night'), time_d);
  }, timeByDay);
};
