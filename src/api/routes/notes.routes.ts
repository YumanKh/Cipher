import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/notes.controller.js";

import { prisma } from "../../lib/prisma.js";
import { idParamsSchema } from "../../schemas/notes.schema.js";


const router = express.Router();

router.get("/", requireAuth, getNotes);
router.post("/", requireAuth, createNote);
router.patch("/:id", requireAuth, updateNote);
router.delete("/:id", requireAuth, deleteNote);

export default router;