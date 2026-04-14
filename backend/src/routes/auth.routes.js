import { Router } from 'express';
import { login, register, registerAdmin } from '../controllers/auth.controller.js';
import { uploadRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/login', uploadRateLimiter, login);
router.post('/register', uploadRateLimiter, register);
router.post('/register-admin', uploadRateLimiter, registerAdmin);

export default router;
