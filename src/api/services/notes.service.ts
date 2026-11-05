import { createNote, getNotesByUserId, changeNoteFavoriteStatus } from "../repositories/notes.repository.js"

export const getNotesForUser = async (userId: number) => {
  return getNotesByUserId(userId);
};

export const createNoteForUser = async (userId: number, title: string, content: string) => {
  return createNote(userId, title, content);
};

export const updateNoteFavoriteStatusForUser = async (userId: number, noteId: number, isFavorite: boolean) => {
  return changeNoteFavoriteStatus(userId, noteId, isFavorite);
}