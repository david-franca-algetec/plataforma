import React, { FC, useMemo } from "react";
import { GetManyResponse, IResourceComponentsProps, useMany, useTranslate } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { DateField, DeleteButton, EditButton, List, MarkdownField, ShowButton } from "@refinedev/chakra-ui";
import { HStack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { GetServerSideProps } from "next";
import { authProvider } from "../../src/authProvider";
import { Pagination } from "@components/pagination";

const BlogPostList: FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: translate("blog_posts.fields.id"),
      },
      {
        id: "title",
        accessorKey: "title",
        header: translate("blog_posts.fields.title"),
      },
      {
        id: "content",
        accessorKey: "content",
        header: translate("blog_posts.fields.content"),
        cell: function render({ getValue }) {
          return <MarkdownField value={getValue<string>()?.slice(0, 80) + "..."} />;
        },
      },
      {
        id: "category",
        header: translate("blog_posts.fields.category"),
        accessorKey: "category.id",
        cell: function render({ getValue, table }) {
          const meta = table.options.meta as {
            categoryData: GetManyResponse;
          };

          const category = meta.categoryData?.data?.find((item) => item.id == getValue<any>());

          return category?.title ?? "Loading...";
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: translate("blog_posts.fields.status"),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: translate("blog_posts.fields.createdAt"),
        cell: function render({ getValue }) {
          return <DateField value={getValue<any>()} />;
        },
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "Actions",
        cell: function render({ getValue }) {
          return (
            <HStack>
              <ShowButton hideText recordItemId={getValue() as string} />
              <EditButton hideText recordItemId={getValue() as string} />
              <DeleteButton hideText recordItemId={getValue() as string} />
            </HStack>
          );
        },
      },
    ],
    [translate]
  );

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
  } = useTable({
    columns,
  });

  const { data: categoryData } = useMany({
    resource: "categories",
    ids: tableData?.data?.map((item) => item?.category?.id) ?? [],
    queryOptions: {
      enabled: Boolean(tableData?.data),
    },
  });

  setOptions((prev) => ({
    ...prev,
    meta: {
      ...prev.meta,
      categoryData,
    },
  }));

  return (
    <List>
      <TableContainer whiteSpace="pre-line">
        <Table variant="simple">
          <Thead>
            {getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
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
    </List>
  );
};

export default BlogPostList;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", ["common"]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/blog-posts")}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};

