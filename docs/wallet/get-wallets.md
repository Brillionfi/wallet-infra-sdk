# Get Wallets

This guide provides instructions for retrieving all wallets registered for a user using the Wallet Infra SDK.

```ts
import { IWallet } from "@brillionfi/wallet-infra-sdk";

const wallets: IWallet[] = await walletInfra.Wallet.getWallets();
```

The `getWallets()` method returns a promise that resolves to an array of wallet objects. Please refer to the [Wallet Interface](wallet-interface.md) guide for detailed information about the wallet properties.
