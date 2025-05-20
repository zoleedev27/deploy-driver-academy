import { NextPageWithLayout } from "@/types/noLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import { fetchData } from "@/hooks/useData";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient, dehydrate } from "@tanstack/react-query";
const queryClient = new QueryClient();

const VerificationsEmail: NextPageWithLayout = () => {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const params = useSearchParams();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [email, setEmail] = useState<string>("");
  const [canResend, setCanResend] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(120);
  const [mockToken, setMockToken] = useState<string | null>(null);

  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setCountdown(120);
    setCanResend(false);

    timerRef.current = setInterval(() => {
      setCountdown((count) => {
        if (count <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setCanResend(true);
          return 0;
        }
        return count - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const searchEmail = params.get("email");
    if (searchEmail) {
      setEmail(searchEmail);
      localStorage.setItem("lastEmail", searchEmail);
    }

    const generateToken = () => {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36)
      );
    };

    const userToken = generateToken();
    localStorage.setItem("tokenMock", userToken);

    if (userToken) {
      setMockToken(userToken);
    }

    startCountdown();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [params]);

  const toConfirmAccount = () => {
    if (mockToken) {
      router.push(`/signup/confirm-account?token=${mockToken}`);
    }
  };

  const handleResendEmail = async () => {
    const generateToken = () => {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36)
      );
    };

    const newToken = generateToken();
    localStorage.setItem("tokenMock", newToken);
    setMockToken(newToken);

    startCountdown();
  };

  return (
    <div className="flex items-center justify-center min-h-screen font-body text-black dark:text-white py-10">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2x">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-background border-2">
              <Mail className="h-10 w-10" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {t("sign.up.instructions.email.title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("sign.up.instructions.email.description")}
            <span className="font-bold hover:text-red-900"> {email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="mb-2">
              {t("sign.up.instructions.email.next.steps.title")}
            </h3>
            <ol className="list-decimal list-inside text-sm">
              <li>{t("sign.up.instructions.email.next.steps.step1")}</li>
              <li>{t("sign.up.instructions.email.next.steps.step2")}</li>
              <li>{t("sign.up.instructions.email.next.steps.step3")}</li>
            </ol>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            {canResend ? (
              <Button
                variant="link"
                onClick={handleResendEmail}
                className="p-0 h-auto"
              >
                <div className="flex items-center gap-1 justify-center hover:text-green-400">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  <span>
                    {t("sign.up.instructions.email.resend.link.text")}
                  </span>
                </div>
              </Button>
            ) : (
              <p className="text-orange-500 dark:text-orange-300">
                {t("sign.up.instructions.email.resend.timer", { countdown })}
              </p>
            )}
          </div>

          {mockToken && (
            <Alert className="mt-4 bg-amber-100 dark:bg-amber-900 border border-amber-300 dark:border-amber-800 rounded-lg">
              <AlertDescription className="text-sm text-amber-800 dark:text-amber-100">
                <p className="mb-1 font-medium">
                  {t("sign.up.instructions.email.test.title")}
                </p>
                <p className="mb-2">
                  {t("sign.up.instructions.email.test.description")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm bg-amber-200 dark:bg-amber-700 hover:bg-amber-300 dark:hover:bg-amber-600 text-amber-900 dark:text-white border-amber-300 dark:border-amber-600 rounded-md"
                  onClick={toConfirmAccount}
                >
                  <div className="flex items-center gap-1 justify-center">
                    <ExternalLink className="ml-1 h-3 w-3" />
                    <span>{t("sign.up.instructions.email.test.button")}</span>
                  </div>
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button
            variant="link"
            onClick={() => router.push("/")}
            className="hover:text-red-900"
          >
            <span>{t("sign.up.instructions.email.back.home")}</span>
          </Button>
        </CardFooter>
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

VerificationsEmail.getLayout = (page) => page;
export default VerificationsEmail;
