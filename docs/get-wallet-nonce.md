### Get wallets

```ts
import { Address, ChainId } from '@models/common.models';

const wallet: Address = "0x123";
const chainId: ChainId = "1";

const nonce: number = await SDK.wallet.getWalletNonce(wallet, chainId);
```