import { z } from "zod";

export const createPasswordSchema = z.object({
    title: z.string().min(1, "Title is required"),
    link: z.string().url().optional(),
    content: z.string().min(1, "Content is required"),
});