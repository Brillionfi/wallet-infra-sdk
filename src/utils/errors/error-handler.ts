import axios, { AxiosError, HttpStatusCode } from 'axios';
import { CustomError } from '@utils/errors';
import logger from 'loglevel';
import { ZodError } from 'zod';

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

const handleAxiosError = (error: AxiosError): void => {
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
        logger.error('Retrying ...');
        // TODO: implement retry mechanism
      } else {
        logger.error(`Unexpected API Error (${statusCode}):`, errorMessage);
      }
      break;
  }
};
