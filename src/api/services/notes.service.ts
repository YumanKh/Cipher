import { createNote, getNotesByUserId } from "../repositories/notes.repository.js"

export const getNotesForUser = async (userId: number) => {
  return getNotesByUserId(userId);
};

export const createNoteForUser = async (userId: number, title: string, content: string) => {
  return createNote(userId, title, content);
};