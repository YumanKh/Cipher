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

export const changeNoteFavoriteStatus = async (userId: number, noteId: number, isFavorite: boolean) => {
  return prisma.note.updateMany({
    where: { 
      id: noteId,
      userId: userId,
    },
    data: { isFavorite: isFavorite },
  });
}