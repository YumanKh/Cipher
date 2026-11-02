import { registerUser, loginUser, logoutUser } from "../services/auth.service.js";
import { Request, Response } from "express";
import { loginSchema, registerSchema, logoutSchema } from "../../schemas/auth.schema.js";
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
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    const { email, authValue } = result.data;

    try {
        const loggedUser = await loginUser(email, authValue);
        if (!loggedUser) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        res.status(200).json({ user: loggedUser.user, tokens: loggedUser.tokens });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    const result = logoutSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    const refreshToken = result.data.refreshToken;

    try {
        await logoutUser(refreshToken);
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};