### Cancel a Transaction

This section guides you through the process of canceling an existing transaction using the WalletInfra.

Only an unpublished transaction can be canceled. Once your transaction has been published with a `pending` status, it can not be canceled

```ts
import {
  ITransactionCancel,
  TransactionTypeKeys,
} from '@models/transaction.models';
import { WalletInfra } from './wallet-infra';

const walletInfra = new WalletInfra(appId, baseUrl);
const transactionId: string = '46debf23-5e81-4d38-8100-c4f683c634d1';

await walletInfra.Transaction.cancelTransaction(transactionId);
```
