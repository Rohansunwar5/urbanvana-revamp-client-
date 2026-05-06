import redisClient from '@/lib/redis';
import { TooManyRequestsError } from '@/lib/errors/too-many-request.error';

async function rateLimit(
  ip: string,
  key: string,
  limit: number,
  windowMs: number,
): Promise<void> {
  const redisKey = `ratelimit:${key}:${ip}`;
  const count = await redisClient.incr(redisKey);
  if (count === 1) {
    await redisClient.pExpire(redisKey, windowMs);
  }
  if (count > limit) {
    throw new TooManyRequestsError();
  }
}

export const generalLimit = (ip: string) => rateLimit(ip, 'general', 120, 60_000);
export const authLimit = (ip: string) => rateLimit(ip, 'auth', 20, 15 * 60_000);
export const strictLimit = (ip: string) => rateLimit(ip, 'strict', 5, 15 * 60_000);
