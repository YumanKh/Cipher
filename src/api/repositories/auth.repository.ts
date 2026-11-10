import { prisma } from "../../lib/prisma.js";

export const createUser = async (data: {
    name: string;
    email: string;
    hashedPassword: string;
    cryptingKey: string;
    kdfSalt: string;
}) => {
    return prisma.user.create({
        data,
        select: {
            id: true,
            name: true,
            email: true,
            cryptingKey: true,
            kdfSalt: true,
        },
    });
};

export const getUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            hashedPassword: true,
            cryptingKey: true,
            kdfSalt: true,
        },
    });
};

export const getKdfSalt = async (email: string) => {
    return prisma.user.findUnique({
        where: { email },
        select: {
            kdfSalt: true,
        },
    });
};

export const deleteRefreshToken = async (hashedToken: string) => {
    return prisma.refreshToken.deleteMany({
        where: { hashedToken },
    });
};

export const createRefreshToken = async (hashedToken: string, expiresAt: Date, userId: number) => {
    return prisma.refreshToken.create({
        data: {
            hashedToken,
            expiresAt,
            userId,
        },
    });
};

export const findRefreshToken = async (hashedToken: string) => {
    return prisma.refreshToken.findUnique({
        where: { hashedToken },
        select: {
            id: true,
            userId: true,
            expiresAt: true,
        },
    });
};

export const deleteRefreshTokenById = async (id: number) => {
    return prisma.refreshToken.deleteMany({
        where: { id },
    });
};
