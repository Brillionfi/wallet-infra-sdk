### Cancel a Transaction

This guide provides instructions for canceling an unpublished transaction using the Wallet Infra SDK.

To cancel an unpublished transaction, use the `cancelTransaction()` method:

```ts
const transactionId = "your-transaction-id";
await walletInfra.Transaction.cancelTransaction(transactionId);
```

> [!NOTE]
> Only unpublished transactions can be canceled. Once a transaction has been published and has a `pending` status, it cannot be canceled.
