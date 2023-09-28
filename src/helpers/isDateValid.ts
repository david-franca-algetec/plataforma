/**
 * Checks if a given date string or number is a valid date.
 * @param {string | number} dateStr - The date string or number to check.
 * @returns {boolean} - Returns true if the date is valid, false otherwise.
 */
export function isDateValid(dateStr: string | number): boolean {
  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
}
