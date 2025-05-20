import { NextPageWithLayout } from "@/types/noLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, CheckCircle2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";
import { getSchemaResetPassword } from "@/types/SchemaResetPassword";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "next-i18next";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchData } from "@/hooks/useData";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const ResetPassword: NextPageWithLayout = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { t } = useTranslation("auth");
  const schema = getSchemaResetPassword(t);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const token = params.get("token");
  const emailUser = localStorage.getItem("resetEmail");
  const { resetPassword } = useAuth();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!token) {
      setError(t("forgot.password.reset.password.errors.invalid.token"));
      return;
    }
    if (!emailUser) {
      setError(t("forgot.password.reset.password.errors.invalid.email"));
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await resetPassword({
        email: emailUser,
        token: token,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(t("forgot.password.reset.password.errors.general"));
    } finally {
      setIsLoading(false);
    }
  };

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const isValidPassword =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^a-zA-Z0-9]/.test(password);
  const isConfirmValid =
    confirmPassword.length > 0 && confirmPassword === password;

  return (
    <div className="flex items-center justify-center min-h-screen py-10 font-body text-black dark:text-white">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        {!token ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {t("forgot.password.reset.password.invalid.title")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("forgot.password.reset.password.invalid.description")}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/forgot-password")}>
                {t("forgot.password.reset.password.invalid.button")}
              </Button>
            </CardFooter>
          </>
        ) : isSuccess ? (
          <>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-300" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                {t("forgot.password.reset.password.success.title")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("forgot.password.reset.password.success.description")}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center items-center">
              <Button
                variant="link"
                onClick={() => `${router.push("/")}`}
                className="hover:text-green-400"
              >
                <span>
                  {t("forgot.password.reset.password.success.button.home")}
                </span>
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-background border-2">
                  <Lock className="h-10 w-10" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">
                {t("forgot.password.reset.password.title")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("forgot.password.reset.password.description")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {token && (
                <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <AlertDescription className="text-xs">
                    <p className="font-medium">
                      {t("forgot.password.reset.password.alert.title")}
                    </p>
                    <p>
                      Email: <span className="font-mono">{emailUser}</span>
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "forgot.password.reset.password.form.password.label"
                          )}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder={t(
                                "forgot.password.reset.password.form.password.placeholder"
                              )}
                              className={`transition-all duration-150 ring-1 ring-offset-0 ${
                                password.length === 0 ? "ring-gray-300" : ""
                              } ${
                                password.length > 0 && isValidPassword
                                  ? "ring-2 ring-green-500 focus:ring-green-500"
                                  : ""
                              } ${
                                password.length > 0 && !isValidPassword
                                  ? "ring-2 ring-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {!showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "forgot.password.reset.password.form.confirm.password.label"
                          )}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder={t(
                                "forgot.password.reset.password.form.confirm.password.placeholder"
                              )}
                              {...field}
                              className={`transition-all duration-150 ring-1 ring-offset-0 ${
                                confirmPassword.length === 0
                                  ? "ring-gray-300"
                                  : ""
                              } ${
                                confirmPassword.length > 0 && isConfirmValid
                                  ? "ring-2 ring-green-500 focus:ring-green-500"
                                  : ""
                              } ${
                                confirmPassword.length > 0 && !isConfirmValid
                                  ? "ring-2 ring-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {!showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      {t("forgot.password.reset.password.requirements.title")}
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        {t(
                          "forgot.password.reset.password.requirements.min.length"
                        )}
                      </li>
                      <li>
                        {t(
                          "forgot.password.reset.password.requirements.uppercase"
                        )}
                      </li>
                      <li>
                        {t(
                          "forgot.password.reset.password.requirements.lowercase"
                        )}
                      </li>
                      <li>
                        {t(
                          "forgot.password.reset.password.requirements.number"
                        )}
                      </li>
                      <li>
                        {t(
                          "forgot.password.reset.password.requirements.special"
                        )}
                      </li>
                    </ul>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        {t("forgot.password.reset.password.processing")}
                      </span>
                    ) : (
                      <span>{t("forgot.password.reset.password.button")}</span>
                    )}
                  </Button>
                  <div className="pt-2 flex justify-center items-center">
                    <Button
                      variant="link"
                      onClick={() => router.push("/")}
                      type="button"
                    >
                      {t("forgot.password.email.reset.back.home")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </>
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

ResetPassword.getLayout = (page) => page;
export default ResetPassword;
