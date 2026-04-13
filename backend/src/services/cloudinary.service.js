import { cloudinary, hasCloudinaryConfig } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';

const folderBase = process.env.CLOUDINARY_FOLDER || 'manga-site';
const uploadConcurrency = Math.max(Number(process.env.UPLOAD_CONCURRENCY || 3), 1);

const uploadStream = (fileBuffer, { folder, resourceType = 'image', publicIdPrefix = 'file' }) =>
  new Promise((resolve, reject) => {
    const publicId = `${publicIdPrefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: publicId,
        overwrite: false,
        use_filename: false,
        unique_filename: false,
        transformation: resourceType === 'image' ? [{ quality: 'auto', fetch_format: 'auto' }] : undefined
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });

const runWithConcurrency = async (tasks, concurrency) => {
  const results = [];
  let index = 0;

  const worker = async () => {
    while (index < tasks.length) {
      const current = index;
      index += 1;
      results[current] = await tasks[current]();
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, worker);
  await Promise.all(workers);
  return results;
};

export const uploadImagesToCloudinary = async (files, folder = 'chapters') => {
  if (!hasCloudinaryConfig) {
    throw new ApiError(500, 'Cloudinary is not configured');
  }

  const tasks = files.map((file, idx) => () =>
    uploadStream(file.buffer, {
      folder: `${folderBase}/${folder}`,
      resourceType: 'image',
      publicIdPrefix: `img-${idx + 1}`
    })
  );

  const uploaded = await runWithConcurrency(tasks, uploadConcurrency);

  return uploaded.map((asset) => ({
    url: asset.secure_url,
    publicId: asset.public_id,
    width: asset.width,
    height: asset.height,
    bytes: asset.bytes,
    format: asset.format
  }));
};

export const uploadSingleImageToCloudinary = async (file, folder = 'covers') => {
  if (!hasCloudinaryConfig) {
    throw new ApiError(500, 'Cloudinary is not configured');
  }

  const asset = await uploadStream(file.buffer, {
    folder: `${folderBase}/${folder}`,
    resourceType: 'image',
    publicIdPrefix: 'cover'
  });

  return {
    url: asset.secure_url,
    publicId: asset.public_id,
    width: asset.width,
    height: asset.height,
    bytes: asset.bytes,
    format: asset.format
  };
};

export const deleteCloudinaryAssets = async (publicIds = []) => {
  if (!hasCloudinaryConfig || !publicIds.length) return;

  await cloudinary.api.delete_resources(publicIds, {
    resource_type: 'image'
  });
};
