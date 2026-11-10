import express from 'express';
import { deleteUser, updatePassword } from '../controllers/users.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.patch('/me/password', requireAuth, updatePassword);
router.delete('/me', requireAuth, deleteUser);


export default router;