import { Request, Response } from "express";
import { getNotesForUser, createNoteForUser, updateNoteContent, deleteNoteForUser } from "../services/notes.service.js";
import { createNoteSchema, modifyNoteSchema, idParamsSchema } from "../../schemas/notes.schema.js";

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
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateNote = async (req: Request, res: Response) => {
    const userId = req.userId;
    const noteId = idParamsSchema.safeParse(req.params);
    const updateData = modifyNoteSchema.safeParse(req.body);

    if (!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
    }
    if (!noteId.success) {
        res.status(400).json({ error: "Invalid note ID" });
        return;
    }
    if (!updateData.success) {
        res.status(400).json({ error: "Invalid update data" });
        return;
    }

    try {
        const results = await updateNoteContent(userId, noteId.data.id, updateData.data?.isFavorite, updateData.data?.title, updateData.data?.content);
        if (!results) {
            res.status(404).json({ error: "Note not found" });
            return;
        }

        res.status(200).json({ updated: true });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    const userId = req.userId;
    const noteId = idParamsSchema.safeParse(req.params);

    if (!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
    }
    if (!noteId.success) {
        res.status(400).json({ error: "Invalid note ID" });
        return;
    }

    try {
        const results = await deleteNoteForUser(userId, noteId.data.id);
        if (!results) {
            res.status(404).json({ error: "Note not found" });
            return;
        }

        res.status(200).json({ deleted: true });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};