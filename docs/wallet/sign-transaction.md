### Sign Transaction

This section guides you through the process of Signing a transaction.

```ts
import { 
  IWalletSignTransaction, 
  WalletTypes, 
  WalletFormats 
} from '@models/wallet.models';
import { Address } from '@models/common.models';

const wallet: Address = "0x123";

const data: IWalletSignTransaction = {
  walletType: WalletTypes.EOA,
  walletFormat: WalletFormats.ETHEREUM,
  unsignedTransaction: "01234",
};

const { signedTransaction } = await WalletInfra.Wallet.signTransaction(wallet, data);
```

Notes:

- `walletType`: The type of wallet, use it from `WalletTypes` model. For example, `WalletTypes.EOA` which stands for Externally Owned Account.
- `walletFormat`: The wallet format for certain blockchains types which the wallet is created, use it from `WalletFormats` model. Like `WalletFormats.ETHEREUM`.
- `unsignedTransaction`: A non 0x String representing an unsigned transaction.
