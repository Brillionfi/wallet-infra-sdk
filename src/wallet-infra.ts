import { HttpClient } from '@utils/http-client';
import { ExampleService } from '@services/example.service';
import { WalletService } from '@services/wallet.service';

export class WalletInfraSDK {
  private httpClient: HttpClient;
  public example: ExampleService;
  public wallet: WalletService;

  constructor(baseURL: string, jwt?: string) {
    this.httpClient = new HttpClient(baseURL, jwt);
    this.example = new ExampleService(this.httpClient);

    this.wallet = new WalletService(this.httpClient);
  }
}
