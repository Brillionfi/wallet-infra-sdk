/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import logger from '@utils/logger';
import { handleError, CustomError, HttpStatusCode } from '@utils/errors';

jest.mock('@utils/logger', () => ({
  error: jest.fn(),
}));

describe('handleError', () => {
  const originalConsoleError = logger.error;

  beforeEach(() => {
    logger.error = jest.fn();
  });

  afterEach(() => {
    logger.error = originalConsoleError;
  });

  const createAxiosError = (
    message: string,
    status?: number,
    data?: any,
  ): AxiosError => {
    const error = new Error(message) as AxiosError;
    error.isAxiosError = true;
    error.response =
      status !== undefined
        ? {
            status,
            data: data ?? {},
            statusText: '',
            headers: {},
            config: {} as any,
          }
        : undefined;
    error.config = {} as any;
    return error;
  };

  it('should log validation error and throw', () => {
    const message = 'This is a validation error';
    const error = createAxiosError(message, HttpStatusCode.BAD_REQUEST);

    expect(() => handleError(error)).toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      `BadRequest Error (${HttpStatusCode.BAD_REQUEST}):`,
      message,
    );
  });

  it('should log not found error and throw', () => {
    const message = 'Resource not found';
    const error = createAxiosError(message, HttpStatusCode.NOT_FOUND);

    expect(() => handleError(error)).toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      `NotFound Error (${HttpStatusCode.NOT_FOUND}):`,
      message,
    );
  });

  it('should log forbidden error and throw', () => {
    const message = 'Access forbidden';
    const error = createAxiosError(message, HttpStatusCode.FORBIDDEN);

    expect(() => handleError(error)).toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      `Forbidden Error (${HttpStatusCode.FORBIDDEN}):`,
      message,
    );
  });

  it('should log unauthorized error and throw', () => {
    const message = 'Unauthorized access';
    const error = createAxiosError(message, HttpStatusCode.UNAUTHORIZED);

    expect(() => handleError(error)).toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      `Unauthorized Error (${HttpStatusCode.UNAUTHORIZED}):`,
      message,
    );
  });

  it('should log internal server error and retry message, then throw', () => {
    const message = 'Internal server error';
    const error = createAxiosError(
      message,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );

    expect(() => handleError(error)).toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      `Internal Error (${HttpStatusCode.INTERNAL_SERVER_ERROR}):`,
      message,
    );
    expect(logger.error).toHaveBeenCalledWith('Retrying ...');
  });

  it('should log and rethrow an unexpected API error', () => {
    const message = 'Unexpected error';
    const unexpectedStatusCode = 499; // Use a non-standard status code
    const error = createAxiosError(message, unexpectedStatusCode);

    expect(() => handleError(error)).toThrow();

    expect(logger.error).toHaveBeenCalledWith(
      `Unexpected API Error (${unexpectedStatusCode}):`,
      message,
    );
  });

  it('should log custom error and throw', () => {
    const message = 'This is a custom error';
    const error = new CustomError(message);

    expect(() => handleError(error)).toThrow(CustomError);
    expect(logger.error).toHaveBeenCalledWith(`Custom Error: ${message}`);
  });

  it('should log unexpected error and throw', () => {
    const message = 'Unexpected error occurred';
    const error = new Error(message);

    expect(() => handleError(error)).toThrow(Error);
    expect(logger.error).toHaveBeenCalledWith(
      `An unexpected error occurred: ${message}`,
    );
  });

  it('should log unknown error occurred', () => {
    const error = undefined;
    expect(() => handleError(error)).toThrow();
    expect(logger.error).toHaveBeenCalledWith('An unknown error occurred');
  });

  it('should handle error when response is undefined', () => {
    const message = 'No response';
    const error = createAxiosError(message);

    expect(() => handleError(error)).toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      'Unexpected API Error (undefined):',
      message,
    );
  });

  it('should handle error when response does not have status', () => {
    const message = 'Response without status';
    const error = createAxiosError(message, undefined, {});

    expect(() => handleError(error)).toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      'Unexpected API Error (undefined):',
      message,
    );
  });

  it('should handle error when response does not have data.message', () => {
    const message = 'Response without data.message';
    const error = createAxiosError(message, HttpStatusCode.BAD_REQUEST, {});

    expect(() => handleError(error)).toThrow();
    expect(logger.error).toHaveBeenCalledWith(
      `BadRequest Error (${HttpStatusCode.BAD_REQUEST}):`,
      message,
    );
  });
});
