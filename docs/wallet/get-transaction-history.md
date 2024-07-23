### Get Transaction History

This guide provides instructions for retrieving the transactions of a wallet on a specified chain using the Wallet Infra SDK.

```ts
import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { ITransaction } from "@brillionfi/wallet-infra-sdk/dist/models/transaction.models";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models/common.models";

const walletAddress: Address = "your-wallet-address";
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const transactionHistory: ITransaction[] = await WalletInfra.Wallet.getTransactionHistory(walletAddress, chainId);
```

Please refer to the [Transaction Interface](../transaction/transaction-interface.md) guide for detailed information about the transaction properties.
