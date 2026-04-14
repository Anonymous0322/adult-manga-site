import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteUserService, listUsersService, updateUserService } from '../services/user.service.js';

export const listUsers = asyncHandler(async (req, res) => {
  const payload = await listUsersService(req.query);
  res.json(payload);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await updateUserService(req.params.id, req.body || {});
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const payload = await deleteUserService(req.params.id, req.user?._id);
  res.json(payload);
});
