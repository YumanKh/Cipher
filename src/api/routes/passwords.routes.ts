import express from 'express';
import { getPasswords, createPassword, updatePassword } from '../controllers/passwords.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { idParamsSchema } from '../../schemas/passwords.schema.js';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

router.post('/', requireAuth, createPassword);
router.get('/', requireAuth, getPasswords);
router.patch('/:id', requireAuth, updatePassword);

router.delete('/:id', requireAuth, async(req, res) => {
    const userId = req.userId;
    const passwordId = idParamsSchema.safeParse(req.params);

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    if (!passwordId.success) {
        res.status(400).json({ error: 'Invalid password ID' });
        return;
    }

    try {
        const result = await prisma.passwords.deleteMany({
            where: {
                id: passwordId.data.id,
                userId: userId
            }
        });

        if (result.count === 0) {
            res.status(404).json({ error: 'Password not found' });
            return;
        }

        res.status(200).json({deleted: true});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;