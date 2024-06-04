/* eslint-disable no-console */
// todo(handleError): replace with error logging

import { handleError } from '@utils/errors/error-handler';
import { APIError } from '@utils/errors/api-error';
import { CustomError } from '@utils/errors/custom-error';
import { HttpStatusCode } from '@utils/errors/http-status-code';

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
    const error = new APIError(message, HttpStatusCode.BAD_REQUEST);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `API error (${HttpStatusCode.BAD_REQUEST}):`,
      message,
    );
    expect(console.error).toHaveBeenCalledWith(
      `Validation error ${HttpStatusCode.BAD_REQUEST}: ${message}`,
    );
  });

  it('should log not found error and throw', () => {
    const message = 'Resource not found';
    const error = new APIError(message, HttpStatusCode.NOT_FOUND);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `API error (${HttpStatusCode.NOT_FOUND}):`,
      message,
    );
    expect(console.error).toHaveBeenCalledWith(
      `Not found error ${HttpStatusCode.NOT_FOUND}: ${message}`,
    );
  });

  it('should log forbidden error and throw', () => {
    const message = 'Access forbidden';
    const error = new APIError(message, HttpStatusCode.FORBIDDEN);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `API error (${HttpStatusCode.FORBIDDEN}):`,
      message,
    );
    expect(console.error).toHaveBeenCalledWith(
      `Forbiden error ${HttpStatusCode.FORBIDDEN}: ${message}`,
    );
  });

  it('should log unauthorized error and throw', () => {
    const message = 'Unauthorized access';
    const error = new APIError(message, HttpStatusCode.UNAUTHORIZED);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `API error (${HttpStatusCode.UNAUTHORIZED}):`,
      message,
    );
    expect(console.error).toHaveBeenCalledWith(
      `Unauthorized error ${HttpStatusCode.UNAUTHORIZED}: ${message}`,
    );
  });

  it('should log internal server error and retry message, then throw', () => {
    const message = 'Internal server error';
    const error = new APIError(message, HttpStatusCode.INTERNAL_SERVER_ERROR);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `API error (${HttpStatusCode.INTERNAL_SERVER_ERROR}):`,
      message,
    );
    expect(console.error).toHaveBeenCalledWith(
      `Internal Error ${HttpStatusCode.INTERNAL_SERVER_ERROR}: ${message}`,
    );
    expect(console.error).toHaveBeenCalledWith('Retrying ...');
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
