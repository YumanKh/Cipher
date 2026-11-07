import express from 'express';
import { getPasswords } from '../controllers/passwords.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.get('/', requireAuth, getPasswords);


export default router;