import { WalletService } from '@services/wallet.service';
import { TransactionService } from '@services/transaction.service';
import { TokenService } from '@services/token.service';

export class WalletInfra {
  public Transaction: TransactionService;
  public Wallet: WalletService;
  public Token: TokenService;

  constructor() {
    this.Transaction = new TransactionService();
    this.Wallet = new WalletService();
    this.Token = new TokenService();
  }
}
