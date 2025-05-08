import {z} from "zod";

export const getSchemaRegister = (t: (key: string) => string) => z.object({
        name: z.string().min(3, { message: t("auth.register.validation.name") }),
        email: z.string().email({ message: t("auth.register.validation.email") }),
        password : z.string().min(8, { message: t("auth.forgotPassword.resetPassword.validation.minLength") })
        .regex(/[A-Z]/, { message: t("auth.forgotPassword.resetPassword.validation.uppercase") })
        .regex(/[a-z]/, { message: t("auth.forgotPassword.resetPassword.validation.lowercase") })
        .regex(/[0-9]/, { message: t("auth.forgotPassword.resetPassword.validation.number") })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least 1 special character" }),
        confirmPassword : z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t("sign.up.forgot.password.reset.password.validation.mismatch"),
        path : ["confirmPassword"],
    });

    