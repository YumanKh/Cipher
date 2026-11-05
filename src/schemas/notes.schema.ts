import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export const modifyNoteSchema = z.object({
    isFavorite: z.boolean().optional(),
    title: z.string().optional(),
    content: z.string().optional(),
}).refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "At least one of field is required",
});

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});