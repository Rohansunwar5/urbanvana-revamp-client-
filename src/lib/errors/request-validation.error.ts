import { ZodError } from 'zod';
import { CustomError } from './custom.error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ZodError) {
    super('Invalid request parameters');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.errors.map((e) => ({
      message: e.message,
      field: e.path.join('.'),
    }));
  }
}
