# Reject a multi-sign Transaction

This guide provides instructions for rejecting a multi-sign transaction using the Wallet Infra SDK.

To reject a multi transaction, use the `rejectSignTransaction()` method:

```ts
const transactionId = 'your-transaction-id';
const organizationId = 'your-organization-id';
const fingerPrint = 'fingerPrint'; // this fingerprint to obtained from signing the transaction
const origin = 'localhost'; // Replace with your application's domain
await walletInfra.Transaction.rejectSignTransaction(
  transactionId,
  organizationId,
  fingerPrint,
  origin,
);
```
