### Get all Tokens per Chain

This section guides you through the process of retrieving all tokens per chainID using the WalletInfra.

```ts
import { WalletInfra } from './wallet-infra';

const walletInfra = new WalletInfra();

const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;

const tokens: ITokens[] = await walletInfra.Token.getTokens(chainId);
```
