import { prisma } from "../../lib/prisma.js";

export const getUser = async (userId: number) => {
    return prisma.user.findUnique({
        where: {
            id: userId
        }
    });
};

export const deleteUser = async (userId: number) => {
    return prisma.user.delete({
        where: {
            id: userId
        }
    });
};