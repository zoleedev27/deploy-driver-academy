import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchData } from "@/hooks/useData";
import { NextPageWithLayout } from "@/types/noLayout";

const queryClient = new QueryClient();

const VerifyAccount: NextPageWithLayout = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useTranslation("auth");

  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setVerificationStatus("error");
      return;
    }

    const verifyToken = () => {
      const storedToken = localStorage.getItem("tokenMock");

      if (token === storedToken) {
        const storedEmail = localStorage.getItem("lastEmail");
        if (storedEmail) {
          setUserEmail(storedEmail);
        }

        setVerificationStatus("success");

        localStorage.setItem("tokenVerified", "true");

        setTimeout(() => {
          router.push("/login");
        }, 5000);
      } else {
        setVerificationStatus("error");
      }
    };

    const timer = setTimeout(() => {
      verifyToken();
    }, 1500);

    return () => clearTimeout(timer);
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-screen py-10 font-body text-black dark:text-white">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2x">
        {verificationStatus === "success" ? (
          <>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                {t("sign.up.verify.account.title.success")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("sign.up.verify.account.description.success", {
                  email: userEmail,
                })}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => router.push("/login")} className="flex-1">
                {t("sign.up.verify.account.buttons.login")}
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                {t("sign.up.verify.account.buttons.home")}
              </Button>
            </CardFooter>
          </>
        ) : verificationStatus === "error" ? (
          <>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                  <XCircle className="h-10 w-10 text-red-600 dark:text-red-300" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                {t("sign.up.verify.account.title.error")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("sign.up.verify.account.description.error")}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => router.push("/signup")}
                className="flex-1"
              >
                {t("sign.up.verify.account.buttons.register")}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 flex-1"
                onClick={() => router.push("/")}
              >
                {t("sign.up.verify.account.buttons.home")}
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full border-4 border-green-500 border-t-transparent animate-spin h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {t("sign.up.verify.account.title.loading")}
            </CardTitle>
            <CardDescription>
              {t("sign.up.verify.account.description.loading")}
            </CardDescription>
          </CardHeader>
        )}
      </Card>
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

VerifyAccount.getLayout = (page) => page;
export default VerifyAccount;
