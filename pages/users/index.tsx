import React from "react";
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { HttpError, useExport, useList, useTranslate } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import {
  EditButton,
  ShowButton,
  DeleteButton,
  EmailField,
  DateField,
  List,
  ExportButton,
  CreateButton,
  TagField,
  TextField,
} from "@refinedev/chakra-ui";
import { HStack } from "@chakra-ui/react";
import { TableChakra } from "@components/table/Table";

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
  const columns = React.useMemo<ColumnDef<IUser>[]>(
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
          filterOperator: "contains",
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
          filterOperator: "contains",
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
    [translate],
  );

  const { data: usersData } = useList<IUser[], HttpError>({
    resource: "users",
  });

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
    pageSize: 10,
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
      <TableChakra columns={columns} data={usersData} />
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
