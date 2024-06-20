import axios, { AxiosError, HttpStatusCode } from 'axios';
import { CustomError } from '@utils/errors';
import logger from '@utils/logger';
import { ZodError } from 'zod';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    handleAxiosError(error);
  } else if (error instanceof CustomError) {
    logger.error(`Custom Error: ${error.message}`);
  } else if (error instanceof Error) {
    logger.error(`An unexpected error occurred: ${error.message}`);
  } else if (error instanceof ZodError) {
    logger.error('Zod Error:', error.errors);
  } else {
    logger.error('An unknown error occurred');
  }

  throw error;
};

const handleAxiosError = (error: AxiosError, retries = MAX_RETRIES): void => {
  const statusCode = error.response?.status;
  const errorMessage =
    (error.response?.data as { message?: string })?.message ??
    error.message ??
    'Unknown error';

  switch (statusCode) {
    case HttpStatusCode.BadRequest:
      logger.error(`BadRequest Error (${statusCode}):`, errorMessage);
      break;
    case HttpStatusCode.NotFound:
      logger.error(`NotFound Error (${statusCode}):`, errorMessage);
      break;
    case HttpStatusCode.Forbidden:
      logger.error(`Forbidden Error (${statusCode}):`, errorMessage);
      break;
    case HttpStatusCode.Unauthorized:
      logger.error(`Unauthorized Error (${statusCode}):`, errorMessage);
      break;
    default:
      if (
        statusCode &&
        statusCode >= HttpStatusCode.InternalServerError &&
        statusCode < 600
      ) {
        logger.error(`Internal Error (${statusCode}):`, errorMessage);
        if (retries > 0) {
          logger.error(
            `Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`,
          );
          setTimeout(() => {
            handleAxiosError(error, retries - 1);
          }, RETRY_DELAY);
        } else {
          logger.error('Max retries reached. Giving up.');
        }
      } else {
        logger.error(`Unexpected API Error (${statusCode}):`, errorMessage);
      }
      break;
  }
};
