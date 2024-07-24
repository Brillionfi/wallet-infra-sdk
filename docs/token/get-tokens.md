### Get Tokens

This guide provides instructions for retrieving all the tokens supported on a specified network using the Wallet Infra SDK.

To retrieve the supported tokens, use the `getTokens()` method:

```ts
import { ChainId } from "@brillionfi/wallet-infra-sdk";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models/common.models";
import { IToken } from "@brillionfi/wallet-infra-sdk/dist/models/token.model";

const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const tokens: IToken[] = await walletInfra.Token.getTokens(chainId);
```

Please refer to the [Token Interface](token-interface.md) guide for detailed information about the token properties.
