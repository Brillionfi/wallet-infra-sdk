# Get Transaction

This guide provides instructions for retrieving the details of a transaction by its ID using the Wallet Infra SDK.

To retrieve the details of a transaction, use the `getTransaction()` method:

```ts
import { ITransaction } from "@brillionfi/wallet-infra-sdk/dist/models/transaction.models";

const transactionId = "your-transaction-id";
const transaction: ITransaction = await walletInfra.Transaction.getTransaction(transactionId);
```

> [!NOTE]
> Please refer to the [Transaction Interface](transaction-interface.md) guide for detailed information about the transaction properties.
