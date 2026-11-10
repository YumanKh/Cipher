import express from 'express';
import { deleteUser, updatePassword } from '../controllers/users.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

import { updateUserSchema } from '../../schemas/users.schema.js';
import { prisma } from '../../lib/prisma.js';
import { Prisma } from "@prisma/client";

const router = express.Router();

router.patch('/me/password', requireAuth, updatePassword);
router.delete('/me', requireAuth, deleteUser);

router.patch('/me/datas', requireAuth, async(req, res) => {
    const userId = req.userId;
    const newData = updateUserSchema.safeParse(req.body);
    
    if(!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
    }

    if(!newData.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    try {
        const updatedUserData = await prisma.user.updateMany({
            where: {
                id: userId
            },
            data: {
                name: newData.data.name,
                email: newData.data.email,
            }
        });

        if(updatedUserData.count === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json({ updated: true });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({ error: "User with this email already exists" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;