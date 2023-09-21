import { AuthPage } from "@refinedev/chakra-ui";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { Image } from "@chakra-ui/image";
import { useColorMode } from "@chakra-ui/react";

export default function Login() {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const { colorMode } = useColorMode();
  return (
    <AuthPage
      type="login"
      rememberMe={false}
      forgotPasswordLink={false}
      registerLink={false}
      title={
        <Image
          src={colorMode === "light" ? `${baseUrl}/images/logo.png` : `${baseUrl}/images/logo-branca.png`}
          alt="Logo"
          width="200px"
        />
      }
    />
  );
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
