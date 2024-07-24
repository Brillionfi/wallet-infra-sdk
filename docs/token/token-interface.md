# IToken Interface

The `IToken` interface represents the structure of a network token. Here's a breakdown of its properties:

## Properties

### `chainId`

- **Type**: `SUPPORTED_CHAINS` (enum)
- **Description**: The chain ID on which the token is deployed.
- **Possible Values**:
  - `SUPPORTED_CHAINS.ETHEREUM`
  - `SUPPORTED_CHAINS.POLYGON`
  - `SUPPORTED_CHAINS.SOLANA`
  - `SUPPORTED_CHAINS.COSMOS`
  - `SUPPORTED_CHAINS.TRON`

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
