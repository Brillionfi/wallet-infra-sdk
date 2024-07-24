# Gas Configuration

This guide provides instructions for creating and retrieving gas configuration for a wallet on a specified chain using the Wallet Infra SDK.

## Create gas configuration

To create gas configuration for a wallet, use the `setGasConfig()` method:

```ts
import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models/common.models";
import { IWalletGasConfiguration } from "@brillionfi/wallet-infra-sdk/dist/models/wallet.models";

const walletAddress: Address = "your-wallet-address";
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const newGasConfiguration: IWalletGasConfiguration = {
  gasLimit: "1",
  maxFeePerGas: "1",
  maxPriorityFeePerGas: "1",
};

await walletInfra.Wallet.setGasConfig(walletAddress, chainId, newGasConfiguration);
```

## Get gas configuration

To retrieve gas configuration for a wallet, use the `getGasConfig()` method:

```ts
import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models/common.models";
import { IWalletGasConfiguration } from "@brillionfi/wallet-infra-sdk/dist/models/wallet.models";

const walletAddress: Address = "your-wallet-address";
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const gasConfiguration: IWalletGasConfiguration = await walletInfra.Wallet.getGasConfig(
  walletAddress,
  chainId
);
```

## IWalletGasConfiguration properties

The `IWalletGasConfiguration` interface represents the structure of a wallet gas configuration. Here's a breakdown of its properties:

### `gasLimit`

- **Type**: `string`
- **Description**: The gas limit for the wallet.

### `maxFeePerGas`

- **Type**: `string`
- **Description**: The maximum fee per gas unit for the wallet.

### `maxPriorityFeePerGas`

- **Type**: `string`
- **Description**: The maximum priority fee per gas unit for the wallet.
