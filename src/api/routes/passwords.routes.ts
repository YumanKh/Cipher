import express from 'express';
import { getPasswords, createPassword, updatePassword } from '../controllers/passwords.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.post('/', requireAuth, createPassword);
router.get('/', requireAuth, getPasswords);
router.patch('/:id', requireAuth, updatePassword);

export default router;