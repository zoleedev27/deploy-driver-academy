import { z } from "zod";

export const getSchema = (t: (key: string) => string) => {
   return z.object({email: z.string().email({message : t("forgot.password.email.reset.validation.invalid.email")}),});
}

