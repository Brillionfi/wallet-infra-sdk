import Config from '@config/config';
import { ConfigKeys } from '@config/config.interface';
import { TAxiosRequestSchema } from '@models/BaseEndpoint';
import { APIError } from '@utils/errors';
import axios, { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

class BaseEndpoint {
  config: Config;
  jwt: string;

  constructor(jwt: string) {
    this.jwt = jwt;
    this.config = new Config();
  }

  private prepareHeader = (): object => {
    return {
      Authorization: `Bearer ${this.jwt}`,
      'X-Idempotency-Key': uuidv4(),
    };
  };

  execute = async ({
    url,
    method,
    data,
    params,
  }: TAxiosRequestSchema): Promise<AxiosResponse<void, void>> => {
    //TODO fix type here
    try {
      const headers = this.prepareHeader();

      return await axios({
        method,
        url: this.config.get(ConfigKeys.BASE_URL) + url,
        data,
        params,
        headers,
      });
    } catch (error) {
      throw new APIError((error as Error).message, 500);
    }
  };
}

export default BaseEndpoint;
