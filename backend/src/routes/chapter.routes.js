import { Router } from 'express';
import { createChapter, deleteChapter, getChapterById } from '../controllers/chapter.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { uploadRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.post('/', protect, requireAdmin, uploadRateLimiter, upload.array('images', Number(process.env.UPLOAD_MAX_FILES || 100)), createChapter);
router.get('/:id', getChapterById);
router.delete('/:id', protect, requireAdmin, deleteChapter);

export default router;
