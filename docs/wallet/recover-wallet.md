# Recover Wallet

This guide provides instructions to initiate the process for recovering access to a wallet using the Wallet Infra SDK.

```ts
import { IWalletRecovery } from "@brillionfi/wallet-infra-sdk/dist/models/wallet.models";

const targetPublicKey = "your-wallet-public-key";
const recoveryDetails: IWalletRecovery = await walletInfra.Wallet.recover(targetPublicKey);
```

## IWalletRecovery properties

The `IWalletRecovery` interface represents the structure of the recovery details. Here's a breakdown of its properties:

### `eoa`

- **Type**: `object`
- **Description**: The recovery details for an `EOA` wallet.
- **Data**:
  - `organizationId`:
    - **Type**: `string`
    - **Description**:
  - `userId`:
    - **Type**: `string`
    - **Description**:
  - `needsApproval`:
    - **Type**: `boolean`
    - **Description**:
  - `fingerprint`:
    - **Type**: `string`
    - **Description**:
  - `activityId`:
    - **Type**: `string`
    - **Description**:
