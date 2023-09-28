import { AuthPage } from "@refinedev/chakra-ui";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { useColorMode } from "@chakra-ui/react";
import { Logo } from "@components/logo";

export default function Login() {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const { colorMode } = useColorMode();
  return <AuthPage type="login" rememberMe={false} forgotPasswordLink={false} registerLink={false} title={<Logo />} />;
}

Login.noLayout = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", ["common"]);

  if (authenticated) {
    return {
      props: {},
      redirect: {
        destination: redirectTo ?? "/",
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
