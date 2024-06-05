import { HttpClient } from '@utils/http-client';
import { ExampleService } from '@services/example.service';
import { CreateWallet } from '@api/endpoints/wallet.api';

export class WalletInfra {
  private httpClient: HttpClient;
  public example: ExampleService;
  public createWallet: CreateWallet;

  constructor(baseURL: string, jwt?: string) {
    this.httpClient = new HttpClient(baseURL, jwt);
    this.example = new ExampleService(this.httpClient);

    this.createWallet = new CreateWallet(this.httpClient, '/wallet');
  }
}
