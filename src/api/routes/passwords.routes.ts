import express from 'express';
import { prisma } from '../../lib/prisma.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const userId = req.userId;
    if(!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    
    try {
        const passwords = await prisma.passwords.findMany({
            where: { userId }
        });

        res.status(200).json({ passwords });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;