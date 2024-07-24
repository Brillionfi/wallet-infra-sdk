# Get Wallets

This guide provides instructions for retrieving all wallets registered for a user using the Wallet Infra SDK.

To retrieve the wallets for a user, use the `getWallets()` method:

```ts
import { IWallet } from "@brillionfi/wallet-infra-sdk";

const wallets: IWallet[] = await walletInfra.Wallet.getWallets();
```

Please refer to the [Wallet Interface](wallet-interface.md) guide for detailed information about the wallet properties.
