// todo(handleError): implement retry mechanism
import { APIError, CustomError, HttpStatusCode } from '@utils/errors';
import logger from '@utils/logger';

export const handleError = (error: Error): void => {
  if (error instanceof APIError) {
    if (error.statusCode === HttpStatusCode.BAD_REQUEST) {
      logger.error(`BadRequest Error (${error.statusCode}):`, error.message);
    } else if (error.statusCode === HttpStatusCode.NOT_FOUND) {
      logger.error(`NotFound Error (${error.statusCode}):`, error.message);
    } else if (error.statusCode === HttpStatusCode.FORBIDDEN) {
      logger.error(`Forbidden Error (${error.statusCode}):`, error.message);
    } else if (error.statusCode === HttpStatusCode.UNAUTHORIZED) {
      logger.error(`Unauthorized Error (${error.statusCode}):`, error.message);
    } else if (
      error.statusCode >= HttpStatusCode.INTERNAL_SERVER_ERROR &&
      error.statusCode < 600
    ) {
      logger.error(`Internal Error (${error.statusCode}):`, error.message);
      logger.error('Retrying ...');
    }
  } else if (error instanceof CustomError) {
    logger.error('Custom Error:', error.message);
  } else {
    logger.error('An unexpected error occurred:', error.message);
  }

  throw error;
};
