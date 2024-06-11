### Get wallets

```ts
import { Address, ChainId, SUPPORTED_CHAINS } from '@models/common.models';
import { IWalletGasConfiguration } from '@models/wallet.models';

const wallet: Address = "0x123";
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const gasData: IWalletGasConfiguration = {
  gasLimit: "1",
  maxFeePerGas: "1",
  maxPriorityFeePerGas: "1"
};

const { status } = await SDK.wallet.setGasConfiguration(wallet, chainId, gasData);
```
Notes:

- `wallet`: The wallet address.
- `chainId`: The chain id number, use it from `SUPPORTED_CHAINS` model. Like `SUPPORTED_CHAINS.ETHEREUM`.