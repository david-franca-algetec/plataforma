import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";

import { IResourceComponentsProps, useShow, useTranslate } from "@refinedev/core";
import { DateField, NumberField, Show, TextField } from "@refinedev/chakra-ui";
import { Heading } from "@chakra-ui/react";
import { FC } from "react";

const InstitutionShow: FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Heading as="h5" size="sm" mt={4}>
        {translate("institutions.fields.id")}
      </Heading>
      <NumberField value={record?.id ?? ""} />
      <Heading as="h5" size="sm" mt={4}>
        {translate("institutions.fields.name")}
      </Heading>
      <TextField value={record?.name} />
      <Heading as="h5" size="sm" mt={4}>
        {translate("institutions.fields.created_at")}
      </Heading>
      <DateField value={record?.created_at} />
      <Heading as="h5" size="sm" mt={4}>
        {translate("institutions.fields.updated_at")}
      </Heading>
      <DateField value={record?.updated_at} />
    </Show>
  );
};

export default InstitutionShow;

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
