import { prisma } from "../../lib/prisma.js";

export const getUser = async (userId: number) => {
    return prisma.user.findUnique({
        where: {
            id: userId
        }
    });
};

export const deleteUser = async (userId: number) => {
    return prisma.user.deleteMany({
        where: {
            id: userId
        }
    });
};

export const updatePassword = async (userId: number, newAuthValue: string, cryptingKey: string) => {
    return prisma.user.updateMany({
        where: {
            id: userId
        },
        data: {
            hashedPassword: newAuthValue,
            cryptingKey
        }
    });
};