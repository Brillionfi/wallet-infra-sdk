### Create Unsigned Transaction

This section guides you through the process of creating a new unsigned transaction using the WalletInfra.

```ts
import {
  ITransactionUnsigned,
  TransactionTypeKeys,
} from '@models/transaction.models';
import { WalletInfra } from './wallet-infra';

const walletInfra = new WalletInfra(appId, baseUrl);

const myUnsignedTransaction: ITransactionUnsigned = {
  transactionType: TransactionTypeKeys.UNSIGNED,
  from: '{from_address_hash}',
  to: '{to_address_hash}',
  value: '100',
  data: '0x',
  chainId: '11155111',
};

const newTransaction = await walletInfra.Transaction.createTransaction(
  myUnsignedTransaction,
);
```
