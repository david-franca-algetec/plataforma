/**
 * Sorts two values by date.
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns 1 if `a` is greater than `b`, -1 if `a` is less than `b`, and 0 if they are equal.
 */
export function sortByDate(a: string | number, b: string | number) {
  const dayA = new Date(a).getTime();
  const dayB = new Date(b).getTime();

  if (dayA > dayB) {
    return 1;
  }
  if (dayA < dayB) {
    return -1;
  }
  return 0;
}
