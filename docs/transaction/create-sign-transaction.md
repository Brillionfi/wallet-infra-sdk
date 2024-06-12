### Create Unsigned Transaction

This section guides you through the process of creating a new singed transaction using the WalletInfra.

```ts
import {
  ITransactionSigned,
  TransactionTypeKeys,
} from '@models/transaction.models';
import { WalletInfra } from './wallet-infra';

const walletInfra = new WalletInfra();

const mySingedTransaction: ITransactionSigned = {
  transactionType: 'signed',
  signedTx: 'signed-transaction-hash',
};

const newTransaction =
  await walletInfra.Transaction.createTransaction(mySingedTransaction);
```
