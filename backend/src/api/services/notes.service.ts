import { createNote, getNotesByUserId, modifyNoteContent, deleteNote } from "../repositories/notes.repository.js"

export const getNotesForUser = async (userId: number) => {
  return getNotesByUserId(userId);
};

export const createNoteForUser = async (userId: number, title: string, content: string, iv: string) => {
  return createNote(userId, title, content, iv);
};

export const updateNoteContent = async (userId: number, noteId: number, iv?: string, isFavorite?: boolean, title?: string, content?: string) => {
  const results = await modifyNoteContent(userId, noteId, iv, isFavorite, title, content);
  
  if (results.count === 0) return null;
  return results;
}

export const deleteNoteForUser = async (userId: number, noteId: number) => {
  const results = await deleteNote(userId, noteId);
  
  if (results.count === 0) return null;
  return results;
};