import { getRedis } from '../config/cache.js';

const memoryCache = new Map();
const defaultTtl = Number(process.env.CACHE_TTL_SECONDS || 120);

const buildKey = (req) => `${req.originalUrl}`;

export const cacheGet = (ttlSeconds = defaultTtl) => async (req, res, next) => {
  const key = buildKey(req);
  const { client, ready } = getRedis();

  if (ready && client) {
    const cached = await client.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    res.locals.cache = { key, ttlSeconds };
    return next();
  }

  const inMem = memoryCache.get(key);
  if (inMem && inMem.exp > Date.now()) {
    return res.json(inMem.value);
  }

  res.locals.cache = { key, ttlSeconds };
  return next();
};

export const cacheSet = async (res, payload) => {
  const cacheMeta = res.locals.cache;
  if (!cacheMeta) return;

  const { key, ttlSeconds } = cacheMeta;
  const { client, ready } = getRedis();

  if (ready && client) {
    await client.set(key, JSON.stringify(payload), { EX: ttlSeconds });
    return;
  }

  memoryCache.set(key, { value: payload, exp: Date.now() + ttlSeconds * 1000 });
};

export const invalidateCache = async (prefixes = ['/api/manga', '/api/chapter']) => {
  const { client, ready } = getRedis();

  if (ready && client) {
    for (const prefix of prefixes) {
      const keys = await client.keys(`${prefix}*`);
      if (keys.length) {
        await client.del(keys);
      }
    }
    return;
  }

  for (const key of memoryCache.keys()) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      memoryCache.delete(key);
    }
  }
};
