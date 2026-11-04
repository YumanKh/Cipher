import { Request, Response } from "express";
import { getNotesForUser } from "../services/notes.service.js";

export const getNotes = async (req: Request, res: Response) => {
    const userId = req.userId;
    
    if (!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
    }

    try {
        const notes = await getNotesForUser(userId);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
