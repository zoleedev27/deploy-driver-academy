import { NextPageWithLayout } from "@/types/noLayout";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { fetchData} from "@/hooks/useData";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient, dehydrate } from "@tanstack/react-query";
const queryClient = new QueryClient();

const ForgotPassword : NextPageWithLayout = () => {
    return (
        <div className="flex items-center justify-center min-h-screen px-4 py-10">
            <ForgotPasswordForm />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    const translations = await serverSideTranslations(locale ?? "en", ["auth"]);
  
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

ForgotPassword.getLayout = (page) => page;
export default ForgotPassword;