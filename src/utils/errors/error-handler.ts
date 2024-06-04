// todo(handleError): replace with error logging
// todo(handleError): implement retry mechanism

/* eslint-disable no-console */
import { APIError } from './api-error';
import { CustomError } from './custom-error';
import { HttpStatusCode } from './http-status-code';

export const handleError = (error: Error): void => {
  if (error instanceof APIError) {
    if (error.statusCode === HttpStatusCode.BAD_REQUEST) {
      console.error(`BadRequest Error (${error.statusCode}):`, error.message);
    } else if (error.statusCode === HttpStatusCode.NOT_FOUND) {
      console.error(`NotFound Error (${error.statusCode}):`, error.message);
    } else if (error.statusCode === HttpStatusCode.FORBIDDEN) {
      console.error(`Forbiden Error (${error.statusCode}):`, error.message);
    } else if (error.statusCode === HttpStatusCode.UNAUTHORIZED) {
      console.error(`Unauthorized Error (${error.statusCode}):`, error.message);
    } else if (
      error.statusCode >= HttpStatusCode.INTERNAL_SERVER_ERROR &&
      error.statusCode < 600
    ) {
      console.error(`Internal Error (${error.statusCode}):`, error.message);
      console.error('Retrying ...');
    }
  } else if (error instanceof CustomError) {
    console.error('Custom Error:', error.message);
  } else {
    console.error('An unexpected error occurred:', error.message);
  }

  throw error;
};
