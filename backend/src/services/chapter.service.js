import { Chapter } from '../models/Chapter.js';
import { Manga } from '../models/Manga.js';
import { ApiError } from '../utils/ApiError.js';
import { deleteCloudinaryAssets } from './cloudinary.service.js';
import { syncMangaChapterCount } from './manga.service.js';

export const createChapterService = async ({ mangaId, title, chapterNumber, images }) => {
  const mangaExists = await Manga.exists({ _id: mangaId });
  if (!mangaExists) {
    throw new ApiError(404, 'Manga not found');
  }

  const chapter = await Chapter.create({
    mangaId,
    title,
    chapterNumber,
    images
  });

  await syncMangaChapterCount(mangaId);

  return chapter;
};

export const getChapterService = async (chapterId, imagePage = 1, imageLimit = 20) => {
  const chapter = await Chapter.findById(chapterId).lean();
  if (!chapter) {
    throw new ApiError(404, 'Chapter not found');
  }

  const totalImages = chapter.images.length;
  const limit = Math.min(Math.max(Number(imageLimit), 1), 100);
  const page = Math.max(Number(imagePage), 1);
  const start = (page - 1) * limit;
  const end = start + limit;

  const pagedImages = chapter.images.slice(start, end);

  return {
    ...chapter,
    images: pagedImages,
    imagesPagination: {
      total: totalImages,
      page,
      limit,
      totalPages: Math.max(Math.ceil(totalImages / limit), 1),
      hasNextPage: end < totalImages,
      hasPrevPage: page > 1
    }
  };
};

export const deleteChapterService = async (chapterId) => {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    throw new ApiError(404, 'Chapter not found');
  }

  const mangaId = chapter.mangaId;
  const publicIds = chapter.images.map((image) => image.publicId).filter(Boolean);

  await Chapter.findByIdAndDelete(chapterId);
  await syncMangaChapterCount(mangaId);
  await deleteCloudinaryAssets(publicIds);

  return { success: true };
};
