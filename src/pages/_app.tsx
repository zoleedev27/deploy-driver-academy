import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next";
import CookieConsent from "../components/CookieConsent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Layout from "@/components/layout/layout";
import { AppPropsWithLayout } from "@/types/noLayout";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div>
          <Layout>
            <Component {...pageProps} className="mx-auto" />
          </Layout>
        </div>
        <CookieConsent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
