import { HttpClient } from '@utils/http-client';
import { ExampleService } from '@services/example.service';

export class WalletInfra {
  private httpClient: HttpClient;
  public example: ExampleService;

  constructor(baseURL: string) {
    this.httpClient = new HttpClient(baseURL);
    this.example = new ExampleService(this.httpClient);
  }
}
