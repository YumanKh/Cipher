import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3).max(15),
    email: z.string().email().toLowerCase(),
    authValue: z.string().min(1),
    cryptingKey: z.string().min(1),
    kdfSalt: z.string().min(1)
})

export const loginSchema = z.object({
    email: z.string().email().toLowerCase(),
    authValue: z.string().min(1)
});

export const logoutSchema = z.object({
    refreshToken: z.string().min(1)
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1)
});