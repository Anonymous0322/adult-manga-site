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

    app.listen(port, '0.0.0.0', () => {
  console.log(`API server running on port ${port}`);
});
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();