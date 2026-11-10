import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { deleteUserAccount, updateUserDatas, updateUserPassword } from "../services/users.service.js";
import { deleteUserSchema, updateUserPasswordSchema, updateUserSchema } from "../../schemas/users.schema.js";

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.userId;
    const result = deleteUserSchema.safeParse(req.body);

    if (!userId) {
        res.status(401).json({ error: 'User ID is required' });
        return;
    }

    if (!result.success) {
        res.status(400).json({ error: 'Auth value is required' });
        return;
    }

    try {
        const deleted = await deleteUserAccount(userId, result.data.authValue);

        if (!deleted) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        res.status(200).clearCookie("refreshToken", { path: "/auth" }).json({ deleted: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateDatas = async (req: Request, res: Response) => {
    const userId = req.userId;
    const result = updateUserSchema.safeParse(req.body);

    if(!userId) {
        res.status(401).json({ error: 'User ID is required' });
        return;
    }

    if(!result.success) {
        res.status(400).json({ error: 'Invalid request body' });
        return;
    }

    try {
        const updated = await updateUserDatas(userId, result.data.name, result.data.email);

        if (!updated) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ updated: true });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            res.status(409).json({ error: "User with this email already exists" });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    const userId = req.userId;
    const result = updateUserPasswordSchema.safeParse(req.body);

    if (!userId) {
        res.status(401).json({ error: 'User ID is required' });
        return;
    }

    if (!result.success) {
        res.status(400).json({ error: 'Auth value is required' });
        return;
    }

    try {
        const updated = await updateUserPassword(userId, result.data.currentAuthValue, result.data.newAuthValue, result.data.cryptingKey);

        if (!updated) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        res.status(200).json({ updated: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};