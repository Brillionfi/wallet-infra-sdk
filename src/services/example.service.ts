import { ExampleEndpoint } from '@api/example.api';
import { IExample } from '@models/example.models';
import { HttpClient } from '@utils/http-client';

export class ExampleService {
  private exampleEndpoint: ExampleEndpoint;

  constructor(httpClient: HttpClient) {
    this.exampleEndpoint = new ExampleEndpoint(httpClient);
  }

  public async createExample(example: IExample): Promise<IExample> {
    return this.exampleEndpoint.createExample(example);
  }

  public async getExample(exampleId: string): Promise<IExample> {
    return this.exampleEndpoint.getExample(exampleId);
  }
}
