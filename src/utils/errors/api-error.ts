import { CustomError } from './custom-error';

export class APIError extends CustomError {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'APIError';
  }
}
