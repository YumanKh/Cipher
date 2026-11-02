import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { refreshSchema } from "../../schemas/auth.schema.js";
import { registerLimiter, loginLimiter } from "../middlewares/auth.limiter.js";

import { hashToken, issueToken } from "../../lib/token.js";
import { prisma } from "../../lib/prisma.js";

const router = express.Router();

router.post("/register", registerLimiter,register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

router.post("/refresh", async(req, res) => {
    const result = refreshSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ error: "refreshToken is required" });
        return;
    }

    const { refreshToken } = result.data;
    const hashedToken = hashToken(refreshToken);

    try {
        const token = await prisma.refreshToken.findUnique({
            where: {
                hashedToken: hashedToken
            },
            select: {
                id: true,
                userId: true,
                expiresAt: true
            }
        });

        if (!token) {
            res.status(401).json({ error: "Invalid refresh token" });
            return;
        }

        if (token.expiresAt.getTime() < Date.now()) {
            await prisma.refreshToken.deleteMany({
                where: {
                    id: token.id
                }
            });
            res.status(401).json({ error: "Refresh token has expired"});
            return;
        }

        await prisma.refreshToken.deleteMany({
            where: {
                id: token.id
            }
        });

        const { refreshToken, accessToken } = await issueToken(token.userId);
        res.status(200).json({ tokens: { accessToken, refreshToken } });
    } catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;