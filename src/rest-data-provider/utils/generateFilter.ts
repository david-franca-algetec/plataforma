import { CrudFilters } from "@refinedev/core";
import { mapOperator } from "./mapOperator";

/**
 * Generates a filter object to be used in a REST API request.
 * @param filters An array of filters to be applied to the request.
 * @returns An object containing the filters to be used in the request.
 * @throws An error if the filter operator is not supported.
 */
export const generateFilter = (filters?: CrudFilters) => {
  const queryFilters: { [key: string]: string } = {};

  if (filters) {
    filters.forEach((filter) => {
      if (filter.operator === "or" || filter.operator === "and") {
        throw new Error(
          `[@refinedev/simple-rest]: \`operator: ${filter.operator}\` is not supported. You can create custom data provider. https://refine.dev/docs/api-reference/core/providers/data-provider/#creating-a-data-provider`,
        );
      }

      if ("field" in filter) {
        const { field, operator, value } = filter;

        if (field === "q") {
          queryFilters[field] = value;
          return;
        }

        const mappedOperator = mapOperator(operator);
        queryFilters[`${field}${mappedOperator}`] = value;
      }
    });
  }

  return queryFilters;
};
