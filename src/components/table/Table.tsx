import { Table, TableContainer, Tbody, Th, Thead, Tr, Td, HStack } from "@chakra-ui/react";
import React from "react";
import { ColumnSorter } from "./ColumnSorter";
import { ColumnFilter } from "./ColumnFilter";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Pagination } from "@components/pagination";
import { TextField } from "@refinedev/chakra-ui";
import { HttpError } from "@refinedev/core";

type TableChakraProps<D extends object> = {
  columns: ColumnDef<D>[];
};

export function TableChakra<D extends object>({ columns }: TableChakraProps<D>) {
  const {
    getHeaderGroups,
    getRowModel,
    setOptions,
    refineCore: {
      setCurrent,
      pageCount,
      current,
      tableQueryResult: { data: tableData },
    },
  } = useTable<D, HttpError>({
    columns,
  });

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
      tableData,
    },
  }));

  return (
    <>
      <TableContainer whiteSpace="pre-line" h={500} overflowY="auto">
        <Table variant="striped">
          <Thead>
            {getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    <HStack>
                      <TextField
                        value={!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                      />
                      <ColumnSorter column={header.column} />
                      <ColumnFilter column={header.column} />
                    </HStack>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination current={current} pageCount={pageCount} setCurrent={setCurrent} />
    </>
  );
}
