import express from "express";;
import { requireAuth } from "../middlewares/requireAuth.js";
import { getNotes } from "../controllers/notes.controller.js";

const router = express.Router();

router.get("/", requireAuth, getNotes);

export default router;