# Sign Transaction

This guide provides instructions for signing a transaction for a wallet using the Wallet Infra SDK.

To sign a transaction, use the `signTransaction()` method:

```ts
import { Address } from "@brillionfi/wallet-infra-sdk";
import {
  WalletTypes,
  WalletFormats,
  IWalletSignTransaction
} from "@brillionfi/wallet-infra-sdk/dist/models/wallet.models";

const walletAddress: Address = "your-wallet-address";
const data: IWalletSignTransaction = {
  walletType: WalletTypes.EOA,
  walletFormat: WalletFormats.ETHEREUM,
  unsignedTransaction: "your-unsigned-transaction", // unsigned transaction (without "0x" prefix)
};
const origin = "localhost"; // Replace with your application's domain
const { signedTransaction }: string = await walletInfra.Wallet.signTransaction(
  walletAddress,
  data,
  origin
);
```
