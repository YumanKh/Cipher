import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getNotes, createNote, updateNote } from "../controllers/notes.controller.js";

const router = express.Router();

router.get("/", requireAuth, getNotes);
router.post("/", requireAuth, createNote);
router.patch("/:id", requireAuth, updateNote);

export default router;