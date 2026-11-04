import { prisma } from '../../lib/prisma.js';

export const getNotesByUserId = async (userId: number) => {
  return prisma.note.findMany({
    where: { userId: userId }
  });
};

export const createNote = async (userId: number, title: string, content: string) => {
  return prisma.note.create({
    data: {
      userId: userId,
      title: title,
      content: content,
    }
  });
};