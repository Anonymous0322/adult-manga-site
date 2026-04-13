import rateLimit from 'express-rate-limit';

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const max = Number(process.env.RATE_LIMIT_MAX || 300);
const uploadMax = Number(process.env.UPLOAD_RATE_LIMIT_MAX || 30);

export const apiRateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests, please try again later.'
  }
});

export const uploadRateLimiter = rateLimit({
  windowMs,
  max: uploadMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many upload requests, please slow down.'
  }
});
