import { passwordHashing } from "../../lib/token.js";
import { comparePassword } from "../../lib/users.js";
import { deleteUser, getUser, updatePassword, updateDatas } from "../repositories/users.repository.js";

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

export const updateUserDatas = async (userId: number, name?: string, email?: string) => {
    const result = await updateDatas(userId, name, email);

    if (result.count === 0) return null;
    return true;
};

export const updateUserPassword = async (userId: number, currentAuthValue: string, newAuthValue: string, cryptingKey: string) => {
    const user = await getUserById(userId);

    if (!user) {
        return null;
    }

    const isPasswordValid = await compareAuthValues(currentAuthValue, user.hashedPassword);

    if (!isPasswordValid) {
        return null;
    }

    newAuthValue = await passwordHashing(newAuthValue);

    const result = await updatePassword(userId, newAuthValue, cryptingKey);
    if (result.count === 0) return null;
    return true;
};