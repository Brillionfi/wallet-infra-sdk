# Get Gas Fees

This guide provides instructions for estimating transaction costs using the Wallet Infra SDK.

To estimate the cost of a wallet transaction, use the `getGasFees()` method:

```ts
import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models/common.models";
import { IWalletGasEstimation } from "@brillionfi/wallet-infra-sdk/dist/models/wallet.models";

const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const from: Address = "sender-wallet-address";
const to: Address = "receiver-wallet-address";
const value = "sending-amount";
const data = "transaction data";
const gasFees: IWalletGasEstimation = await walletInfra.Wallet.getGasFees({
  chainId,
  from,
  to,
  value,
  data,
});
```

## IWalletGasEstimation properties

The `IWalletGasEstimation` interface represents the structure of a transaction gas estimation. Here's a breakdown of its properties:

### `gasLimit`

- **Type**: `string`
- **Description**: Gas limit.

### `gasFee`

- **Type**: `string`
- **Description**: Gas fee.

### `maxGasFee`

- **Type**: `string`
- **Description**: Max gas fee.

### `gasPrice`

- **Type**: `string`
- **Description**: Gas price.

### `maxFeePerGas`

- **Type**: `string`
- **Description**: Max fee per gas.

### `maxPriorityFeePerGas`

- **Type**: `string`
- **Description**: Max priority fee per gas.

### `totalCostString`

- **Type**: `string`
- **Description**: Total cost.

### `totalMaxCostString`

- **Type**: `string`
- **Description**: Total max cost.
