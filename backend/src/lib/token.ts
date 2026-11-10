import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config.js";

export const passwordHashing = (password: string) => {
    return bcrypt.hash(password, 10);
}

export const hashToken = (token: string) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export const signAccessToken = (userId: number) => {
    return jwt.sign({ id: userId }, config.JWT_SECRET, { expiresIn: "15m" });
}