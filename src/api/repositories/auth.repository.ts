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