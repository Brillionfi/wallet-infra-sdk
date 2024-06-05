import { HttpClient } from '@utils/http-client';
import { ExampleService } from '@services/example.service';
import { Wallet } from '@api/endpoints/wallet.api';

export class WalletInfraSDK {
  private httpClient: HttpClient;
  public example: ExampleService;
  public wallet: Wallet;

  constructor(baseURL: string, jwt?: string) {
    this.httpClient = new HttpClient(baseURL, jwt);
    this.example = new ExampleService(this.httpClient);

    this.wallet = new Wallet(this.httpClient, '/wallet');
  }
}
