import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { signToken } from '../utils/jwt.js';

export const registerAdminService = async ({ username, email, password, setupKey }) => {
  const expectedKey = process.env.ADMIN_SETUP_KEY;

  if (!expectedKey || setupKey !== expectedKey) {
    throw new ApiError(403, 'Invalid admin setup key');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'Email already in use');
  }

  const user = await User.create({
    username,
    email,
    password,
    role: 'admin'
  });

  const token = signToken({ userId: user._id, role: user.role });
  return { user, token };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken({ userId: user._id, role: user.role });

  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  };
};
