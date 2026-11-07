import { getPasswordsByUserId } from '../repositories/passwords.repository.js';

export const getPasswordsForUser = async (userId: number) => {
  return getPasswordsByUserId(userId);
};