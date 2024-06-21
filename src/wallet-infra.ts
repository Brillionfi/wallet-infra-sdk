import { WalletService } from '@services/wallet.service';
import { TransactionService } from '@services/transaction.service';
import { HttpClient } from './utils';

export class WalletInfra {
  public Transaction: TransactionService;
  public Wallet: WalletService;
  private appId: string;
  private httpClient: HttpClient;

  constructor(appId: string) {
    this.appId = appId;
    this.httpClient = new HttpClient();
    this.Transaction = new TransactionService(this.httpClient);
    this.Wallet = new WalletService(this.httpClient);
  }

  public generateAuthUrl(redirectUrl: string): string {
    return `/users/login?oAuthProvider=Google&loginType=WALLET_USER&redirectUrl=${redirectUrl}&appId=${this.appId}`;
  }

  public authenticateUser(jwt: string) {
    this.httpClient.jwt = jwt;
  }
}
