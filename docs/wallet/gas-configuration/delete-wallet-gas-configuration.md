### Delete wallet gas configuration

```ts
import { Address, ChainId, SUPPORTED_CHAINS } from '@models/common.models';

const wallet: Address = "0x123";
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;

const { status } = await SDK.wallet.deleteGasConfiguration(wallet, chainId);
```
Notes:

- `wallet`: The wallet address.
- `chainId`: The chain id number, use it from `SUPPORTED_CHAINS` model. Like `SUPPORTED_CHAINS.ETHEREUM`.