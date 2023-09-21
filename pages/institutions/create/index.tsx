import { GetServerSideProps } from "next";
import { authProvider } from "../../../src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Create } from "@refinedev/chakra-ui";
import { FormControl, FormLabel, FormErrorMessage, Input } from "@chakra-ui/react";
import { useForm } from "@refinedev/react-hook-form";
import { FC } from "react";

const InstitutionCreate: FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const {
    refineCore: { formLoading },
    saveButtonProps,
    register,
    formState: { errors },
  } = useForm();

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
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
    </Create>
  );
};

export default InstitutionCreate;

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
