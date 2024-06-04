/* eslint-disable no-console */
// todo(handleError): replace with error logging

import {
  APIError,
  handleError,
  CustomError,
  HttpStatusCode,
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
    const error = new APIError(message, HttpStatusCode.BAD_REQUEST);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `BadRequest Error (${HttpStatusCode.BAD_REQUEST}):`,
      message,
    );
  });

  it('should log not found error and throw', () => {
    const message = 'Resource not found';
    const error = new APIError(message, HttpStatusCode.NOT_FOUND);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `NotFound Error (${HttpStatusCode.NOT_FOUND}):`,
      message,
    );
  });

  it('should log forbidden error and throw', () => {
    const message = 'Access forbidden';
    const error = new APIError(message, HttpStatusCode.FORBIDDEN);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `Forbiden Error (${HttpStatusCode.FORBIDDEN}):`,
      message,
    );
  });

  it('should log unauthorized error and throw', () => {
    const message = 'Unauthorized access';
    const error = new APIError(message, HttpStatusCode.UNAUTHORIZED);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `Unauthorized Error (${HttpStatusCode.UNAUTHORIZED}):`,
      message,
    );
  });

  it('should log internal server error and retry message, then throw', () => {
    const message = 'Internal server error';
    const error = new APIError(message, HttpStatusCode.INTERNAL_SERVER_ERROR);

    expect(() => handleError(error)).toThrow(APIError);
    expect(console.error).toHaveBeenCalledWith(
      `Internal Error (${HttpStatusCode.INTERNAL_SERVER_ERROR}):`,
      message,
    );
    expect(console.error).toHaveBeenCalledWith('Retrying ...');
  });

  it('should log custom error and throw', () => {
    const message = 'This is a custom error';
    const error = new CustomError(message);

    expect(() => handleError(error)).toThrow(CustomError);
    expect(console.error).toHaveBeenCalledWith('Custom Error:', message);
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
