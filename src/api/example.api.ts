import { HttpClient } from '@utils/http-client';
import { IExample } from '@models/example.models';
import logger from '@utils/logger';

export class ExampleEndpoint {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public async createExample(example: IExample): Promise<IExample> {
    logger.info('Creating example');
    const response = await this.httpClient.post('/examples', example);
    return response.data as IExample;
  }

  public async getExample(exampleId: string): Promise<IExample> {
    logger.info('Getting example');
    const response = await this.httpClient.get(`/examples/${exampleId}`);
    return response.data as IExample;
  }
}
