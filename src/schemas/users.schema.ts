import z from 'zod';

export const deleteUserSchema = z.object({
    authValue: z.string()
});