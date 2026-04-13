import { Router } from 'express';
import mangaRoutes from './manga.routes.js';
import chapterRoutes from './chapter.routes.js';
import uploadRoutes from './upload.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/manga', mangaRoutes);
router.use('/chapter', chapterRoutes);
router.use('/upload', uploadRoutes);

export default router;
