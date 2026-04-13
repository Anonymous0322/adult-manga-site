import { Router } from 'express';
import {
  createManga,
  deleteManga,
  getMangaById,
  getMangaList,
  updateManga
} from '../controllers/manga.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { cacheGet } from '../middleware/cache.middleware.js';

const router = Router();

router.get('/', cacheGet(), getMangaList);
router.get('/:id', cacheGet(), getMangaById);

router.post('/', protect, requireAdmin, upload.single('coverImage'), createManga);
router.put('/:id', protect, requireAdmin, upload.single('coverImage'), updateManga);
router.delete('/:id', protect, requireAdmin, deleteManga);

export default router;
