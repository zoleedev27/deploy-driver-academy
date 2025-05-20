import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/schema";
import { useState } from "react";
import { Eye, EyeOff, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

export default function LoginForm() {
  const { t } = useTranslation("common");
  const { login } = useAuth();
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginSchema) => {
    try {
      setIsLoading(true);
      await login({
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("currentEmail", data.email);
      router.push("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 py-10 bg-background">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 bg-white dark:bg-secondary shadow-md rounded-xl p-8 w-full max-w-md md:max-w-lg mx-auto"
        >
          <div className="flex flex-col items-center space-y-4 mb-4">
            <div className="p-3 rounded-full bg-background border-2 border-black dark:border-white">
              <UserRound className="h-10 w-10 text-black dark:text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
              {t("login.title")}
            </h2>
            <p className="text-sm text-center text-muted-foreground">
              {t("login.subtitle")}
            </p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.emailLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("login.emailPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login.passwordLabel")}</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.passwordPlaceholder")}
                      className="w-full pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="-mt-2 mb-2">
            <Button
              variant="link"
              className="p-0 text-sm text-left"
              onClick={() => router.push("/forgot-password")}
              type="button"
            >
              {t("login.back.to.forgot.password")}
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-red-900 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                {t("login.loading")}
              </span>
            ) : (
              t("login.submit")
            )}
          </Button>

          <div className="pt-2 flex justify-center items-center space-x-6">
            <Button
              variant="link"
              onClick={() => router.push("/signup")}
              type="button"
            >
              {t("login.back.to.register")}
            </Button>
            <Button
              variant="link"
              onClick={() => router.push("/")}
              type="button"
            >
              {t("login.back.to.home")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
