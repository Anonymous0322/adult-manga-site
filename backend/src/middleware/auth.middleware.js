import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const extractToken = (authHeader) => {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer') return null;
  return token;
};

export const protect = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    throw new ApiError(401, 'Authorization token is missing');
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId).select('-password');

  if (!user) {
    throw new ApiError(401, 'Invalid token user');
  }

  req.user = user;
  next();
});

export const requireAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }
  next();
};
