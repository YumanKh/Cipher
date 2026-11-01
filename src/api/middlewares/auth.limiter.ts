import ratelimit from 'express-rate-limit';
import { config } from '../../config.js';

export const registerLimiter = ratelimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: 'Too many registration attempts, try again later.',
    standardHeaders: true,
    legacyHeaders: false,

    skip: () => config.NODE_ENV === 'test'
});