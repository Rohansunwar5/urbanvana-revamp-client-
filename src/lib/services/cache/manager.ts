import redisClient from '@/lib/redis';
import config from '@/lib/config';

const setNxInRedis = async (key: string, value: unknown) => {
  await redisClient.setNX(key, JSON.stringify(value));
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function CacheManager<T, J = unknown>(prefix: string, duration: number) {
  const generateKey = (pfx: string, values: T) =>
    `${config.SERVER_NAME}_${pfx}_${Object.values(values as unknown as Record<string, string>)
      .sort()
      .join('_')}`;

  const keyPattern = `${config.SERVER_NAME}_${prefix}_*`;

  return {
    get: async (values: T): Promise<J | null> => {
      try {
        if (!redisClient.isReady) return null;
        const key = generateKey(prefix, values);
        const data = await redisClient.get(key);
        if (!data) return null;
        return JSON.parse(data) as J;
      } catch {
        return null;
      }
    },
    set: async (keys: T, data: J) => {
      try {
        if (!redisClient.isReady) return;
        const key = generateKey(prefix, keys);
        await redisClient.setEx(
          key,
          duration,
          typeof data === 'string' ? data : JSON.stringify(data),
        );
      } catch {
        // cache write failure is non-fatal
      }
    },
    remove: async (keys: T) => {
      try {
        if (!redisClient.isReady) return;
        const key = generateKey(prefix, keys);
        await redisClient.del(key);
      } catch {
        // non-fatal
      }
    },
    flush: async () => {
      try {
        if (!redisClient.isReady) return;
        let cursor = '0';
        do {
          const reply = await redisClient.scan(cursor, { MATCH: keyPattern, COUNT: 100 });
          cursor = String(reply.cursor);
          if (reply.keys.length) await redisClient.del(reply.keys);
        } while (cursor !== '0');
      } catch {
        // non-fatal
      }
    },
    setNx: async (keys: T, data: unknown) => {
      try {
        if (!redisClient.isReady) return;
        const key = generateKey(prefix, keys);
        return setNxInRedis(key, data);
      } catch {
        // non-fatal
      }
    },
  };
}

export default CacheManager;
