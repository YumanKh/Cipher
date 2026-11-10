import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/notes.controller.js";

const router = express.Router();

router.post('/', requireAuth, createNote);
router.get('/', requireAuth, getNotes);
router.patch('/:id', requireAuth, updateNote);
router.delete('/:id', requireAuth, deleteNote);

export default router;