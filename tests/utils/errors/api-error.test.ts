import { APIError } from '@utils/errors';

describe('APIError', () => {
  it('should create an error with a specific message and status code', () => {
    const message = 'This is an API error';
    const statusCode = 404;
    const error = new APIError(message, statusCode);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(APIError);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
  });

  it('should set the name property to "APIError"', () => {
    const message = 'This is an API error';
    const statusCode = 404;
    const error = new APIError(message, statusCode);

    expect(error.name).toBe('APIError');
  });

  it('should capture the stack trace', () => {
    const message = 'This is an API error';
    const statusCode = 404;
    const error = new APIError(message, statusCode);

    expect(error.stack).toBeDefined();
  });

  it('should work with try-catch blocks', () => {
    const message = 'This is an API error';
    const statusCode = 404;

    try {
      throw new APIError(message, statusCode);
    } catch (error) {
      expect(error).toBeInstanceOf(APIError);
      expect((error as APIError).message).toBe(message);
      expect((error as APIError).statusCode).toBe(statusCode);
      expect((error as APIError).name).toBe('APIError');
    }
  });
});
