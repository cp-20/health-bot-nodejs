export const filterNull = <T>(array: T[]) => {
  return array.filter(Boolean) as Exclude<T, null | false>[];
};
