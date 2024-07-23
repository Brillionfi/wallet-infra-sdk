# Get Wallet Portfolio

This guide provides instructions for retrieving the portfolio of a wallet on a specified chain using the Wallet Infra SDK.

```ts
import { ChainId } from "@brillionfi/wallet-infra-sdk";
import { IWalletPortfolio } from "@brillionfi/wallet-infra-sdk/models";

const walletAddress = "your-wallet-address";
const walletsPortfolio: IWalletPortfolio = await walletInfra.Wallet.getPortfolio(walletAddress, ChainId.ETHEREUM);
```

## IWalletPortfolio interface

The `IWalletPortfolio` interface represents the structure of the wallet portfolio data. Here's a breakdown of its properties:

### `address`

- **Type**: `string`
- **Description**: The address of the wallet.

### `chainId`

- **Type**: `ChainID` (enum)
- **Description**: The ID of the blockchain network.
- **Possible Values**:
  - `ChainID.ETHEREUM`
  - `ChainID.POLYGON`
  - `ChainID.SOLANA`
  - `ChainID.COSMOS`
  - `ChainID.TRON`

### `portfolio`

- **Type**: `array`
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
