"use client";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "next-i18next";
import { Eye, EyeOff, Check, X, UserRound } from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpForm() {
  const { t } = useTranslation("signUp");
  const router = useRouter();

  const formSchema = useMemo(
    () =>
      z
        .object({
          first_name: z.string().min(2, {
            message: t("signup.validation.first.name.length"),
          }),
          last_name: z.string().min(2, {
            message: t("signup.validation.last.name.length"),
          }),
          email: z.string().email({
            message: t("signup.validation.invalid.email"),
          }),
          password: z
            .string()
            .min(8, { message: t("signup.validation.password.length") })
            .regex(/[A-Z]/, {
              message: t("signup.validation.password.uppercase"),
            })
            .regex(/[a-z]/, {
              message: t("signup.validation.password.lowercase"),
            })
            .regex(/[0-9]/, { message: t("signup.validation.password.digit") })
            .regex(/[^A-Za-z0-9]/, {
              message: t("signup.validation.password.special"),
            }),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("signup.validation.passwords.match"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  type SignUpSchema = z.infer<typeof formSchema>;

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    special: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const passwordValue = form.watch("password");

  useEffect(() => {
    const updatedRequirements = {
      length: passwordValue.length >= 8,
      uppercase: /[A-Z]/.test(passwordValue),
      lowercase: /[a-z]/.test(passwordValue),
      digit: /[0-9]/.test(passwordValue),
      special: /[^A-Za-z0-9]/.test(passwordValue),
    };
    setPasswordRequirements(updatedRequirements);
  }, [passwordValue]);

  const { register } = useAuth();

  const onSubmit = async (data: SignUpSchema) => {
    try {
      setIsLoading(true);
      await register({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });
      router.push(
        `/signup/instructions-email?email=${encodeURIComponent(data.email)}`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white dark:bg-secondary shadow-md rounded-xl p-8 w-full max-w-md md:max-w-lg mx-auto"
        >
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="p-3 rounded-full bg-background border-2 border-black dark:border-white">
              <UserRound className="h-10 w-10 text-black dark:text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
              {t("signup.page.title")}
            </h2>
            <p className="text-sm text-center">{t("signup.create.account")}</p>
          </div>

          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("signup.first.name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("signup.first.name.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("signup.last.name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("signup.last.name.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("signup.email.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("signup.email.placeholder")}
                    type="email"
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
                <FormLabel>{t("signup.password.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t("signup.password.placeholder")}
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
                <div className="text-xs mt-2">
                  <p className="mb-1">{t("signup.password.requirements")}</p>
                  <ul className="space-y-1">
                    <li className="flex items-center space-x-2">
                      <span
                        className={`flex-shrink-0 ${
                          passwordRequirements.length
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {passwordRequirements.length ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </span>
                      <span
                        className={
                          passwordRequirements.length
                            ? "text-green-700 dark:text-green-500"
                            : "text-white"
                        }
                      >
                        {t("signup.password.requirement.length")}
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span
                        className={`flex-shrink-0 ${
                          passwordRequirements.uppercase
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {passwordRequirements.uppercase ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </span>
                      <span
                        className={
                          passwordRequirements.uppercase
                            ? "text-green-700 dark:text-green-500"
                            : "text-white"
                        }
                      >
                        {t("signup.password.requirement.uppercase")}
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span
                        className={`flex-shrink-0 ${
                          passwordRequirements.lowercase
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {passwordRequirements.lowercase ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </span>
                      <span
                        className={
                          passwordRequirements.lowercase
                            ? "text-green-700 dark:text-green-500"
                            : "text-white"
                        }
                      >
                        {t("signup.password.requirement.lowercase")}
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span
                        className={`flex-shrink-0 ${
                          passwordRequirements.digit
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {passwordRequirements.digit ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </span>
                      <span
                        className={
                          passwordRequirements.digit
                            ? "text-green-700 dark:text-green-500"
                            : "text-white"
                        }
                      >
                        {t("signup.password.requirement.digit")}
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span
                        className={`flex-shrink-0 ${
                          passwordRequirements.special
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {passwordRequirements.special ? (
                          <Check size={16} />
                        ) : (
                          <X size={16} />
                        )}
                      </span>
                      <span
                        className={
                          passwordRequirements.special
                            ? "text-green-700 dark:text-green-500"
                            : "text-white"
                        }
                      >
                        {t("signup.password.requirement.special")}
                      </span>
                    </li>
                  </ul>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("signup.confirm.password.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t("signup.confirm.password.placeholder")}
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {!showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-red-900 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                {t("signup.loading")}
              </span>
            ) : (
              t("signup.submit.button")
            )}
          </Button>
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push("/login")}
              type="button"
            >
              {t("signup.login")}
            </Button>
            <Button
              variant="link"
              onClick={() => router.push("/")}
              type="button"
            >
              {t("signup.back.to.home")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
