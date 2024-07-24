# Get Wallet Nonce

This guide provides instructions for retrieving the nonce of a wallet on a specified chain using the Wallet Infra SDK.

To retrieve the nonce for a wallet, use the `getNonce()` method:

```ts
import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models/common.models";

const walletAddress: Address = "your-wallet-address";
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const nonce: number = walletInfra.Wallet.getNonce(walletAddress, chainId);
```
