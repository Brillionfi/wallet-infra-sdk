### Get wallet Portfolio

This section provides instructions on how to retrieve a wallet portfolio

```ts
import { IWallet } from '@models/wallet.models';

const walletsPortfolio: IWalletPortfolio =
  await WalletInfra.Wallet.getPortfolio();
```

Notes:

- `IWalletPortfolio`: This interface defines the structure of the wallet portfolio object.
- `SDK.Wallet.getPortfolio`: This method retrieves a wallet portfolio to a chosen correspondent chain.
