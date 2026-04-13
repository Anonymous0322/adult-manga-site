import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const maxFileSize = Number(process.env.UPLOAD_MAX_FILE_SIZE || 15 * 1024 * 1024);
const maxFiles = Number(process.env.UPLOAD_MAX_FILES || 100);

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
  if (!allowed.includes(file.mimetype)) {
    cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
    files: maxFiles
  }
});
