import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getNotes, createNote } from "../controllers/notes.controller.js";
import { favoritingNoteSchema, idParamsSchema } from "../../schemas/notes.schema.js";

import { prisma } from "../../lib/prisma.js";

const router = express.Router();

router.get("/", requireAuth, getNotes);
router.post("/", requireAuth, createNote);

router.patch("/:id", requireAuth, async (req, res) => {
  const userId = req.userId;
  const noteId = idParamsSchema.safeParse(req.params);
  const noteFav = favoritingNoteSchema.safeParse(req.body);

  if (!userId) {
    res.status(401).json({ error: "User ID is required" });
    return;
  }

  if (!noteFav.success) {
    res.status(400).json({ error: "Note infos are required" });
    return;
  }

  try {
    const update = await prisma.note.updateMany({
      where: { 
        id: noteId.data?.id,
        userId: userId,
       },
      data: { isFavorite: noteFav.data.isFavorite },
    });

    if (update.count === 0) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.status(200).json({ isNoteFavorite: noteFav.data.isFavorite });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;