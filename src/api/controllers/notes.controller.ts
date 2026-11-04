import { Request, Response } from "express";
import { getNotesForUser, createNoteForUser } from "../services/notes.service.js";
import { createNoteSchema } from "../../schemas/notes.schema.js";

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

export const createNote = async (req: Request, res: Response) => {
    const userId = req.userId;
    const newNote = createNoteSchema.safeParse(req.body);
    
    if (!newNote.success) {
        res.status(400).json({ error: "Title and content are required" });
        return;
    }
    if (!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
    }

    try {
        const note = await createNoteForUser(userId, newNote.data.title, newNote.data.content);
        res.status(201).json({ note: { id: note.id, title: note.title, content: note.content } });
    } catch (error) {
        res.status(500).json({ error: "Failed to create note" });
    }
};