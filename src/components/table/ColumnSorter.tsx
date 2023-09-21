import { IconButton } from "@chakra-ui/react";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons";
import type { Column } from "@tanstack/react-table";

type Props<D extends object> = {
  column: Column<D>;
};

export const ColumnSorter = <D extends object>({ column }: Props<D>) => {
  if (!column.getCanSort()) {
    return null;
  }

  const sorted = column.getIsSorted();

  return (
    <IconButton
      aria-label="Sort"
      size="xs"
      marginX={1}
      onClick={column.getToggleSortingHandler()}
      icon={
        <>
          {!sorted && <IconSelector size={18} />}
          {sorted === "asc" && <IconChevronDown size={18} />}
          {sorted === "desc" && <IconChevronUp size={18} />}
        </>
      }
    />
  );
};
