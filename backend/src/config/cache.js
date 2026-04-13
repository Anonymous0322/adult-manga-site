import { createClient } from 'redis';

let redisClient = null;
let redisReady = false;

export const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    return null;
  }

  redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on('error', (error) => {
    redisReady = false;
    console.error('Redis error:', error.message);
  });

  redisClient.on('ready', () => {
    redisReady = true;
    console.log('Redis connected');
  });

  await redisClient.connect();
  return redisClient;
};

export const getRedis = () => ({ client: redisClient, ready: redisReady });
