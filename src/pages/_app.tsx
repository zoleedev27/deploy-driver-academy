import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next";
import CookieConsent from "../components/CookieConsent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {ThemeProvider} from "@/components/theme/theme-provider";
import Layout from "@/components/layout/layout";
import { AppPropsWithLayout } from "@/types/noLayout";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppPropsWithLayout) {
 
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <QueryClientProvider client={queryClient}>
         <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div>
               {getLayout(<Component {...pageProps} className = "bg-background mx-auto"/>)}
            </div>
            <CookieConsent />
        </ThemeProvider>
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
