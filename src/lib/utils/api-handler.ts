import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { CustomError } from '@/lib/errors/custom.error';
import { RequestValidationError } from '@/lib/errors/request-validation.error';
import { errorResponse } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';
import connectDB from '@/lib/db';
import { ensureRedisConnected } from '@/lib/redis';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  18,
);

type RouteHandler = (
  request: Request,
  context: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

export function apiHandler(fn: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      await connectDB();
      ensureRedisConnected(); // fire-and-forget — cache ops degrade gracefully when Redis is cold
      return await fn(request, context);
    } catch (err) {
      const path = new URL(request.url).pathname;
      const rayId = nanoid();

      if (err instanceof ZodError) {
        const validationError = new RequestValidationError(err);
        const errors = validationError.serializeErrors();
        logger.error(`route: ${path}, errorMsg: Validation Error, rayId: ${rayId}`);
        return errorResponse(errors, 400, `route: ${path}, errorMsg: Validation Error, rayId: ${rayId}`);
      }

      if (err instanceof CustomError) {
        const errors = err.serializeErrors();
        const msg = `route: ${path}, errorMsg: ${errors[0]?.message}, rayId: ${rayId}`;
        // 4xx are expected conditions (auth required, not found, etc.) — don't pollute error logs
        if (err.statusCode >= 500) {
          logger.error(msg);
        } else {
          logger.warn(msg);
        }
        return errorResponse(errors, err.statusCode, msg);
      }

      const message = err instanceof Error ? err.message : 'Something unexpected happened';
      const msg = `route: ${path}, errorMsg: ${message}, rayId: ${rayId}`;
      logger.error(msg);
      return errorResponse([{ message: 'Something unexpected happened' }], 500, msg);
    }
  };
}
