import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadImagesToCloudinary } from '../services/cloudinary.service.js';

export const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    throw new ApiError(400, 'No files uploaded');
  }

  const folder = req.body.folder || 'uploads';
  const images = await uploadImagesToCloudinary(req.files, folder);

  res.status(201).json({
    count: images.length,
    images
  });
});
