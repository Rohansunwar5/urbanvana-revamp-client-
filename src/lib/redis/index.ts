import * as redis from 'redis';
import config from '@/lib/config';

declare global {
  // eslint-disable-next-line no-var
  var _redisClient: ReturnType<typeof redis.createClient> | undefined;
  // eslint-disable-next-line no-var
  var _redisConnectPromise: Promise<void> | undefined;
}

const createRedisClient = () => {
  const client = redis.createClient({
    url: `redis://:${config.REDIS_HOST}:${config.REDIS_PORT}`,
    disableOfflineQueue: true,
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: (retries) => {
        if (retries >= 3) return false;
        return Math.min(retries * 200, 1000);
      },
    },
  });

  client.on('error', (err) => {
    console.error('Redis client error:', err.message);
  });

  return client;
};

const redisClient = global._redisClient ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  global._redisClient = redisClient;
}

// Connect once in background — never block a request waiting for this
export const ensureRedisConnected = (): void => {
  if (redisClient.isOpen || redisClient.isReady) return;
  if (global._redisConnectPromise) return;

  global._redisConnectPromise = redisClient
    .connect()
    .then(() => {
      global._redisConnectPromise = undefined;
    })
    .catch((err) => {
      console.error('Redis connect failed:', err.message);
      global._redisConnectPromise = undefined;
    });
};

export const isRedisReady = () => redisClient.isReady;

export default redisClient;
