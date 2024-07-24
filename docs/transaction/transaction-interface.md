# ITransaction Interface

The `ITransaction` interface represents the structure of a transaction. Here's a breakdown of its properties:

## Properties

### `transactionType` (optional)

- **Type**: `TransactionTypeKeys` (enum)
- **Description**: The type of the transaction that is required to publish. This is optional.
- **Possible Values**:
  - `TransactionTypeKeys.SIGNED`
  - `TransactionTypeKeys.UNSIGNED`

### `transactionId`

- **Type**: `string`
- **Description**: The unique identifier of the transaction.

### `transactionHash` (optional)

- **Type**: `string`
- **Description**: The hash of the transaction. This is optional.

### `signedTx` (optional)

- **Type**: `string`
- **Description**: The signed transaction data. This is optional.

### `from`

- **Type**: `string`
- **Description**: The sender address of the transaction.

### `to`

- **Type**: `string`
- **Description**: The receiver address of the transaction.

### `value`

- **Type**: `number`
- **Description**: The value of the transaction.

### `gasLimit`

- **Type**: `number`
- **Description**: The gas limit for the transaction.

### `maxFeePerGas`

- **Type**: `number`
- **Description**: The maximum fee per gas unit for the transaction.

### `maxPriorityFeePerGas`

- **Type**: `number`
- **Description**: The maximum priority fee per gas unit for the transaction.

### `nonce`

- **Type**: `number`
- **Description**: The nonce for the transaction.

### `data`

- **Type**: `string`
- **Description**: The data payload of the transaction.

### `chainId`

- **Type**: `SUPPORTED_CHAINS` (enum)
- **Description**: The chain ID on which the transaction is executed.
- **Possible Values**:
  - `SUPPORTED_CHAINS.ETHEREUM`
  - `SUPPORTED_CHAINS.POLYGON`
  - `SUPPORTED_CHAINS.SOLANA`
  - `SUPPORTED_CHAINS.COSMOS`
  - `SUPPORTED_CHAINS.TRON`

### `status`

- **Type**: `TransactionStatusKeys` (enum)
- **Description**: The status of publishing a transaction
- **Possible Values**:
  - `TransactionStatusKeys.QUEUED`
  - `TransactionStatusKeys.PENDING`
  - `TransactionStatusKeys.SUCCESS`
  - `TransactionStatusKeys.FAILED`
  - `TransactionStatusKeys.CANCELED`

### `createdAt`

- **Type**: `string`
- **Description**: The timestamp when the transaction was created.

### `updatedAt`

- **Type**: `string`
- **Description**: The timestamp when the transaction was last updated.

### `updatedBy`

- **Type**: `string`
- **Description**: The identifier of the entity that last updated the transaction.
