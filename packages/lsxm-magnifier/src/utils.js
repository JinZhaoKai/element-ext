/**
 * 解析出分页总数
 * @param obj
 * @returns {number}
 */
export const parsePageTotal = (obj) => {
  let total = 0;
  if (obj) {
    if (obj.hasOwnProperty('total')) {
      total = obj.total;
    } else if (typeof obj === 'number') {
      total = obj;
    }
  }
  return total;
};
