import { APIError, CustomError, HttpStatusCode } from '@utils/errors';
import logger from '@utils/logger';

export const handleError = (error: unknown): never => {
  if (error instanceof APIError) {
    handleAPIError(error);
  } else if (error instanceof CustomError) {
    logger.error('Custom Error:', error.message);
  } else if (error instanceof Error) {
    logger.error('An unexpected error occurred:', error.message);
  } else {
    logger.error('An unknown error occurred');
  }

  throw error;
};

const handleAPIError = (error: APIError): void => {
  switch (error.statusCode) {
    case HttpStatusCode.BAD_REQUEST:
      logger.error(`BadRequest Error (${error.statusCode}):`, error.message);
      break;
    case HttpStatusCode.NOT_FOUND:
      logger.error(`NotFound Error (${error.statusCode}):`, error.message);
      break;
    case HttpStatusCode.FORBIDDEN:
      logger.error(`Forbidden Error (${error.statusCode}):`, error.message);
      break;
    case HttpStatusCode.UNAUTHORIZED:
      logger.error(`Unauthorized Error (${error.statusCode}):`, error.message);
      break;
    default:
      if (
        error.statusCode >= HttpStatusCode.INTERNAL_SERVER_ERROR &&
        error.statusCode < 600
      ) {
        logger.error(`Internal Error (${error.statusCode}):`, error.message);
        logger.error('Retrying ...');
        // todo: implement retry mechanism
      } else {
        logger.error(
          `Unexpected API Error (${error.statusCode}):`,
          error.message,
        );
      }
      break;
  }
};
