import axios from 'axios';
import { CustomError } from '@utils/errors';
import logger from 'loglevel';
import { BundleStamper, WebauthnStamper } from '@utils/stampers';

export async function sendTurnkeyRequest<T>(
  url: string,
  data: unknown,
  stamper: WebauthnStamper | BundleStamper,
): Promise<T> {
  const baseUrl = 'https://api.turnkey.com';
  const { stampHeaderName, stampHeaderValue } = await stamper.stamp(
    JSON.stringify(data),
  );
  try {
    const response = await axios.post(baseUrl + url, data, {
      headers: {
        [stampHeaderName]: stampHeaderValue,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    logger.error(
      'An error happened when try to send a request to turnkey,' +
        ` url: ${url}, data: ${data}, error:${JSON.stringify(error)}`,
    );
    throw new CustomError('There is unexpected error happens.');
  }
}
