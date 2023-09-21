import { notificationProvider, RefineThemes, ThemedLayoutV2 } from "@refinedev/chakra-ui";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, { DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";

import { ChakraProvider } from "@chakra-ui/react";
import { Header } from "@components/header";
import { dataProvider } from "../src/rest-data-provider";
import { appWithTranslation, useTranslation } from "next-i18next";
import { authProvider } from "src/authProvider";
import { IconStar } from "@tabler/icons";
import { Logo } from "@components/logo";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayoutV2 Header={() => <Header sticky />} Title={() => <Logo />}>
        <Component {...pageProps} />
      </ThemedLayoutV2>
    );
  };

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <RefineKbarProvider>
      {/* You can change the theme colors here. example: theme={RefineThemes.Magenta} */}
      <ChakraProvider theme={RefineThemes.Blue}>
        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider(`${baseUrl}/api`)}
          notificationProvider={notificationProvider}
          authProvider={authProvider}
          i18nProvider={i18nProvider}
          resources={[
            {
              name: "institutions",
              list: "/institutions",
              create: "/institutions/create",
              edit: "/institutions/edit/:id",
              show: "/institutions/show/:id",
              meta: {
                canDelete: true,
                icon: <IconStar size={16} />,
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            projectId: "ihU966-bmRkNQ-p3i3Hr",
          }}
        >
          {renderComponent()}
          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
      </ChakraProvider>
    </RefineKbarProvider>
  );
}

export default appWithTranslation(MyApp);
