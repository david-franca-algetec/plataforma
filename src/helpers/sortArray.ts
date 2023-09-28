import { isDateValid } from "./isDateValid";
import { sortByDate } from "./sortByDate";

/**
 * Sorts an array of objects by a specified field and order.
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @param _sort - The field to sort by.
 * @param _order - The order to sort by (either "asc" or "desc").
 * @returns A number indicating the sort order.
 */
export function sortArray<T>(a: T, b: T, _sort: string, _order: string): number {
  const sort = _sort as keyof T;
  const aField = a[sort];
  const bField = b[sort];

  if (typeof aField === "number" && typeof bField === "number") {
    if (_order === "asc") {
      return aField > bField ? 1 : -1;
    }
    if (_order === "desc") {
      return bField > aField ? 1 : -1;
    }
  }
  if (typeof aField === "string" && typeof bField === "string") {
    if (isDateValid(aField) && isDateValid(bField)) {
      if (_order === "asc") {
        return sortByDate(aField, bField);
      }
      if (_order === "desc") {
        return sortByDate(bField, aField);
      }
    }
    if (_order === "asc") {
      return aField.localeCompare(bField);
    }
    if (_order === "desc") {
      return bField.localeCompare(aField);
    }
  }

  return 0;
}
