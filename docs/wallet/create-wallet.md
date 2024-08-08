# Create Wallet

This guide provides instructions for creating a new wallet using the Wallet Infra SDK.

To create a wallet for a user, use the `createWallet()` method:

```ts
import { IWallet } from "@brillionfi/wallet-infra-sdk";
import {
  WalletTypes,
  WalletFormats,
  PasskeyAuthenticationSchema
} from "@brillionfi/wallet-infra-sdk/dist/models/wallet.models";

const newWallet: IWallet = {
  walletType: WalletTypes.EOA,
  walletName: "MyFirstWallet",
  walletFormat: WalletFormats.ETHEREUM,
  authentication: PasskeyAuthenticationSchema,
};

await walletInfra.Wallet.createWallet(newWallet);
```

> [!NOTE]
> Please refer to the [Wallet Interface](wallet-interface.md) guide for detailed information about the wallet properties.
