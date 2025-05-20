import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next";
import CookieConsent from "../components/CookieConsent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Layout from "@/components/layout/layout";
import { AppPropsWithLayout } from "@/types/noLayout";
import { Toaster } from "sonner";
import { AuthProvider } from "@/provider/AuthProvider";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div>
                        {getLayout(
                            <Component {...pageProps} className="bg-background mx-auto" />
                        )}
                    </div>
                    <CookieConsent />
                    <Toaster />
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default appWithTranslation(App);