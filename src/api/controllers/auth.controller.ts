import { registerUser } from "../services/auth.service.js";
import { Request, Response } from "express";
import { registerSchema } from "../../schemas/auth.schema.js";
import { Prisma } from "@prisma/client";

export const register = async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    const userData = result.data;

    try {
        const { user, tokens } = await registerUser(userData);

        res.status(201).json({ user, tokens });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({ error: "User with this email already exists" });
            return;
        }
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};