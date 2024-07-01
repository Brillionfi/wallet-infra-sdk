## Getting Started

To get started with the Wallet Infra SDK, follow the instructions below.

### Installation

To install the Wallet Infra SDK, run:

```sh
npm install @brillionfi/wallet-infra-sdk
```

### Initialization

To generate an SDK instance:

```ts
import { WalletInfra } from '@brillionfi/wallet-infra-sdk';

const SDK = await new WalletInfra(appId, baseURL);
```
