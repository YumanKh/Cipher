import { getPasswordsByUserId, createPassword } from '../repositories/passwords.repository.js';

export const getPasswordsForUser = async (userId: number) => {
  return getPasswordsByUserId(userId);
};

export const createPasswordForUser = async (userId: number, title: string, content: string, link?: string) => {
  return createPassword(userId, title, content, link);
};