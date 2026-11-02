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

export const deleteRefreshToken = async (hashedToken: string) => {
    return prisma.refreshToken.deleteMany({
        where: { hashedToken },
    });
};