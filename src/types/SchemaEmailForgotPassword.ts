import { z } from "zod";

export const createForgotPasswordSchema = (t: (key: string) => string) => {
  return z.object({
    email: z
      .string()
      .email({ message: t("forgot.password.email.reset.validation.invalid.email") }),
  });
};

export type ForgotPasswordSchema = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
