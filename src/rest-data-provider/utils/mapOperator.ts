import { CrudOperators } from "@refinedev/core";

/**
 * Maps a CRUD operator to its corresponding string representation.
 * @param operator The CRUD operator to map.
 * @returns The string representation of the CRUD operator.
 */
export const mapOperator = (operator: CrudOperators): string => {
  switch (operator) {
    case "ne":
    case "gte":
    case "lte":
      return `_${operator}`;
    case "contains":
      return "_like";
    case "eq":
    default:
      return "";
  }
};
