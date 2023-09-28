export interface Filter {
  key: string;
  value?: string | string[];
}

/**
 * Filters an array of objects based on an array of filters.
 * @param array The array to filter.
 * @param filters An array of filters to apply to the array.
 * @returns The filtered array.
 */
export function filterArray<T>(array: T[], filters: Filter[]): T[] {
  return array.filter((item) => {
    return filters.every((filter) => {
      const itemKey = filter.key as keyof T;
      const itemValue = String(item[itemKey]);
      if (Array.isArray(filter.value)) {
        return filter.value.some((value) => itemValue.toLowerCase().includes(value.toLowerCase()));
      }
      if (typeof filter.value === "string") {
        return itemValue.toLowerCase().includes(filter.value.toLowerCase());
      }
      return true;
    });
  });
}
