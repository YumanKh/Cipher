import express from "express";

import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.userId;
  
  try {
    const notes = await prisma.note.findMany({
      where: { userId: userId }
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

export default router;