import express from 'express';
import { getPasswords } from '../controllers/passwords.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

import { prisma } from '../../lib/prisma.js';
import { createPasswordSchema } from '../../schemas/passwords.schema.js';

const router = express.Router();

router.get('/', requireAuth, getPasswords);
router.post('/', requireAuth, async (req, res) => {
    const userId = req.userId;
    const newPassword = createPasswordSchema.safeParse(req.body);

    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    if (!newPassword.success) {
        res.status(400).json({ error: "Title and content are required" });
        return;
    }

    try {
        const createdPassword = await prisma.passwords.create({
            data: {
                title: newPassword.data.title,
                link: newPassword.data.link,
                content: newPassword.data.content,
                userId,
            },
            select: {
                id: true,
                title: true,
                link: true,
                content: true,
            }
        });

        res.status(201).json({ password: createdPassword });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;