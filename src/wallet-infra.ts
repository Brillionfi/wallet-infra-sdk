import { HttpClient } from '@utils/http-client';
import { ExampleService } from '@services/example.service';
import { WalletService } from '@services/wallet.service';
import { Config, ConfigKeys } from './config';

export class WalletInfra {
  private config: Config;
  private baseURL: string;

  private httpClient: HttpClient;
  public example: ExampleService;
  public Wallet: WalletService;

  constructor() {
    this.config = new Config();
    this.baseURL = this.config.get(ConfigKeys.BASE_URL);

    this.httpClient = new HttpClient(this.baseURL);
    this.example = new ExampleService(this.httpClient);
    this.Wallet = new WalletService(this.httpClient);
  }
}
