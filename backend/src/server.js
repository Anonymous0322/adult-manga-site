import dns from 'node:dns';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/cache.js';

dotenv.config();
dns.setServers(['8.8.8.8', '1.1.1.1']);

const port = Number(process.env.PORT || 5000);

const start = async () => {
  try {
    await connectDB();

    if (process.env.REDIS_URL) {
      await connectRedis();
    }

    app.listen(port, () => {
      console.log(`API server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();