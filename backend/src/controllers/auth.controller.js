import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { loginService, registerAdminService, registerUserService } from '../services/auth.service.js';

export const registerAdmin = asyncHandler(async (req, res) => {
  const { username, email, password, setupKey } = req.body;

  if (!username || !email || !password || !setupKey) {
    throw new ApiError(400, 'username, email, password, setupKey are required');
  }

  const result = await registerAdminService({ username, email, password, setupKey });

  res.status(201).json({
    token: result.token,
    user: {
      _id: result.user._id,
      username: result.user.username,
      email: result.user.email,
      role: result.user.role
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'email and password are required');
  }

  const result = await loginService({ email, password });
  res.json(result);
});

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, 'username, email and password are required');
  }

  const result = await registerUserService({ username, email, password });
  res.status(201).json(result);
});
