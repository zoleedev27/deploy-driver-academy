import { NextPageWithLayout } from "@/types/noLayout";
import SignUpForm from "@/components/SignUpForm";
import { fetchData } from "@/hooks/useData";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient, dehydrate } from "@tanstack/react-query";
const queryClient = new QueryClient();

const SignUp: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <SignUpForm />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale ?? "en", [
    "common",
    "layout",
    "auth",
    "signUp",
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

SignUp.getLayout = (page) => page;
export default SignUp;
