# IToken Interface

The `IToken` interface represents the structure of a network token. Here's a breakdown of its properties:

## Properties

### `chainId`

- **Type**: `SUPPORTED_CHAINS` (enum)
- **Description**: The chain ID on which the token is deployed.
- **Possible Values**:
  - `SUPPORTED_CHAINS.ETHEREUM`
  - `SUPPORTED_CHAINS.ETHEREUM_SEPOLIA`
  - `SUPPORTED_CHAINS.POLYGON`
  - `SUPPORTED_CHAINS.POLYGON_AMOY`
  - `SUPPORTED_CHAINS.TELOS`
  - `SUPPORTED_CHAINS.TELOS_TESTNET`
  - `SUPPORTED_CHAINS.ZILIQA2`
  - `SUPPORTED_CHAINS.ZILIQA2_TESTNET`
  - `SUPPORTED_CHAINS.VANAR`
  - `SUPPORTED_CHAINS.VANAR_VANGUARD`
  - `SUPPORTED_CHAINS.AVALANCHE`
  - `SUPPORTED_CHAINS.AVALANCHE_FUJI_TESTNET`
  - `SUPPORTED_CHAINS.ARBITRUM`
  - `SUPPORTED_CHAINS.ARBITRUM_TESTNET`
  - `SUPPORTED_CHAINS.SOLANA`
  - `SUPPORTED_CHAINS.SOLANA_TESTNET`
  - `SUPPORTED_CHAINS.COSMOS`
  - `SUPPORTED_CHAINS.TRON`
  - `SUPPORTED_CHAINS.TRON_TESTNET`

### `tokenId`

- **Type**: `string`
- **Description**: The unique identifier of the token.

### `status`

- **Type**: `TokenStatusKeys` (enum)
- **Description**: The status of the token.
- **Possible Values**:
  - `TokenStatusKeys.ACTIVE`
  - `TokenStatusKeys.INACTIVE`

### `name`

- **Type**: `string`
- **Description**: The name of the token.

### `address`

- **Type**: `string`
- **Description**: The address of the token contract.

### `type`

- **Type**: `TokenTypeKeys` (enum)
- **Description**: The type of the token.
- **Possible Values**:
  - `TokenTypeKeys.NATIVE`
  - `TokenTypeKeys.ERC20`
  - `TokenTypeKeys.ERC721`
  - `TokenTypeKeys.ERC1155`

### `logo`

- **Type**: `string`
- **Description**: The logo of the token.

### `decimals` (optional)

- **Type**: `string`
- **Description**: The number of decimals the token uses. This is optional.

### `symbol` (optional)

- **Type**: `string`
- **Description**: The symbol of the token. This is optional.

### `contractABI`

- **Type**: `string`
- **Description**: The ABI (Application Binary Interface) of the token contract.

### `createdAt`

- **Type**: `string`
- **Description**: The timestamp when the token was created.

### `updatedAt`

- **Type**: `string`
- **Description**: The timestamp when the token was last updated.

### `updatedBy`

- **Type**: `string`
- **Description**: The identifier of the entity that last updated the token.
