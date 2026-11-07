import { prisma } from '../../lib/prisma.js';

export const getNotesByUserId = async (userId: number) => {
  return prisma.note.findMany({
      where: { userId: userId }
  });
};

export const createNote = async (userId: number, title: string, content: string, iv: string) => {
  return prisma.note.create({
    data: {
      userId: userId,
      title: title,
      content: content,
      iv: iv,
    }
  });
};

export const modifyNoteContent = async (userId: number, noteId: number, iv?: string, isFavorite?: boolean, title?: string, content?: string) => {
  return prisma.note.updateMany({
    where: { 
      id: noteId,
      userId: userId,
    },
    data: { 
      isFavorite: isFavorite,
      title: title,
      content: content,
      iv: iv
    },
  });
}

export const deleteNote = async (userId: number, noteId: number) => {
  return prisma.note.deleteMany({
    where: {
      id: noteId,
      userId: userId,
    }
  });
};