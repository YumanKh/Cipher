import { createUser } from "../repositories/auth.repository.js";
import { issueToken, passwordCrypting } from "../../lib/token.js";

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