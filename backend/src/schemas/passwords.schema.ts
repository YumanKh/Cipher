import { z } from "zod";

export const createPasswordSchema = z.object({
    title: z.string().min(1, "Title is required"),
    link: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    iv: z.string().min(1, "IV is required"),
});

export const modifyPasswordSchema = z.object({
    isFavorite: z.boolean().optional(),
    title: z.string().min(1, "Title is required").optional(),
    link: z.string().optional(),
    content: z.string().min(1, "Content is required").optional(),
    iv: z.string().min(1, "IV is required").optional(),
}).refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: "At least one field is required" }
).refine(
  (data) => {
    const touchesEncryptedData = data.title !== undefined || data.content !== undefined || data.iv !== undefined;
    if (!touchesEncryptedData) return true;
    return data.title !== undefined && data.content !== undefined && data.iv !== undefined;
  },
  { message: "title, content and iv must be sent together" }
)

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});