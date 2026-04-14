import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { buildPaginatedResponse, parsePagination } from '../utils/pagination.js';

export const listUsersService = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const search = String(query.search || '').trim();

  const filter = {};
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const [docs, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password').lean(),
    User.countDocuments(filter)
  ]);

  return buildPaginatedResponse({ docs, total, page, limit });
};

export const updateUserService = async (userId, patch) => {
  const allowedPatch = {};
  if (patch.username !== undefined) {
    allowedPatch.username = String(patch.username).trim();
  }
  if (patch.role !== undefined) {
    allowedPatch.role = patch.role;
  }

  if (Object.keys(allowedPatch).length === 0) {
    throw new ApiError(400, 'No updatable fields provided');
  }

  const user = await User.findByIdAndUpdate(userId, allowedPatch, {
    new: true,
    runValidators: true
  })
    .select('-password')
    .lean();

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export const deleteUserService = async (userId, currentUserId) => {
  if (String(userId) === String(currentUserId)) {
    throw new ApiError(400, 'You cannot delete your own admin account');
  }

  const user = await User.findByIdAndDelete(userId).select('-password').lean();
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return { success: true };
};
