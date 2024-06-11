### Create wallet

This section guides you through the process of creating a new wallet using the WalletInfra.

```ts
import { IWallet, PasskeyAuthenticationSchema } from '@models/wallet.models';

const myWallet: IWallet = {
  walletType: 'eoa',
  walletName: 'testWallet',
  walletFormat: 'ethereum',
  authenticationType: PasskeyAuthenticationSchema,
};

await WalletInfra.Wallet.createWallet(myWallet);
```

Notes:

- `walletType`: The type of wallet. For example, "eoa" stands for Externally Owned Account.
- `walletName`: A user-friendly name for the wallet.
- `walletFormat`: The format or the blockchain for which the wallet is created, such as "ethereum".
- `authenticationType`: The schema used for authentication. This must conform to the PasskeyAuthenticationSchema.
