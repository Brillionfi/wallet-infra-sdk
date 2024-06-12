### Get Transaction

This section guides you through the process of retrieving a transaction by its ID using the WalletInfra.

```ts
import { WalletInfra } from './wallet-infra';

const walletInfra = new WalletInfra();

const transactionId = '123-123-123';
const transaction = await walletInfra.Transaction.getTransaction(transactionId);
```
