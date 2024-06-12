import { HttpClient } from '@utils/http-client';
import { WalletService } from '@services/wallet.service';
import { Config, ConfigKeys } from './config';
import { TransactionService } from '@services/transaction.service';

export class WalletInfra {
  private config: Config;
  private baseURL: string;

  private httpClient: HttpClient;
  public Transaction: TransactionService;
  public Wallet: WalletService;

  constructor() {
    this.config = new Config();
    this.baseURL = this.config.get(ConfigKeys.BASE_URL);

    this.httpClient = new HttpClient(this.baseURL);
    this.Transaction = new TransactionService(this.httpClient);

    this.Wallet = new WalletService(this.httpClient);
  }
}
