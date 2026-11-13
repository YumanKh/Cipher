import { createRefreshToken, createUser, deleteRefreshToken, getUserByEmail, findRefreshToken, deleteRefreshTokenById, getKdfSalt, getUserById } from "../repositories/auth.repository.js";
import { hashToken, passwordHashing, signAccessToken } from "../../lib/token.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const registerUser = async (data: {
    name: string;
    email: string;
    authValue: string;
    cryptingKey: string;
    kdfSalt: string;
}) => {
    const hashedPassword = await passwordHashing(data.authValue);
    
    const user = await createUser({
        name: data.name,
        email: data.email,
        hashedPassword,
        cryptingKey: data.cryptingKey,
        kdfSalt: data.kdfSalt,
    });

    const tokens = await issueToken(user.id);
    return { user, tokens };
};

export const getKdfSaltByEmail = async (email: string) => {
    const user = await getKdfSalt(email);

    if (!user) {
        return null;
    }
    return { kdfSalt: user.kdfSalt };
};

const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

export const loginUser = async (email: string, authValue: string) => {
    const user = await getUserByEmail(email);
    if (!user) {
        await bcrypt.compare(authValue, DUMMY_HASH);
        return null;
    }

    const isPasswordValid = await bcrypt.compare(authValue, user.hashedPassword);
    if (!isPasswordValid) {
        return null;
    }

    const tokens = await issueToken(user.id);
    return { user: { id: user.id, name: user.name, email: user.email, cryptingKey: user.cryptingKey, kdfSalt: user.kdfSalt }, tokens };
};

export const logoutUser = async (refreshToken: string) => {
    const hashedToken = hashToken(refreshToken);
    await deleteRefreshToken(hashedToken);
}

const REFRESH_TOKEN_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

export const issueToken = async (userId: number) => {
    const accessToken = signAccessToken(userId);
    const refreshToken = crypto.randomBytes(48).toString("hex");

    const tokens = await    createRefreshToken(hashToken(refreshToken), new Date(Date.now() + REFRESH_TOKEN_DURATION_MS), userId);

    return { accessToken: accessToken, refreshToken: refreshToken };
}

export const refreshUserToken = async (refreshToken: string) => {
    const hashedToken = hashToken(refreshToken);
    const token = await findRefreshToken(hashedToken);

    if (!token) {
        return null;
    }

    if (token.expiresAt.getTime() < Date.now()) {
        await deleteRefreshTokenById(token.id);
        return null;
    }

    const user = await getUserById(token.userId);
    if (!user) {
        return null;
    }

    await deleteRefreshTokenById(token.id);
    const { refreshToken: newRefreshToken, accessToken } = await issueToken(token.userId);
    return { user, tokens: { accessToken: accessToken, refreshToken: newRefreshToken } };
};
