/* eslint-disable no-console */
// todo(handleError): replace with error logging

import {
  handleError,
  APIError,
  ValidationError,
  NotFoundError,
  CustomError,
} from '@utils/errors';

describe('handleError', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should log validation error and throw', () => {
    const message = 'This is a validation error';
    const error = new ValidationError(message);

    expect(() => handleError(error)).toThrow(ValidationError);
    expect(console.error).toHaveBeenCalledWith('Validation error:', message);
  });

  it('should log not found error and throw', () => {
    const message = 'Resource not found';
    const error = new NotFoundError(message);

    expect(() => handleError(error)).toThrow(NotFoundError);
    expect(console.error).toHaveBeenCalledWith('Not found error:', message);
  });

  it('should log API error and throw', () => {
    const message = 'API endpoint not reachable';
    const statusCode = 500;
    const error = new APIError(message, statusCode);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `API error (${statusCode}):`,
      message,
    );
    expect(console.error).toHaveBeenCalledWith(
      'Retrying due to server error...',
    );
  });

  it('should log custom error and throw', () => {
    const message = 'This is a custom error';
    const error = new CustomError(message);

    expect(() => handleError(error)).toThrow(CustomError);
    expect(console.error).toHaveBeenCalledWith('Custom error:', message);
  });

  it('should log unexpected error and throw', () => {
    const message = 'Unexpected error occurred';
    const error = new Error(message);

    expect(() => handleError(error)).toThrow(Error);
    expect(console.error).toHaveBeenCalledWith(
      'An unexpected error occurred:',
      message,
    );
  });
});
