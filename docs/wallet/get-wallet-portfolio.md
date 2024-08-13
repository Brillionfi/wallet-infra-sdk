# Get Wallet Portfolio

This guide provides instructions for retrieving the portfolio of a wallet on a specified chain using the Wallet Infra SDK.

To retrieve the portfolio information of a wallet, use the `getPortfolio()` method:

```ts
import { Address, ChainId } from '@brillionfi/wallet-infra-sdk';
import { SUPPORTED_CHAINS } from '@brillionfi/wallet-infra-sdk/dist/models/common.models';
import { IWalletPortfolio } from '@brillionfi/wallet-infra-sdk/dist/models/wallet.models';

const walletAddress: Address = 'your-wallet-address';
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const walletsPortfolio: IWalletPortfolio =
  await walletInfra.Wallet.getPortfolio(walletAddress, chainId);

console.log(walletsPortfolio);
```

**result**

```bash
{
    address: "0x3539A4E8577A31BD02c756CAdB326D913e7b89fC",
    chainId: "11155111",
    portfolio: [
        {
            tokenId: "ETH",
            balance: "99947881092228999",
            decimals: 18,
            tokenPriceUsd: "2637.127448351062"
        }
    ]
}
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
    - **Description**: The unique identifier of the token.
  - `balance`:
    - **Type**: `string`
    - **Description**: The balance of the token.
  - `decimals` (optional):
    - **Type**: `number`
    - **Description**: The number of decimals the token uses. This is optional.
  - `address` (optional):
    - **Type**: `string`
    - **Description**: The address of the token contract. This is optional.
  - `tokenPriceUsd` (optional):
    - **Type**: `string`
    - **Description**: The balance of the token in USD.
