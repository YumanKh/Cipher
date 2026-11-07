import { prisma } from '../../lib/prisma.js';

export const getPasswordsByUserId = async (userId: number) => {
  return prisma.passwords.findMany({
    where: { userId: userId }
  });
};