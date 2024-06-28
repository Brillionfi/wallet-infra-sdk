import { TokenService } from './services/token.service';
import { TransactionService } from './services/transaction.service';
import { WalletService } from './services/wallet.service';
import { AuthProvider } from './models/auth.models';
import {
  ITransactionSigned,
  ITransactionUnsigned,
  ITransaction,
} from './models/transaction.models';
import {
  IWallet,
  IWalletTransaction,
  IWalletGasConfiguration,
} from './models/wallet.models';
import { ChainId, Address } from './models/common.models';
import { IToken } from './models/token.model';

declare module '@brillionfi/wallet-infra-sdk' {
  export class WalletInfra {
    public Transaction: TransactionService;
    public Wallet: WalletService;
    public Token: TokenService;

    constructor(appId: string);

    public generateAuthUrl(redirectUrl: string, provider: AuthProvider): string;
    public authenticateUser(jwt: string): void;
  }

  export {
    TransactionService,
    WalletService,
    TokenService,
    AuthProvider,
    ITransactionSigned,
    ITransactionUnsigned,
    ITransaction,
    IWallet,
    IWalletTransaction,
    ChainId,
    Address,
    IWalletGasConfiguration,
    IToken,
  };
}
