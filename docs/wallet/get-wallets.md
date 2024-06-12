### Get wallets

This section provides instructions on how to retrieve a list of wallets using the WalletInfra SDK.

```ts
import { IWallet } from '@models/wallet.models';

const wallets: IWallet[] = await WalletInfra.Wallet.getWallets();
```

Notes:

- `IWallet`: This interface defines the structure of the wallet object.
- `SDK.Wallet.getWallets`: This method retrieves all wallets associated with the current user/session. It returns a promise that resolves to an array of wallet objects.
