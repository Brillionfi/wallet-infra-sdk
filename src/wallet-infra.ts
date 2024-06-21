import { WalletService } from '@services/wallet.service';
import { TransactionService } from '@services/transaction.service';
import { HttpClient } from './utils';
import { Config, ConfigKeys } from './config';
import { CredentialsProvider } from '@models/wallet.models';

export class WalletInfra {
  public Transaction: TransactionService;
  public Wallet: WalletService;
  private appId: string;
  private httpClient: HttpClient;
  private config: Config;

  constructor(appId: string) {
    this.appId = appId;
    this.config = new Config();
    this.httpClient = new HttpClient();
    this.Transaction = new TransactionService(this.httpClient);
    this.Wallet = new WalletService(this.httpClient);
  }

  public generateAuthUrl(
    redirectUrl: string,
    provider: CredentialsProvider,
  ): string {
    const baseURL = this.config.get(ConfigKeys.BASE_URL);
    return `${baseURL}/users/login?oAuthProvider=${provider}&loginType=WALLET_USER&redirectUrl=${redirectUrl}&appId=${this.appId}`;
  }

  public authenticateUser(jwt: string) {
    this.httpClient.authorize(jwt);
  }
}
