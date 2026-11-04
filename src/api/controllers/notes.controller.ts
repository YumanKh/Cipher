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

        if (!notes) {
        res.status(404).json({ error: "User not found" });
        return ;
        }
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
};
