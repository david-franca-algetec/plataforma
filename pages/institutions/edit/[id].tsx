import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";

import React from "react";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Edit } from "@refinedev/chakra-ui";
import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useForm } from "@refinedev/react-hook-form";

const InstitutionEdit: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const {
    refineCore: { formLoading },
    saveButtonProps,
    register,
    formState: { errors },
  } = useForm();

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <FormControl mb="3" isInvalid={!!(errors as any)?.id}>
        <FormLabel>{translate("institutions.fields.id")}</FormLabel>
        <Input
          disabled
          type="number"
          {...register("id", {
            required: "This field is required",
            valueAsNumber: true,
          })}
        />
        <FormErrorMessage>{(errors as any)?.id?.message as string}</FormErrorMessage>
      </FormControl>
      <FormControl mb="3" isInvalid={!!(errors as any)?.name}>
        <FormLabel>{translate("institutions.fields.name")}</FormLabel>
        <Input
          type="text"
          {...register("name", {
            required: "This field is required",
          })}
        />
        <FormErrorMessage>{(errors as any)?.name?.message as string}</FormErrorMessage>
      </FormControl>
    </Edit>
  );
};

export default InstitutionEdit;

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
