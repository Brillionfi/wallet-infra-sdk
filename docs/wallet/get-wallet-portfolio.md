# Get Wallet Portfolio

This guide provides instructions for retrieving the portfolio of a wallet on a specified chain using the Wallet Infra SDK.

```ts
import { Address, ChainId } from "@brillionfi/wallet-infra-sdk";
import { IWalletPortfolio } from "@brillionfi/wallet-infra-sdk/dist/models/wallet.models";
import { SUPPORTED_CHAINS } from "@brillionfi/wallet-infra-sdk/dist/models/common.models";

const walletAddress: Address = "your-wallet-address";
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const walletsPortfolio: IWalletPortfolio = await walletInfra.Wallet.getPortfolio(walletAddress, chainId);
```

## IWalletPortfolio properties

The `IWalletPortfolio` interface represents the structure of the wallet portfolio data. Here's a breakdown of its properties:

### `address`

- **Type**: `string`
- **Description**: The address of the wallet.

### `chainId`

- **Type**: `SUPPORTED_CHAINS` (enum)
- **Description**: The ID of the blockchain network.
- **Possible Values**:
  - `SUPPORTED_CHAINS.ETHEREUM`
  - `SUPPORTED_CHAINS.POLYGON`
  - `SUPPORTED_CHAINS.SOLANA`
  - `SUPPORTED_CHAINS.COSMOS`
  - `SUPPORTED_CHAINS.TRON`

### `portfolio`

- **Type**: `array[object]`
- **Description**: The wallet portfolio details.
- **Data**:
  - `tokenId`:
    - **Type**: `string`
    - **Description**: Token ID.
  - `balance`:
    - **Type**: `string`
    - **Description**: Token balance.
  - `decimals`:
    - **Type**: `number`
    - **Description**: Token decimals.
  - `address`:
    - **Type**: `string`
    - **Description**: Token address.
  - `tokenPriceUsd`:
    - **Type**: `string`
    - **Description**: Token balance in USD.
