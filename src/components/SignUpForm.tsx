// src/components/SignUpForm.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound } from "lucide-react";
import * as z from "zod";
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
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useRouter } from "next/router";
import {
  findMockUserByEmail,
  generateVerificationToken,
  initMockDataVerified,
  registerMockUser,
  sendMockVerificationEmail,
} from "@/constants/MockUsersVerified";

export default function SignUpForm({ className = "" }: { className?: string }) {
  const { t } = useTranslation("common");
  const router = useRouter();

  const formSchema = z
    .object({
      name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
      }),
      email: z.string().email({
        message: "Invalid email address.",
      }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, {
          message: "Password must contain at least 1 uppercase character",
        })
        .regex(/[a-z]/, {
          message: "Password must contain at least 1 lowercase character",
        })
        .regex(/[0-9]/, { message: "Password must contain at least 1 digit" })
        .regex(/[^A-Za-z0-9]/, {
          message: "Password must contain at least 1 special character",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type SignUpSchema = z.infer<typeof formSchema>;
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    special: false,
  });

  // Watch the password field and update requirements
  const passwordValue = form.watch("password");

  // Watch the password field and update requirements
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

  useEffect(() => {
    initMockDataVerified();
  }, []);

  const onSubmit = async (data: SignUpSchema) => {
    try {
      if (findMockUserByEmail(data.email)) {
        return;
      }

      const newUser = registerMockUser(data.name, data.email, data.password);
      const token = generateVerificationToken(newUser.id, newUser.email);

      if (!token) {
        return;
      }

      await sendMockVerificationEmail(newUser.email, token);
      router.push(
        `/signup/instructions-email?email=${encodeURIComponent(data.email)}`
      );
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-xl p-8 w-full max-w-md md:max-w-lg mx-auto ${className}`}
        >
          {/* User icon header */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="p-3 rounded-full bg-background border-2 border-black dark:border-white">
              <UserRound className="h-10 w-10 text-black dark:text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
              {t("signup.createAccount", "Create Account")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Enter your information to create your account
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  {t("signup.nameLabel", "Name")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("signup.namePlaceholder", "Your name")}
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  {t("signup.emailLabel", "Email")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t(
                      "signup.emailPlaceholder",
                      "your.email@example.com"
                    )}
                    type="email"
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
                <FormLabel className="text-gray-700 dark:text-gray-300">
                  {t("signup.passwordLabel", "Password")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder={t(
                        "signup.passwordPlaceholder",
                        "Create a password"
                      )}
                      type={showPassword ? "text" : "password"}
                      className={`dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                        passwordRequirements.length &&
                        passwordRequirements.uppercase &&
                        passwordRequirements.lowercase &&
                        passwordRequirements.digit &&
                        passwordRequirements.special
                          ? "ring-2 ring-green-500 ring-opacity-50 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                          : ""
                      }`}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
                <div className="text-xs mt-2">
                  <p className="mb-1 text-gray-600 dark:text-gray-400">
                    {t("signup.passwordRequirements", "Password must contain:")}
                  </p>
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
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {t(
                          "signup.passwordRequirementLength",
                          "At least 8 characters"
                        )}
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
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {t(
                          "signup.passwordRequirementUppercase",
                          "At least 1 uppercase letter"
                        )}
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
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {t(
                          "signup.passwordRequirementLowercase",
                          "At least 1 lowercase letter"
                        )}
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
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {t(
                          "signup.passwordRequirementDigit",
                          "At least 1 digit"
                        )}
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
                            : "text-gray-600 dark:text-gray-400"
                        }
                      >
                        {t(
                          "signup.passwordRequirementSpecial",
                          "At least 1 special character"
                        )}
                      </span>
                    </li>
                  </ul>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
