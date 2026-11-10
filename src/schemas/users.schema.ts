import z from 'zod';

export const deleteUserSchema = z.object({
    authValue: z.string()
});

export const updateUserSchema = z.object({
    name: z.string().min(3).max(15).optional(),
    email: z.string().email().toLowerCase().optional()
}).refine((data) => data.name || data.email, {
    message: "At least one of name or email must be provided"
});

export const updateUserPasswordSchema = z.object({
    currentAuthValue: z.string().min(12),
    newAuthValue: z.string().min(12),
    cryptingKey: z.string().min(1)
});