import { getPasswordsByUserId, createPassword, modifyPasswordContent, deletePassword } from '../repositories/passwords.repository.js';

export const getPasswordsForUser = async (userId: number) => {
  return getPasswordsByUserId(userId);
};

export const createPasswordForUser = async (userId: number, title: string, iv: string, content: string, link?: string) => {
  return createPassword(userId, title, iv, content, link);
};

export const updatePasswordContent = async (userId: number, passwordId: number, iv?: string, isFavorite?: boolean, title?: string, content?: string, link?: string) => {
  const results = await modifyPasswordContent(userId, passwordId, iv, isFavorite, title, content, link);
  
  if (results.count === 0) return null;
  return results;
}

export const deletePasswordForUser = async (userId: number, passwordId: number) => {
  const results = await deletePassword(userId, passwordId);
  
  if (results.count === 0) return null;
  return results;
};