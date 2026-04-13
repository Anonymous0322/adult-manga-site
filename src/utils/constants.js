export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const CATEGORIES = {
  MANGA: 'Манга',
  OEL_MANGA: 'OEL-манга',
  MANHWA: 'Манхва',
  MANHUA: 'Маньхуа',
  RU_MANGA: 'Руманга',
  COMICS: 'Комикс',
  VIDEO: 'Видео'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

export const CONTENT_TYPES = {
  MANGA: 'manga',
  VIDEO: 'video'
};

export const RATING_LEVELS = [
  { level: 1, name: 'Новичок', minPoints: 0 },
  { level: 2, name: 'Любитель', minPoints: 500 },
  { level: 3, name: 'Знаток', minPoints: 2000 },
  { level: 4, name: 'Эксперт', minPoints: 5000 },
  { level: 5, name: 'Мастер', minPoints: 10000 }
];