import { Router } from 'express';
import { uploadImages } from '../controllers/upload.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { uploadRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/', protect, requireAdmin, uploadRateLimiter, upload.array('images', Number(process.env.UPLOAD_MAX_FILES || 100)), uploadImages);

export default router;
