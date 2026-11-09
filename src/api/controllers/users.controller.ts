import { Request, Response } from "express";
import { deleteUserAccount } from "../services/users.service.js";
import { deleteUserSchema } from "../../schemas/users.schema.js";

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.userId;
    const result = deleteUserSchema.safeParse(req.body);

    if (!userId) {
        res.status(401).json({ error: 'User ID is required' });
        return;
    }

    if (!result.success) {
        res.status(400).json({ error: 'Auth value is required' });
        return;
    }

    try {
        const deleted = await deleteUserAccount(userId, result.data.authValue);

        if (!deleted) {
            res.status(401).json({ error: 'Invalid auth value or user not found' });
            return;
        }

        res.status(200).clearCookie("refreshToken", { path: "/auth" }).json({ deleted: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};