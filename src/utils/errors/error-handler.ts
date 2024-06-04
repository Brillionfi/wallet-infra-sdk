/* eslint-disable no-console */
// todo(handleError): replace with error logging
// todo(handleError): implement retry mechanism

import {
  CustomError,
  ValidationError,
  NotFoundError,
  APIError,
} from '@utils/errors';

export const handleError = (error: Error): void => {
  if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof NotFoundError) {
    console.error('Not found error:', error.message);
  } else if (error instanceof APIError) {
    console.error(`API error (${error.statusCode}):`, error.message);
    if (error.statusCode >= 500 && error.statusCode < 600) {
      console.error('Retrying due to server error...');
    }
  } else if (error instanceof CustomError) {
    console.error('Custom error:', error.message);
  } else {
    console.error('An unexpected error occurred:', error.message);
  }

  throw error;
};
