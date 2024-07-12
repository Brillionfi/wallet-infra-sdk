### Wallet Recovery

This section provides instructions on how to recover eoa wallets in WalletInfra sdk.

```ts
import { WalletInfra } from 'wallet-infra';

const appId = 'f9e7f099-bd95-433b-9365-de8b73e72824';
const walletInfra = new WalletInfra(appId, baseUrl);

const initResponse = await sdk.Wallet.initRecovery();

// if another approval is not required (response.eoa.needsApproval), user should get bundle code via email
const response = await sdk.Wallet.execRecovery(initResponse.eoa.organizationId, initResponse.eoa.userId, ${newPasskeyName}, ${bundle});
```
