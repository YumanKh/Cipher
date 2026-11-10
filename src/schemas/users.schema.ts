import z from 'zod';

export const deleteUserSchema = z.object({
    authValue: z.string()
});

export const updateUserSchema = z.object({
    name: z.string().min(3).max(15).optional(),
    email: z.string().email().toLowerCase().optional()
});

export const updateUserPasswordSchema = z.object({
    currentAuthValue: z.string().min(12),
    newAuthValue: z.string().min(12),
    cryptingKey: z.string().min(1)
});