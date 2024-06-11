### Create wallet

This section guides you through the process of creating a new wallet using the WalletInfra.

```ts
import { 
  IWallet, 
  PasskeyAuthenticationSchema, 
  WalletTypes, 
  WalletFormats 
} from '@models/wallet.models';

const myWallet: IWallet = {
  walletType: WalletTypes.EOA,
  walletName: 'testWallet',
  walletFormat: WalletFormats.ETHEREUM,
  authenticationType: PasskeyAuthenticationSchema,
};

await WalletInfra.Wallet.createWallet(myWallet);
```

Notes:

- `walletType`: The type of wallet, use it from `WalletTypes` model. For example, `WalletTypes.EOA` which stands for Externally Owned Account.
- `walletName`: A user-friendly name for the wallet.
- `walletFormat`: The wallet format for certain blockchains types which the wallet is created, use it from `WalletFormats` model. Like `WalletFormats.ETHEREUM`.
- `authenticationType`: The schema used for authentication. This must conform to the PasskeyAuthenticationSchema.
