import logger from '@utils/logger';
import {
  APIError,
  handleError,
  CustomError,
  HttpStatusCode,
} from '@utils/errors';

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

  it('should log validation error and throw', () => {
    const message = 'This is a validation error';
    const error = new APIError(message, HttpStatusCode.BAD_REQUEST);

    expect(() => handleError(error)).toThrow(APIError);
    expect(logger.error).toHaveBeenCalledWith(
      `BadRequest Error (${HttpStatusCode.BAD_REQUEST}):`,
      message,
    );
  });

  it('should log not found error and throw', () => {
    const message = 'Resource not found';
    const error = new APIError(message, HttpStatusCode.NOT_FOUND);

    expect(() => handleError(error)).toThrow(APIError);
    expect(logger.error).toHaveBeenCalledWith(
      `NotFound Error (${HttpStatusCode.NOT_FOUND}):`,
      message,
    );
  });

  it('should log forbidden error and throw', () => {
    const message = 'Access forbidden';
    const error = new APIError(message, HttpStatusCode.FORBIDDEN);

    expect(() => handleError(error)).toThrow(APIError);
    expect(logger.error).toHaveBeenCalledWith(
      `Forbidden Error (${HttpStatusCode.FORBIDDEN}):`,
      message,
    );
  });

  it('should log unauthorized error and throw', () => {
    const message = 'Unauthorized access';
    const error = new APIError(message, HttpStatusCode.UNAUTHORIZED);

    expect(() => handleError(error)).toThrow(APIError);
    expect(logger.error).toHaveBeenCalledWith(
      `Unauthorized Error (${HttpStatusCode.UNAUTHORIZED}):`,
      message,
    );
  });

  it('should log internal server error and retry message, then throw', () => {
    const message = 'Internal server error';
    const error = new APIError(message, HttpStatusCode.INTERNAL_SERVER_ERROR);

    expect(() => handleError(error)).toThrow(APIError);
    expect(logger.error).toHaveBeenCalledWith(
      `Internal Error (${HttpStatusCode.INTERNAL_SERVER_ERROR}):`,
      message,
    );
    expect(logger.error).toHaveBeenCalledWith('Retrying ...');
  });

  it('should log and rethrow an unexpected API error', () => {
    const unexpectedAPIError = new APIError('Unexpected error', 499);

    expect(() => handleError(unexpectedAPIError)).toThrow(unexpectedAPIError);

    expect(logger.error).toHaveBeenCalledWith(
      `Unexpected API Error (499):`,
      'Unexpected error',
    );
  });

  it('should log custom error and throw', () => {
    const message = 'This is a custom error';
    const error = new CustomError(message);

    expect(() => handleError(error)).toThrow(CustomError);
    expect(logger.error).toHaveBeenCalledWith('Custom Error:', message);
  });

  it('should log unexpected error and throw', () => {
    const message = 'Unexpected error occurred';
    const error = new Error(message);

    expect(() => handleError(error)).toThrow(Error);
    expect(logger.error).toHaveBeenCalledWith(
      'An unexpected error occurred:',
      message,
    );
  });

  it('should log unknown error occured', () => {
    const error = undefined;
    expect(() => handleError(error)).toThrow();
    expect(logger.error).toHaveBeenCalledWith('An unknown error occurred');
  });
});
