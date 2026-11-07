import { prisma } from '../../lib/prisma.js';

export const getPasswordsByUserId = async (userId: number) => {
    return prisma.passwords.findMany({
        where: { userId: userId }
    });
};

export const createPassword = async (userId: number, title: string, content: string, link?: string) => {
    return prisma.passwords.create({
        data: {
        userId,
        title,
        content,
        link,
        },
        select: {
        id: true,
        title: true,
        link: true,
        content: true,
        }
    });
};