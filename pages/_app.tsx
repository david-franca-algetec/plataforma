import { DevtoolsProvider, DevtoolsPanel } from "@refinedev/devtools";
import { notificationProvider, RefineThemes, ThemedLayoutV2 } from "@refinedev/chakra-ui";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, { DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { Header } from "@components/header";
import { dataProvider } from "../src/rest-data-provider";
import { appWithTranslation, useTranslation } from "next-i18next";
import { authProvider } from "src/authProvider";
import { IconRocket, IconStar, IconUsers } from "@tabler/icons";
import { Logo } from "@components/logo";
import { useState } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// const localStoragePersister = createSyncStoragePersister({
//   storage: window.localStorage,
// });

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
          },
        },
      }),
  );

  const sessionStoragePersister = createSyncStoragePersister({
    storage: typeof window !== "undefined" ? window.sessionStorage : null,
  });

  persistQueryClient({
    queryClient,
    persister: sessionStoragePersister,
  });

  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    const header = () => <Header sticky />;
    const title = () => <Logo />;

    return (
      <ThemedLayoutV2 Header={header} Title={title}>
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
      <ChakraProvider theme={RefineThemes.Purple}>
        <DevtoolsProvider>
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
              {
                name: "users",
                list: "/users",
                create: "/users/create",
                edit: "/users/edit/:id",
                show: "/users/show/:id",
                meta: {
                  canDelete: true,
                  icon: <IconUsers size={16} />,
                },
              },
              {
                name: "demands",
                list: "/demands",
                create: "/demands/create",
                edit: "/demands/edit/:id",
                show: "/demands/show/:id",
                meta: {
                  canDelete: true,
                  icon: <IconRocket size={16} />,
                },
              },
            ]}
            options={{
              reactQuery: {
                clientConfig: queryClient,
              },
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "oif41g-oGzfFh-iqWuJ9",
            }}
          >
            {renderComponent()}
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          <DevtoolsPanel />
        </DevtoolsProvider>
      </ChakraProvider>
    </RefineKbarProvider>
  );
}

export default appWithTranslation(MyApp);
