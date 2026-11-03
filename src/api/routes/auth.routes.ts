import express from "express";
import { login, logout, refresh, register } from "../controllers/auth.controller.js";
import { registerLimiter, loginLimiter } from "../middlewares/auth.limiter.js";

const router = express.Router();

router.post("/register", registerLimiter,register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;