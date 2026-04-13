import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadImagesToCloudinary } from '../services/cloudinary.service.js';
import { createChapterService, deleteChapterService, getChapterService } from '../services/chapter.service.js';
import { invalidateCache } from '../middleware/cache.middleware.js';

export const createChapter = asyncHandler(async (req, res) => {
  const { mangaId, title, chapterNumber } = req.body;

  if (!mangaId || !title || chapterNumber === undefined) {
    throw new ApiError(400, 'mangaId, title, chapterNumber are required');
  }

  if (!req.files?.length) {
    throw new ApiError(400, 'At least one image file is required');
  }

  const images = await uploadImagesToCloudinary(req.files, `chapters/${mangaId}`);

  const chapter = await createChapterService({
    mangaId,
    title,
    chapterNumber: Number(chapterNumber),
    images
  });

  await invalidateCache();
  res.status(201).json(chapter);
});

export const getChapterById = asyncHandler(async (req, res) => {
  const chapter = await getChapterService(req.params.id, req.query.imagePage, req.query.imageLimit);
  res.json(chapter);
});

export const deleteChapter = asyncHandler(async (req, res) => {
  const payload = await deleteChapterService(req.params.id);
  await invalidateCache();
  res.json(payload);
});
