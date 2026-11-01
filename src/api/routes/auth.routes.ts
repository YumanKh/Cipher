import express from "express";
import { registerSchema } from "../../schemas/auth.schema.js";
import { issueToken, passwordCrypting, hashToken } from "../../lib/token.js";
import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";
const router = express.Router();

router.post("/register", async (req, res) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    const { name, email, authValue, cryptingKey, kdfSalt } = result.data;
    
    try {
        const hashedPassword = await passwordCrypting(authValue);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
                cryptingKey,
                kdfSalt,
            },
        });

        const tokens = await issueToken(user.id);
        res.status(201).json({ user: user, tokens: tokens  });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({ error: "User with this email already exists" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;