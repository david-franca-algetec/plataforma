import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useMemo } from "react";
import { authProvider } from "src/authProvider";
import { FrontEndDemand } from "src/interfaces/demands";

import { HStack, Wrap, WrapItem } from "@chakra-ui/react";
import { TableChakra } from "@components/table/Table";
import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  ExportButton,
  List,
  ShowButton,
  TagField,
  TextField,
  UrlField,
} from "@refinedev/chakra-ui";
import { useExport, useTranslate } from "@refinedev/core";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

export default function index() {
  const translate = useTranslate();
  const columnHelper = createColumnHelper<FrontEndDemand>();

  const columns2 = [
    columnHelper.accessor("experiment_id", {
      header: translate("demands.fields.experiment_id"),
      cell: function render({ getValue }) {
        const value = getValue<string>();
        return <UrlField value={value} href={`/labs/show/${value}`} target="_blank" />;
      },
    }),
  ];

  const columns = useMemo<ColumnDef<FrontEndDemand>[]>(
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
          return <UrlField value={value} href={`/demands/show/${id}`} target="_blank" noOfLines={1} />;
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
            <Wrap width={200}>
              {getValue<string[]>()?.map((item, index) => (
                <WrapItem>
                  <TagField value={item} key={index} />
                </WrapItem>
              ))}
            </Wrap>
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
        cell: function render({ getValue }) {
          return <TextField noOfLines={1} value={getValue<string>()} width={150} />;
        },
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
        cell: function render({ getValue }) {
          return <TextField noOfLines={1} value={getValue<string>()} width={150} />;
        },
      },
      {
        id: "modeling",
        accessorKey: "modeling",
        header: translate("demands.fields.modeling"),
        cell: function render({ getValue }) {
          return <TextField noOfLines={1} value={getValue<string>()} width={150} />;
        },
      },
      {
        id: "coding",
        accessorKey: "coding",
        header: translate("demands.fields.coding"),
        cell: function render({ getValue }) {
          return <TextField noOfLines={1} value={getValue<string>()} width={150} />;
        },
      },
      {
        id: "testing",
        accessorKey: "testing",
        header: translate("demands.fields.testing"),
        cell: function render({ getValue }) {
          return <TextField noOfLines={1} value={getValue<string>()} width={150} />;
        },
      },
      {
        id: "ualab",
        accessorKey: "ualab",
        header: translate("demands.fields.ualab"),
        cell: function render({ getValue }) {
          return <TextField noOfLines={1} value={getValue<string>()} width={150} />;
        },
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
