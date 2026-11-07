import type { Request, Response } from 'express';
import { getPasswordsForUser, createPasswordForUser, updatePasswordContent } from '../services/passwords.service.js';
import { createPasswordSchema, idParamsSchema, modifyPasswordSchema } from '../../schemas/passwords.schema.js';

export const getPasswords = async (req: Request, res: Response) => {
    const userId = req.userId;
    
    if (!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
    }

    try {
        const passwords = await getPasswordsForUser(userId);
        res.status(200).json({ passwords });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const createPassword = async (req: Request, res: Response) => {
    const userId = req.userId;
    const newPassword = createPasswordSchema.safeParse(req.body);

    if (!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
    }

    if (!newPassword.success) {
        res.status(400).json({ error: "Title, IV, and content are required" });
        return;
    }

    try {
        const createdPassword = await createPasswordForUser(userId, newPassword.data.title, newPassword.data.iv, newPassword.data.content, newPassword.data.link);
        res.status(201).json({ password: createdPassword });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    const userId = req.userId;
    const passwordId = idParamsSchema.safeParse(req.params);
    const updateData = modifyPasswordSchema.safeParse(req.body);

    if (!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
    }
    if (!passwordId.success) {
        res.status(400).json({ error: "Invalid password ID" });
        return;
    }
    if (!updateData.success) {
        res.status(400).json({ error: "Invalid update data" });
        return;
    }

    try {
        const results = await updatePasswordContent(userId, passwordId.data.id, updateData.data.iv, updateData.data?.isFavorite, updateData.data?.title, updateData.data?.content, updateData.data?.link);
        if (!results) {
            res.status(404).json({ error: "Password not found" });
            return;
        }

        res.status(200).json({ updated: true });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};