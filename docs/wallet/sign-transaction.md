# Sign Transaction

This guide provides instructions for signing a transaction for a wallet using the Wallet Infra SDK.

To sign a transaction, use the `signTransaction()` method:

```ts
import { Address } from '@brillionfi/wallet-infra-sdk';
import {
  WalletTypes,
  WalletFormats,
  IWalletSignTransaction,
} from '@brillionfi/wallet-infra-sdk/dist/models/wallet.models';

const walletAddress: Address = 'your-wallet-address';
const data: IWalletSignTransaction = {
  walletType: WalletTypes.EOA,
  walletFormat: WalletFormats.ETHEREUM,
  unsignedTransaction: 'your-unsigned-transaction', // unsigned transaction (without "0x" prefix)
};
const origin = 'localhost'; // Replace with your application's domain
const { signedTransaction }: string = await walletInfra.Wallet.signTransaction(
  walletAddress,
  data,
  origin,
);

console.log(signedTransaction);
```

**result**

```bash
0x02f86e83aa36a751841079cf4f8502c6c6cc1b825208949e4549638dc32f11c7726e26205705bcdc87e0566480c080a0df7d9096984953982fda3b7ff8857ab44e61d88d6e657b1d23dddf29af0d9cb1a0653b105a7c669d0752a6ae3a99c2ae175d6438d4fbccd984acc7c77785d234f4
```
