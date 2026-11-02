import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import bcrypt from "bcryptjs";
import { hashToken } from "../../lib/token.js";
import { registerLimiter, loginLimiter } from "../middlewares/auth.limiter.js";
import { prisma } from "../../lib/prisma.js";
import { logoutSchema } from "../../schemas/auth.schema.js";

const router = express.Router();

router.post("/register", registerLimiter,register);
router.post("/login", loginLimiter, login);

router.post("/logout", async (req, res) => {
    const result = logoutSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    const hashedToken = hashToken(result.data.refreshToken);

    try{
        await prisma.refreshToken.deleteMany({
            where: { hashedToken: hashedToken }
        });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;