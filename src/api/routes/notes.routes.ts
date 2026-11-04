import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { getNotes, createNote } from "../controllers/notes.controller.js";

const router = express.Router();

router.get("/", requireAuth, getNotes);
router.post("/", requireAuth, createNote);

export default router;