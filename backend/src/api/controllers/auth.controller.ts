import { registerUser, loginUser, logoutUser, refreshUserToken, getKdfSaltByEmail } from "../services/auth.service.js";
import { Request, Response } from "express";
import { loginSchema, registerSchema, preloginSchema } from "../../schemas/auth.schema.js";
import { Prisma } from "@prisma/client";
import { config } from "../../config.js";

export const register = async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    const userData = result.data;

    try {
        const { user, tokens } = await registerUser(userData);

        res.status(201).cookie("refreshToken", tokens.refreshToken, { httpOnly: true, secure: config.NODE_ENV === "production", sameSite: "strict", path: "/auth", maxAge: 30 * 24 * 60 * 60 * 1000 }).json({ user, accessToken: tokens.accessToken });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({ error: "User with this email already exists" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

export const prelogin = async (req: Request, res: Response) => {
    const result = preloginSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    const email = result.data.email;

    try {
        const kdfSalt = await getKdfSaltByEmail(email);
        if (!kdfSalt) {
            res.status(404).json({ error: "Invalid email or password" });
            return;
        }

        res.status(200).json({ kdfSalt: kdfSalt.kdfSalt });
    } catch (error) {
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

        res.status(200).cookie("refreshToken", loggedUser.tokens.refreshToken, { httpOnly: true, secure: config.NODE_ENV === "production", sameSite: "strict", path: "/auth", maxAge: 30 * 24 * 60 * 60 * 1000 }).json({ user: loggedUser.user, accessToken: loggedUser.tokens.accessToken });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    try {
        await logoutUser(refreshToken);
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        res.status(401).json({ error: "Missing refresh token" });
        return;
    }

    try {
        const refreshedTokens = await refreshUserToken(refreshToken);
        if (!refreshedTokens) {
            res.status(401).json({ error: "Invalid or expired refresh token" });
            return;
        }

        res.status(200).cookie("refreshToken", refreshedTokens.tokens.refreshToken, { httpOnly: true, secure: config.NODE_ENV === "production", sameSite: "strict", path: "/auth", maxAge: 30 * 24 * 60 * 60 * 1000 }).json({ accessToken: refreshedTokens.tokens.accessToken });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};