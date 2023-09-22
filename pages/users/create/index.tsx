import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";

import { FormControl, FormErrorMessage, FormLabel, Input, Select } from "@chakra-ui/react";
import { Create } from "@refinedev/chakra-ui";
import { IResourceComponentsProps, useSelect, useTranslate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

const UserCreate: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const {
    refineCore: { formLoading },
    watch,
    saveButtonProps,
    register,
    formState: { errors },
  } = useForm();

  const { options: rolesOptions } = useSelect({
    resource: "roles",
    optionLabel: "name",
    optionValue: "id",
  });

  const { options: departmentsOptions } = useSelect({
    resource: "departments",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <FormControl mb="3" isInvalid={Boolean(errors?.name)}>
        <FormLabel>{translate("users.fields.name")}</FormLabel>
        <Input
          type="text"
          {...register("name", {
            required: "This field is required",
          })}
        />
        <FormErrorMessage>{errors?.name?.message as string}</FormErrorMessage>
      </FormControl>
      <FormControl mb="3" isInvalid={Boolean(errors?.email)}>
        <FormLabel>{translate("users.fields.email")}</FormLabel>
        <Input
          type="email"
          {...register("email", {
            required: "This field is required",
          })}
        />
        <FormErrorMessage>{errors?.password?.message as string}</FormErrorMessage>
      </FormControl>
      <FormControl mb="3" isInvalid={Boolean(errors?.password)}>
        <FormLabel>{translate("users.fields.password")}</FormLabel>
        <Input
          type="password"
          {...register("password", {
            required: "This field is required",
          })}
        />
        <FormErrorMessage>{errors?.confirmPassword?.message as string}</FormErrorMessage>
      </FormControl>
      <FormControl mb="3" isInvalid={Boolean(errors?.confirmPassword)}>
        <FormLabel>{translate("users.fields.confirmPassword")}</FormLabel>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: true,
            validate: (val: any) => {
              if (watch("password") != val) {
                return translate("users.errors.passwordsNotMatch", "Passwords do not match");
              }
              return;
            },
          })}
        />
        <FormErrorMessage>{errors?.confirmPassword?.message as string}</FormErrorMessage>
      </FormControl>
      <FormControl mb="3" isInvalid={Boolean(errors?.role)}>
        <FormLabel>{translate("users.fields.role")}</FormLabel>
        <Select
          id="roles"
          {...register("role_id", {
            required: true,
          })}
        >
          {rolesOptions
            .slice()
            .sort((a, b) => a.label.localeCompare(b.label))
            ?.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
        </Select>
        <FormErrorMessage>{`${errors.role?.message}`}</FormErrorMessage>
      </FormControl>
      <FormControl mb="3" isInvalid={Boolean(errors?.department)}>
        <FormLabel>{translate("users.fields.department")}</FormLabel>
        <Select
          id="departments"
          {...register("department_id", {
            required: true,
          })}
        >
          {departmentsOptions
            .slice()
            .sort((a, b) => a.label.localeCompare(b.label))
            ?.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
        </Select>
        <FormErrorMessage>{`${errors.department?.message}`}</FormErrorMessage>
      </FormControl>
    </Create>
  );
};

export default UserCreate;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", ["common"]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/users")}`,
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
