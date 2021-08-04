export const calculateRange = (pageIndex: number, pageSize: number): string => {
  return pageIndex * pageSize + "-" + (pageIndex + 1) * pageSize;
};
