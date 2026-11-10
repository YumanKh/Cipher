import express from "express";
import { login, logout, refresh, register } from "../controllers/auth.controller.js";
import { registerLimiter, loginLimiter } from "../middlewares/auth.limiter.js";

import { preloginSchema } from "../../schemas/auth.schema.js";
import { prisma } from "../../lib/prisma.js";

const router = express.Router();

router.post('/register', registerLimiter,register);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refresh);

router.post('/prelogin', loginLimiter, async (req, res) => {
    const result = preloginSchema.safeParse(req.body);

    if (!result.success) {
        res.status(401).json({ error: "Invalid email" });
        return;
    }

    const { email: userEmail } = result.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            select: { kdfSalt: true }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ kdfSalt: user.kdfSalt });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }

});

export default router;