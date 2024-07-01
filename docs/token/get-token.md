### Get Token by Id and Chain

This section guides you through the process of retrieving a token by its ID and chainID using the WalletInfra.

```ts
import { WalletInfra } from './wallet-infra';

const walletInfra = new WalletInfra(appId, baseUrl);

const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const tokenId: string = '0x123';

const token: IToken = await walletInfra.Token.getTokenbById(chainId, tokenId);
```
