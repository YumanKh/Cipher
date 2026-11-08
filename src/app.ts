import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./api/routes/auth.routes.js";
import notesRouter from "./api/routes/notes.routes.js";
import passwordsRouter from "./api/routes/passwords.routes.js";
import { config } from "./config.js";

const app = express();

app.use(helmet());
app.use(cors({ credentials: true, origin: config.FRONTEND_URL }));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/notes", notesRouter);
app.use("/passwords", passwordsRouter);

export default app;