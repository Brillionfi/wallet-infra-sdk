### Get wallet transaction history

```ts
import { IWalletTransaction } from '@models/wallet.models';
import { Address, ChainId, SUPPORTED_CHAINS } from '@models/common.models';

const wallet: Address = "0x123";
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;

const history: IWalletTransaction[] = await WalletInfra.Wallet.getTransactionHistory(wallet, chainId);
```

Notes:

- `IWalletTransaction`: This interface defines the structure of the transaction.
- `SDK.Wallet.getTransactionHistory`: This method retrieves all transactions associated with the current user/session. It returns a promise that resolves to an array of wallet transaction objects.
