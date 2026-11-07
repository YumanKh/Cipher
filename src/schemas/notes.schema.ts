import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title is too long"),
  content: z.string().min(1, "Content is required").max(1000, "Content is too long"),
});

export const modifyNoteSchema = z.object({
    isFavorite: z.boolean().optional(),
    title: z.string().min(1, "Title is required").max(500, "Title is too long").optional(),
    content: z.string().min(1, "Content is required").max(1000, "Content is too long").optional(),
}).refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one of field is required",
});

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});