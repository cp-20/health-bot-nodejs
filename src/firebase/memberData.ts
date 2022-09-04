import { onValue, ref, update } from 'firebase/database';
import { db } from './initialize';

export type memberData = {
  id: string;
  point: number;
  streak: number;
};

export const initialData = (id: string): memberData => ({
  id,
  point: 0,
  streak: 0,
});

export const getMemberData = (member: string): Promise<memberData> => {
  const memberDataRef = ref(db, `member_data/${member}`);
  return new Promise((resolve) =>
    onValue(memberDataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        resolve(data);
      } else {
        resolve(initialData(member));
      }
    })
  );
};

export const setMemberData = (data: memberData) => {
  const memberDataRef = ref(db, `member_data/${data.id}`);

  return update(memberDataRef, data);
};
