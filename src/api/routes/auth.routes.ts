import express from "express";
import { register } from "../controllers/auth.controller.js";
import { registerLimiter } from "../middlewares/auth.limiter.js";
const router = express.Router();

router.post("/register", registerLimiter,register);

export default router;