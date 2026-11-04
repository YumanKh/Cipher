import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export const favoritingNoteSchema = z.object({
    isFavorite: z.boolean(),
});

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});