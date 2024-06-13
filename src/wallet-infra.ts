import { WalletService } from '@services/wallet.service';
import { TransactionService } from '@services/transaction.service';

export class WalletInfra {
  public Transaction: TransactionService;
  public Wallet: WalletService;

  constructor() {
    this.Transaction = new TransactionService();
    this.Wallet = new WalletService();
  }
}
