# Wallet Recovery

This guide outlines the process for recovering a wallet using the Wallet Infra SDK. The recovery process consists of two main steps: `initiation` and `execution`.

## 1. Initiate wallet recovery

To begin the wallet recovery process, use the `initRecovery()` method:

```ts
import { IWalletRecovery } from "@brillionfi/wallet-infra-sdk/dist/models/wallet.models";

const initResponse: IWalletRecovery = await walletInfra.Wallet.initRecovery();
```

## 2. Execute wallet recovery

After initiation, execute the recovery process using the `execRecovery()` method:

```ts
import { IWalletRecovery } from "@brillionfi/wallet-infra-sdk/dist/models/wallet.models";

const origin = "localhost"; // Replace with your application's domain
const execResponse: IWalletRecovery = await walletInfra.Wallet.execRecovery(
  initResponse.eoa.organizationId,
  initResponse.eoa.userId,
  newPasskeyName,
  bundle,
  origin
);
```

> If `initResponse.eoa.needsApproval` is false, the user should receive a `bundle` code via email. This code is required for the `execRecovery()` method.

## IWalletRecovery properties

The `IWalletRecovery` interface represents the structure of the recovery details. Here's a breakdown of its properties:

### `eoa`

- **Type**: `object`
- **Description**: The recovery details for an `EOA` wallet.
- **Data**:
  - `organizationId`:
    - **Type**: `string`
  - `userId`:
    - **Type**: `string`
  - `needsApproval`:
    - **Type**: `boolean`
  - `fingerprint`:
    - **Type**: `string`
  - `activityId`:
    - **Type**: `string`
