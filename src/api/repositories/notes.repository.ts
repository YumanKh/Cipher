import { prisma } from '../../lib/prisma.js';

export const getNotesByUserId = async (userId: number) => {
  return prisma.note.findMany({
    where: { userId: userId }
  });
};