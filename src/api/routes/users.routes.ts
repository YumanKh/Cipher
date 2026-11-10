import express from 'express';
import { deleteUser } from '../controllers/users.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

import { prisma } from '../../lib/prisma.js';
import { passwordHashing } from '../../lib/token.js';
import { updateUserPasswordSchema } from '../../schemas/users.schema.js';
import { compareAuthValues } from '../services/users.service.js';

const router = express.Router();

router.delete('/me', requireAuth, deleteUser);
router.patch('/me/password', requireAuth, async(req, res) => {
    const userId = req.userId;
    const result = updateUserPasswordSchema.safeParse(req.body);

    if (!userId) {
        res.status(401).json({ error: 'User ID is required' });
        return;
    }

    if (!result.success) {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }

    try {
        const currentPassword = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                hashedPassword: true
            }
        });

        if (!currentPassword) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        
        const isPasswordValid = await compareAuthValues(result.data.currentAuthValue, currentPassword.hashedPassword);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Password is incorrect' });
            return;
        }

        const newHashedPassword = await passwordHashing(result.data.newAuthValue);

        const updatedUser = await prisma.user.updateMany({
            where: {
                id: userId
            },
            data: {
                hashedPassword: newHashedPassword,
                cryptingKey: result.data.cryptingKey
            }
        });

        if (updatedUser.count === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ updated: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;