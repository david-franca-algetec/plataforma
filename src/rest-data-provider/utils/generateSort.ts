import { CrudSorting } from "@refinedev/core";

/**
 * Generates a sort object to be used in a REST API call based on an array of sorters.
 * @param sorters An array of sorters to be used in the sort object.
 * @returns A sort object containing the fields and orders to be used in a REST API call.
 */
export const generateSort = (sorters?: CrudSorting) => {
  if (sorters && sorters.length > 0) {
    const _sort: string[] = [];
    const _order: string[] = [];

    sorters.forEach((item) => {
      _sort.push(item.field);
      _order.push(item.order);
    });

    return {
      _sort,
      _order,
    };
  }

  return null;
};
