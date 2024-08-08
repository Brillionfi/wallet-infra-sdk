# IWallet Interface

The `IWallet` interface represents the structure of a wallet. Here's a breakdown of its properties:

## Properties

### `walletAddress`

- **Type**: `string`
- **Description**: The address of the wallet.

### `walletType`

- **Type**: `WalletTypes` (enum)
- **Description**: The type of the wallet.
- **Possible Values**:
  - `WalletTypes.EOA`

### `walletName`

- **Type**: `string`
- **Description**: The name of the wallet.

### `walletFormat`

- **Type**: `WalletFormats` (enum)
- **Description**: The format of the wallet.
- **Possible Values**:
  - `WalletTypes.ETHEREUM`
  - `WalletTypes.SOLANA`
  - `WalletTypes.COSMOS`
  - `WalletTypes.TRON`

### `walletOwner`

- **Type**: `string`
- **Description**: The owner of the wallet.

### `authentication`

- **Type**: `PasskeyAuthenticationSchema`
- **Description**: The schema defining the authentication type for the wallet.
