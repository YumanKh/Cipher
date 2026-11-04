import express from "express";
import { createNoteSchema } from "../../schemas/notes.schema.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getNotes } from "../controllers/notes.controller.js";
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

router.get("/", requireAuth, getNotes);

router.post("/", requireAuth, async (req, res) => {
    const newNote = createNoteSchema.safeParse(req.body);
    const userId = req.userId;

    if (!newNote.success) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }
    if (!userId) {
      res.status(401).json({ error: "User ID is required" });
      return;
    }

    try{

      const note = await prisma.note.create({
        data: {
          userId: userId,
          title: newNote.data.title,
          content: newNote.data.content,
          }
      });
      res.status(201).json({ note :{ id: note.id, title: note.title, content: note.content }});
    } catch (error) {

      res.status(500).json({ error: "Failed to create note" });
    }
});

export default router;