import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { cacheSet, invalidateCache } from '../middleware/cache.middleware.js';
import { uploadSingleImageToCloudinary } from '../services/cloudinary.service.js';
import {
  createMangaService,
  deleteMangaWithChaptersService,
  getMangaWithChaptersService,
  listMangaService,
  updateMangaService
} from '../services/manga.service.js';

export const getMangaList = asyncHandler(async (req, res) => {
  const payload = await listMangaService(req.query);
  await cacheSet(res, payload);
  res.json(payload);
});

export const getMangaById = asyncHandler(async (req, res) => {
  const payload = await getMangaWithChaptersService(req.params.id);
  await cacheSet(res, payload);
  res.json(payload);
});

export const createManga = asyncHandler(async (req, res) => {
  const { title, description, genres, author, category } = req.body;

  if (!title || !description) {
    throw new ApiError(400, 'title and description are required');
  }

  if (!req.file) {
    throw new ApiError(400, 'coverImage file is required');
  }

  const cover = await uploadSingleImageToCloudinary(req.file, 'covers');

  const manga = await createMangaService({
    title,
    description,
    author: String(author || '').trim(),
    category: String(category || 'manga').trim(),
    genres: Array.isArray(genres) ? genres : String(genres || '').split(',').map((g) => g.trim()).filter(Boolean),
    coverImage: {
      url: cover.url,
      publicId: cover.publicId
    },
    createdBy: req.user?._id
  });

  await invalidateCache();
  res.status(201).json(manga);
});

export const updateManga = asyncHandler(async (req, res) => {
  const patch = {};
  const { title, description, genres, author, category } = req.body;

  if (title) patch.title = title;
  if (description) patch.description = description;
  if (author !== undefined) patch.author = String(author).trim();
  if (category !== undefined) patch.category = String(category).trim();
  if (genres !== undefined) {
    patch.genres = Array.isArray(genres)
      ? genres
      : String(genres)
          .split(',')
          .map((g) => g.trim())
          .filter(Boolean);
  }

  if (req.file) {
    const cover = await uploadSingleImageToCloudinary(req.file, 'covers');
    patch.coverImage = { url: cover.url, publicId: cover.publicId };
  }

  const manga = await updateMangaService(req.params.id, patch);
  await invalidateCache();

  res.json(manga);
});

export const deleteManga = asyncHandler(async (req, res) => {
  const payload = await deleteMangaWithChaptersService(req.params.id);
  await invalidateCache();
  res.json(payload);
});
