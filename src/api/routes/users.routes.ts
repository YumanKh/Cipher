import express from 'express';

import { comparePassword } from '../repositories/auth.repository.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { deleteUserSchema } from '../../schemas/users.schema.js';
import { prisma } from "../../lib/prisma.js";

const router = express.Router();

router.delete('/me', requireAuth, async (req, res) => {
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
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const isPasswordValid = await comparePassword(result.data.authValue, user.hashedPassword);

        if (!isPasswordValid) {
            res.status(400).json({ error: 'Invalid auth value' });
            return;
        }

        await prisma.user.delete({
            where: {
                id: userId
            }
        });

        res.status(200).clearCookie("refreshToken", { path: "/auth" }).json({ deleted: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
        return;
    }
});

export default router;