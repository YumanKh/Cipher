import { z } from "zod";

export const createPasswordSchema = z.object({
    title: z.string().min(1, "Title is required").max(500, "Title is too long"),
    link: z.string().optional(),
    content: z.string().min(1, "Content is required").max(250, "Content is too long"),
    iv: z.string().min(1, "IV is required").max(100, "IV is too long"),
});