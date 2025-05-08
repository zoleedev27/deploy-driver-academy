import {z} from 'zod';

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must be at most 20 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[\W_]/, "Password must contain at least one special character")
    .regex(/^\S*$/, "Password must not contain spaces"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
