import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";
import { authProvider } from "src/authProvider";

import { HStack, Select } from "@chakra-ui/react";
import { FilterElementProps } from "@components/table/ColumnFilter";
import { TableChakra } from "@components/table/Table";
import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  EmailField,
  ExportButton,
  List,
  ShowButton,
  TagField,
  TextField,
} from "@refinedev/chakra-ui";
import { useExport, useSelect, useTranslate } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";

type IUser = {
  id: number;
  email: string;
  role: string;
  department: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export default function UsersList() {
  const translate = useTranslate();

  const { options: rolesOptions } = useSelect({
    resource: "roles",
    optionLabel: "name",
    optionValue: "name",
  });

  const { options: departmentsOptions } = useSelect({
    resource: "departments",
    optionLabel: "name",
    optionValue: "name",
  });

  const columns = useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: translate("users.fields.name"),
        meta: {
          filterOperator: "contains",
        },
        cell: function render({ getValue }) {
          return <TextField value={getValue<string>()} noOfLines={1} w={120} />;
        },
      },
      {
        id: "email",
        accessorKey: "email",
        header: translate("users.fields.email"),
        meta: {
          filterOperator: "contains",
        },
        cell: function render({ getValue }) {
          return <EmailField value={getValue<string>()} noOfLines={1} maxW={150} />;
        },
      },
      {
        id: "role",
        accessorKey: "role",
        header: translate("users.fields.role"),
        meta: {
          filterElement: function render(props: FilterElementProps) {
            return (
              <Select borderRadius="md" size="sm" placeholder={translate("table.filters.select")} {...props}>
                {rolesOptions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            );
          },
          filterOperator: "eq",
        },
        cell: function render({ getValue }) {
          return <TextField value={getValue<string>()} noOfLines={1} w={150} />;
        },
      },
      {
        id: "department",
        accessorKey: "department",
        header: translate("users.fields.department"),
        meta: {
          filterElement: function render(props: FilterElementProps) {
            return (
              <Select borderRadius="md" size="sm" placeholder={translate("table.filters.select")} {...props}>
                {departmentsOptions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            );
          },
          filterOperator: "eq",
        },
        cell: function render({ getValue }) {
          return <TagField value={getValue<string>()} />;
        },
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: translate("users.fields.created_at"),
        enableColumnFilter: false,
        cell: function render({ getValue }) {
          return <DateField value={getValue<string>()} format="DD/MM/YYYY" w={120} textAlign="center" />;
        },
      },
      {
        id: "updated_at",
        accessorKey: "updated_at",
        header: translate("users.fields.updated_at"),
        enableColumnFilter: false,
        cell: function render({ getValue }) {
          return <DateField value={getValue<string>()} format="DD/MM/YYYY" w={150} textAlign="center" />;
        },
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "Actions",
        enableSorting: false,
        enableColumnFilter: false,
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
    [translate, rolesOptions, departmentsOptions]
  );

  const { triggerExport, isLoading: exportLoading } = useExport<IUser>({
    mapData: (item) => {
      return {
        ID: item.id,
        [`${translate("users.fields.name").replace(" ", "_")}`]: item.name,
        [`${translate("users.fields.email").replace(" ", "_")}`]: item.email,
        [`${translate("users.fields.role").replace(" ", "_")}`]: item.role,
        [`${translate("users.fields.department").replace(" ", "_")}`]: item.department,
        [`${translate("users.fields.created_at").replace(" ", "_")}`]: item.created_at,
        [`${translate("users.fields.updated_at").replace(" ", "_")}`]: item.updated_at,
      };
    },
    pageSize: 50,
    maxItemCount: 50,
  });

  return (
    <List
      headerButtons={
        <>
          <ExportButton loading={exportLoading} onClick={triggerExport} />
          <CreateButton />
        </>
      }
    >
      <TableChakra columns={columns} />
    </List>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", ["common"]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/institutions")}`,
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
