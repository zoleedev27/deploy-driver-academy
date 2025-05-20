import Head from "next/head";
import LoginForm from "@/components/LoginForm";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchData } from "@/hooks/useData";
import { NextPageWithLayout } from "@/types/noLayout";
const queryClient = new QueryClient();
const LoginPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
        <LoginForm />
      </main>
    </>
  );
};

LoginPage.getLayout = (page) => page;
export default LoginPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale ?? "en", [
    "common",
    "signUp",
    "auth",
  ]);

  await queryClient.fetchQuery({
    queryKey: ["data"],
    queryFn: fetchData,
  });

  return {
    props: {
      dehydrateState: dehydrate(queryClient),
      ...translations,
    },
  };
};
