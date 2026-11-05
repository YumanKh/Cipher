import { createNote, getNotesByUserId, modifyNoteContent } from "../repositories/notes.repository.js"

export const getNotesForUser = async (userId: number) => {
  return getNotesByUserId(userId);
};

export const createNoteForUser = async (userId: number, title: string, content: string) => {
  return createNote(userId, title, content);
};

export const updateNoteContent = async (userId: number, noteId: number, isFavorite?: boolean, title?: string, content?: string) => {
  const results = await modifyNoteContent(userId, noteId, isFavorite, title, content);
  
  if (results.count === 0) return null;
  return results;
}