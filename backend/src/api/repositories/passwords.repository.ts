import { prisma } from '../../lib/prisma.js';

export const getPasswordsByUserId = async (userId: number) => {
    return prisma.passwords.findMany({
        where: { userId: userId }
    });
};

export const createPassword = async (userId: number, title: string, iv: string, content: string, link?: string) => {
    return prisma.passwords.create({
        data: {
            userId,
            title,
            iv,
            content,
            link,
        },
        select: {
            id: true,
            title: true,
            link: true,
            iv: true,
            content: true,
        }
    });
};

export const modifyPasswordContent = async (userId: number, passwordId: number, iv?: string, isFavorite?: boolean, title?: string, content?: string, link?: string) => {
  return prisma.passwords.updateMany({
    where: { 
      id: passwordId,
      userId: userId,
    },
    data: { 
      isFavorite: isFavorite,
      title: title,
      link: link,
      content: content,
      iv: iv,
    },
  });
}

export const deletePassword = async (userId: number, passwordId: number) => {
  return prisma.passwords.deleteMany({
    where: {
      id: passwordId,
      userId: userId,
    }
  });
};