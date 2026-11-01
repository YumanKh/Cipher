import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config.js";
import { prisma } from "../lib/prisma.js";

export const passwordCrypting = (password: string) => {
    return bcrypt.hash(password, 10);
}

export const hashToken = (token: string) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export const signAccessToken = (userId: number) => {
    return jwt.sign({ id: userId }, config.JWT_SECRET, { expiresIn: "15m" });
}

const REFRESH_TOKEN_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export const issueToken = async (userId: number) => {
    const accessToken = signAccessToken(userId);
    const refreshToken = crypto.randomBytes(48).toString("hex");

    await prisma.refreshToken.create({
        data: {
            hashedToken: hashToken(refreshToken),
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION_MS),
            userId,
        },
    });
    
    return { accessToken, refreshToken };
}