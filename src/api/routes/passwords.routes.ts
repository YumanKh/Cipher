import express from 'express';
import { getPasswords, createPassword } from '../controllers/passwords.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

import { prisma } from '../../lib/prisma.js';
import { modifyPasswordSchema, idParamsSchema } from '../../schemas/passwords.schema.js';


const router = express.Router();

router.post('/', requireAuth, createPassword);
router.get('/', requireAuth, getPasswords);
router.patch('/:id', requireAuth, async (req, res) => {
    const userId = req.userId;
    const modifiedPassword = modifyPasswordSchema.safeParse(req.body);
    const id = idParamsSchema.safeParse(req.params);

    if (!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
    }

    if (!modifiedPassword.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    if (!id.success) {
        res.status(400).json({ error: "Invalid ID parameter" });
        return;
    }
    
    try {
        const updatedPassword = await prisma.passwords.updateMany({
            where: { id: id.data.id, userId },
            data: modifiedPassword.data,
        });

        if (updatedPassword.count === 0) {
            res.status(404).json({ error: "Password not found" });
            return;
        }

        res.status(200).json({  updated: true });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;