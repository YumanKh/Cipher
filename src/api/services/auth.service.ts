import { createUser, getUserByEmail } from "../repositories/auth.repository.js";
import { issueToken, passwordCrypting } from "../../lib/token.js";
import bcrypt from "bcryptjs";

export const registerUser = async (data: {
    name: string;
    email: string;
    authValue: string;
    cryptingKey: string;
    kdfSalt: string;
}) => {
    const hashedPassword = await passwordCrypting(data.authValue);
    
    const user = await createUser({
        name: data.name,
        email: data.email,
        hashedPassword,
        cryptingKey: data.cryptingKey,
        kdfSalt: data.kdfSalt,
    });

    const tokens = await issueToken(user.id);
    return { user, tokens };
};

const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

export const loginUser = async (email: string, authValue: string) => {
    const user = await getUserByEmail(email);
    if (!user) {
        await bcrypt.compare(authValue, DUMMY_HASH);
        return null;
    }

    const isPasswordValid = await bcrypt.compare(authValue, user.hashedPassword);
    if (!isPasswordValid) {
        return null;
    }

    const tokens = await issueToken(user.id);
    return { user: { id: user.id, name: user.name, email: user.email, cryptingKey: user.cryptingKey, kdfSalt: user.kdfSalt }, tokens };
};