import { comparePassword } from "../../lib/users.js";
import { deleteUser, getUser } from "../repositories/users.repository.js";

export const getUserById = async (userId: number) => {
    return getUser(userId);
}

export const deleteUserById = async (userId: number) => {
    return deleteUser(userId);
};

export const compareAuthValues = async (authValue: string, hashedAuthValue: string) => {
    return comparePassword(authValue, hashedAuthValue);
};

export const deleteUserAccount = async (userId: number, authValue: string) => {
    const user = await getUserById(userId);

    if (!user) {
        return null;
    }

    const isPasswordValid = await compareAuthValues(authValue, user.hashedPassword);

    if (!isPasswordValid) {
        return null;
    }

    await deleteUserById(userId);
    return true;
};