import express from 'express';
import { getPasswords, createPassword, updatePassword, deletePassword } from '../controllers/passwords.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

router.post('/', requireAuth, createPassword);
router.get('/', requireAuth, getPasswords);
router.patch('/:id', requireAuth, updatePassword);
router.delete('/:id', requireAuth, deletePassword);

export default router;