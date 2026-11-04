import { getNotesByUserId } from "../repositories/notes.repository.js"

export const getNotesForUser = async (userId: number) => {
  return getNotesByUserId(userId);
};
