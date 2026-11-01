import express from "express";
import { register } from "../controllers/auth.controller.js";
import { registerLimiter } from "../middlewares/auth.limiter.js";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { loginSchema } from "../../schemas/auth.schema.js";
import { issueToken } from "../../lib/token.js";

const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

const router = express.Router();

router.post("/register", registerLimiter,register);

router.post("/login", async (req, res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    const { email, authValue } = result.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        
        if (!user) {
            await bcrypt.compare(authValue, DUMMY_HASH);
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(authValue, user.hashedPassword);

        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const tokens = await issueToken(user.id);
        res.status(200).json({user: { id: user.id, email: user.email, name: user.name, cryptingKey: user.cryptingKey, kdfSalt: user.kdfSalt }, tokens });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }
});

export default router;