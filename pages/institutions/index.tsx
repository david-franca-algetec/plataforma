import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FC, useMemo } from "react";
import { IInstitution } from "src/interfaces/institutions";

import { Checkbox, HStack } from "@chakra-ui/react";
import { TableChakra } from "@components/table/Table";
import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  ExportButton,
  List,
  ShowButton,
} from "@refinedev/chakra-ui";
import { IResourceComponentsProps, useExport, useTranslate } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";

import { authProvider } from "../../src/authProvider";

const InstitutionsList: FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const columns = useMemo<ColumnDef<IInstitution>[]>(
    () => [
      {
        id: "selection",
        accessorKey: "id",
        enableSorting: false,
        enableColumnFilter: false,
        header: function render({ table }) {
          return (
            <HStack>
              <Checkbox
                checked={table.getIsAllRowsSelected()}
                isIndeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            </HStack>
          );
        },
        cell: function render({ row }) {
          return (
            <HStack spacing="3">
              <Checkbox
                id="row-select"
                isChecked={row.getIsSelected()}
                isIndeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
              />
            </HStack>
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        header: translate("institutions.fields.name"),
        meta: {
          filterOperator: "contains",
        },
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: translate("institutions.fields.created_at"),
        enableColumnFilter: false,
        cell: function render({ getValue }) {
          return <DateField value={getValue<string>()} format="DD/MM/YYYY" />;
        },
      },
      {
        id: "updated_at",
        accessorKey: "updated_at",
        header: translate("institutions.fields.updated_at"),
        enableColumnFilter: false,
        cell: function render({ getValue }) {
          return <DateField value={getValue<string>()} format="DD/MM/YYYY" />;
        },
      },
      {
        id: "actions",
        accessorKey: "id",
        header: translate("institutions.fields.actions"),
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

  const { triggerExport, isLoading: exportLoading } = useExport<IInstitution>({
    mapData: (item) => {
      return {
        ID: item.id,
        [`${translate("institutions.fields.name").replace(" ", "_")}`]: item.name,
        [`${translate("institutions.fields.created_at").replace(" ", "_")}`]: item.created_at,
        [`${translate("institutions.fields.updated_at").replace(" ", "_")}`]: item.updated_at,
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
};

export default InstitutionsList;

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
