export const formatDuration = (duration: number) => {
  // const second = Math.floor(duration / 1000) % 60;
  const minute = Math.floor(duration / 1000 / 60) % 60;
  const hour = Math.floor(duration / 1000 / 60 / 60);

  return `${hour}時間${minute}分`;
};
