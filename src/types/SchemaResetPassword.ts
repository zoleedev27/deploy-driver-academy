import { z } from "zod";

export const getSchemaResetPassword = (t: (key: string) => string) => z.object({
        password : z.string().min(8, { message: t("forgot.password.reset.password.validation.min.length") })
        .regex(/[A-Z]/, { message: t("forgot.password.reset.password.validation.uppercase") })
        .regex(/[a-z]/, { message: t("forgot.password.reset.password.validation.lowercase") })
        .regex(/[0-9]/, { message: t("forgot.password.reset.password.validation.number") })
        .regex(/[^A-Za-z0-9]/, { message: t("forgot.password.reset.password.validation.special")}),
        confirmPassword : z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t("forgot.password.reset.password.validation.mismatch"),
        path : ["confirmPassword"],
    });