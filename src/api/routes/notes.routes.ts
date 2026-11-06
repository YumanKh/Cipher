import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getNotes, createNote, updateNote } from "../controllers/notes.controller.js";

import { prisma } from "../../lib/prisma.js";
import { idParamsSchema } from "../../schemas/notes.schema.js";


const router = express.Router();

router.get("/", requireAuth, getNotes);
router.post("/", requireAuth, createNote);
router.patch("/:id", requireAuth, updateNote);

router.delete("/:id", requireAuth, async (req, res) => {
    const userId = req.userId;
    const noteId = idParamsSchema.safeParse(req.params);

    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    if (!noteId.success) {
        res.status(400).json({ error: "Invalid note ID" });
        return;
    }

    try {
        const result = await prisma.note.deleteMany({ where: { id: noteId.data.id, userId } });

        if (result.count === 0) {
            res.status(404).json({ error: "Note not found" });
            return;
        }

        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;