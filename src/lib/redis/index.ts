import * as redis from 'redis';
import config from '@/lib/config';

declare global {
  // eslint-disable-next-line no-var
  var _redisClient: ReturnType<typeof redis.createClient> | undefined;
}

const createRedisClient = () => {
  const client = redis.createClient({
    url: `redis://:${config.REDIS_HOST}:${config.REDIS_PORT}`,
    disableOfflineQueue: true,
  });

  client.on('error', (err) => {
    console.error('Redis client error:', err);
  });

  return client;
};

const redisClient = global._redisClient ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  global._redisClient = redisClient;
}

export const ensureRedisConnected = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export default redisClient;
