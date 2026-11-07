import express from 'express';
import { getPasswords, createPassword } from '../controllers/passwords.controller.js';
import { requireAuth } from '../middlewares/requireAuth.js';

import { prisma } from '../../lib/prisma.js';
import { createPasswordSchema } from '../../schemas/passwords.schema.js';

const router = express.Router();

router.post('/', requireAuth, createPassword);
router.get('/', requireAuth, getPasswords);


export default router;