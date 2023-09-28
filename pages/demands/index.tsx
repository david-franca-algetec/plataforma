import { GetServerSideProps } from "next";
import React, { useMemo } from "react";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useExport, useTranslate } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";
import { HStack } from "@chakra-ui/react";
import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  ExportButton,
  List,
  ShowButton,
  TagField,
  UrlField,
} from "@refinedev/chakra-ui";
import { TableChakra } from "@components/table/Table";

export default function index() {
  const translate = useTranslate();
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "experiment_id",
        accessorKey: "experiment_id",
        header: translate("demands.fields.experiment_id"),
        cell: function render({ getValue }) {
          const value = getValue<string>();
          return <UrlField value={value} href={`/labs/show/${value}`} target="_blank" />;
        },
      },
      {
        id: "experiment_name",
        accessorKey: "experiment_name",
        header: translate("demands.fields.experiment_name"),
        cell: function render({ getValue, row }) {
          const id = row.original.id;
          const value = getValue<string>();
          return <UrlField value={value} href={`/demands/show/${id}`} target="_blank" />;
        },
      },
      {
        id: "institution_name",
        accessorKey: "institution_name",
        header: translate("demands.fields.institution_name"),
      },
      {
        id: "tags",
        accessorKey: "tags",
        header: translate("demands.fields.tags"),
        cell: function render({ getValue }) {
          return (
            <HStack>
              {getValue<string[]>()?.map((item, index) => (
                <TagField value={item} key={index} />
              ))}
            </HStack>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: translate("demands.fields.status"),
      },
      {
        id: "creator_name",
        accessorKey: "creator_name",
        header: translate("demands.fields.creator_name"),
      },
      {
        id: "deadline",
        accessorKey: "deadline",
        header: translate("demands.fields.deadline"),
        cell: function render({ getValue }) {
          return <DateField value={getValue<string>()} />;
        },
      },
      {
        id: "scripting",
        accessorKey: "scripting",
        header: translate("demands.fields.scripting"),
      },
      {
        id: "modeling",
        accessorKey: "modeling",
        header: translate("demands.fields.modeling"),
      },
      {
        id: "coding",
        accessorKey: "coding",
        header: translate("demands.fields.coding"),
      },
      {
        id: "testing",
        accessorKey: "testing",
        header: translate("demands.fields.testing"),
      },
      {
        id: "ualab",
        accessorKey: "ualab",
        header: translate("demands.fields.ualab"),
      },
      {
        id: "designing",
        accessorKey: "designing",
        header: translate("demands.fields.designing"),
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "Actions",
        cell: function render({ getValue }) {
          return (
            <HStack>
              <ShowButton hideText recordItemId={getValue<number>()} />
              <EditButton hideText recordItemId={getValue<number>()} />
              <DeleteButton hideText recordItemId={getValue<number>()} />
            </HStack>
          );
        },
      },
    ],
    [translate]
  );

  const { triggerExport, isLoading: exportLoading } = useExport({
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
