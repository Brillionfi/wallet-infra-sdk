# Get Transaction History

This guide provides instructions for retrieving the transactions of a wallet on a specified chain using the Wallet Infra SDK.

To retrieve the transaction history for a wallet, use the `getTransactionHistory()` method:

```ts
import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models/common.models";
import { ITransaction } from "@brillionfi/wallet-infra-sdk/dist/models/transaction.models";

const walletAddress: Address = "your-wallet-address";
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const transactionHistory: ITransaction[] = await walletInfra.Wallet.getTransactionHistory(walletAddress, chainId);
```

Please refer to the [Transaction Interface](../transaction/transaction-interface.md) guide for detailed information about the transaction properties.
