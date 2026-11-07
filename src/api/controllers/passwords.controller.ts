import type { Request, Response } from 'express';
import { getPasswordsForUser } from '../services/passwords.service.js';

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