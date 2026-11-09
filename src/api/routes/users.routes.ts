import express from 'express';
import { deleteUser } from '../controllers/users.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';



const router = express.Router();

router.delete('/me', requireAuth, deleteUser);

export default router;