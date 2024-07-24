# Create Transaction

This guide provides instructions for creating and publishing a signed or unsigned transaction to a specified network chain using the Wallet Infra SDK.

## Create signed transaction

To create a signed transaction, use the `createTransaction()` method and provide the `signedTx` parameter:

```ts
import {
  ITransaction,
  TransactionTypeKeys,
  ITransactionSigned
} from "@brillionfi/wallet-infra-sdk/dist/models/transaction.models";

const signedTransaction: ITransactionSigned = {
  transactionType: TransactionTypeKeys.SIGNED,
  signedTx: "your-signed-transaction-hash",
}
const newTransaction: ITransaction = await walletInfra.Transaction.createTransaction(signedTransaction);
```

> [!NOTE]
> Please refer to the [Transaction Interface](transaction-interface.md) guide for detailed information about the transaction properties.

## Create unsigned transaction

To create an unsigned transaction, use the `createTransaction()` method and provide the `from`, `to`, `value`, `data`, and `chainID` parameters:

```ts
import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models/common.models";
import {
  ITransaction,
  TransactionTypeKeys,
  ITransactionUnsigned
} from "@brillionfi/wallet-infra-sdk/dist/models/transaction.models";

const from: Address = "sender-wallet-address";
const to: Address = "receiver-wallet-address";
const value = "sending-amount";
const data = "transaction data";
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const unsignedTransaction: ITransactionUnsigned = {
  transactionType: TransactionTypeKeys.UNSIGNED,
  from: from,
  to: to,
  value: value,
  data: data,
  chainId: chainId,
};
const newTransaction: ITransaction = await walletInfra.Transaction.createTransaction(unsignedTransaction);
```

> [!NOTE]
> Please refer to the [Transaction Interface](transaction-interface.md) guide for detailed information about the transaction properties.
