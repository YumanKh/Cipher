import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(4).max(15),
    email: z.string().email().toLowerCase(),
    authValue: z.string().min(1),
    cryptingKey: z.string().min(1),
    kdfSalt: z.string().min(1)
})