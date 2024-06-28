### Get gas fees

This is how to write a query for gas fees.

```ts
import type { Address, ChainId, SUPPORTED_CHAINS } from '@models/common.models';

const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const from: Address = '0x123';
const to: Address = '0x456';
const value = '0.001';
const data = '';

const gasFees = await WalletInfra.Wallet.getGasFees({
  chainId,
  from,
  to,
  value,
  data,
});
```
