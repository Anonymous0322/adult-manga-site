import mongoose from 'mongoose';
import { Manga } from '../models/Manga.js';
import { Chapter } from '../models/Chapter.js';
import { ApiError } from '../utils/ApiError.js';
import { buildPaginatedResponse, parsePagination } from '../utils/pagination.js';
import { deleteCloudinaryAssets } from './cloudinary.service.js';

export const listMangaService = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const search = query.search?.trim();

  const filter = {};
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const [docs, total] = await Promise.all([
    Manga.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Manga.countDocuments(filter)
  ]);

  return buildPaginatedResponse({ docs, total, page, limit });
};

export const getMangaWithChaptersService = async (mangaId) => {
  const manga = await Manga.findById(mangaId).lean();
  if (!manga) {
    throw new ApiError(404, 'Manga not found');
  }

  const chapters = await Chapter.find({ mangaId })
    .sort({ chapterNumber: 1 })
    .lean();

  return { ...manga, chapters };
};

export const createMangaService = async ({
  title,
  description,
  author,
  category,
  genres,
  coverImage,
  createdBy
}) => {
  return Manga.create({ title, description, author, category, genres, coverImage, createdBy });
};

export const updateMangaService = async (mangaId, patch) => {
  const manga = await Manga.findByIdAndUpdate(mangaId, patch, {
    new: true,
    runValidators: true
  });

  if (!manga) {
    throw new ApiError(404, 'Manga not found');
  }

  return manga;
};

export const deleteMangaWithChaptersService = async (mangaId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const manga = await Manga.findById(mangaId).session(session);
    if (!manga) {
      throw new ApiError(404, 'Manga not found');
    }

    const chapters = await Chapter.find({ mangaId }).session(session);

    const publicIds = [
      manga.coverImage?.publicId,
      ...chapters.flatMap((chapter) => chapter.images.map((image) => image.publicId))
    ].filter(Boolean);

    await Chapter.deleteMany({ mangaId }).session(session);
    await Manga.findByIdAndDelete(mangaId).session(session);

    await session.commitTransaction();
    session.endSession();

    await deleteCloudinaryAssets(publicIds);

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const syncMangaChapterCount = async (mangaId) => {
  const count = await Chapter.countDocuments({ mangaId });
  await Manga.findByIdAndUpdate(mangaId, { chapterCount: count });
};
