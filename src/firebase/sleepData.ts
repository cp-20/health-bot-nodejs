import { onValue, ref, remove, update } from 'firebase/database';
import { db } from './initialize';

export type sleepData = {
  member: string;
  sleep_time: number;
  wake_time: number | null;
};

export const getSleepData = (
  member: string,
  date: Date
): Promise<sleepData | null> => {
  const sleepDataRef = ref(db, `sleep_data/${member}`);
  return new Promise((resolve) => {
    onValue(sleepDataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, sleepData>;

        const latestSleepTime = Math.max(
          ...Object.keys(data).map((key) => parseInt(key))
        );

        // 1日以内なら
        if (latestSleepTime > date.getTime() - 12 * 60 * 60 * 1000) {
          const LatestData = data[`${latestSleepTime}`];
          resolve(LatestData);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

export const setSleepData = (data: sleepData) => {
  const sleepDataRef = ref(db, `sleep_data/${data.member}/${data.sleep_time}`);

  return update(sleepDataRef, data);
};

export const removeSleepData = (member: string, sleep_time: number) => {
  const sleepDataRef = ref(db, `sleep_data/${member}/${sleep_time}`);

  return remove(sleepDataRef);
};
