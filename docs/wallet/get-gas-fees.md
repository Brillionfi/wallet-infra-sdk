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
- **Description**: The gas limit for the transaction.

### `gasFee`

- **Type**: `string`
- **Description**: The gas fee for the transaction.

### `maxGasFee`

- **Type**: `string`
- **Description**: The maximum gas fee for the transaction.

### `gasPrice`

- **Type**: `string`
- **Description**: The gas price for the transaction.

### `maxFeePerGas`

- **Type**: `string`
- **Description**: The maximum fee per gas unit for the transaction.

### `maxPriorityFeePerGas`

- **Type**: `string`
- **Description**: The maximum priority fee per gas unit for the transaction.

### `totalCostString`

- **Type**: `string`
- **Description**: The total gas cost for the transaction.

### `totalMaxCostString`

- **Type**: `string`
- **Description**: The total maximum gas cost for the transaction.
