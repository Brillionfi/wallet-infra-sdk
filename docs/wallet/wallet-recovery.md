### Wallet Recovery

This section provides instructions on how to recover eoa wallets in WalletInfra sdk.
In order to recover the wallet, the Wallet recover service requires a targerPublicKey. You can generate the key using turnkey IframeStamper, or utilise the generateTargetPublicKey function.

you can learn more about the @turnkey/iFrameStamper here: https://www.npmjs.com/package/@turnkey/iframe-stamper. This feature requires a browser window.

```ts
import logger from '@utils/logger';
import { WalletInfra } from 'wallet-infra';

const appId = 'f9e7f099-bd95-433b-9365-de8b73e72824';
const walletInfra = new WalletInfra(appId, baseUrl);

const iframeUrl = 'Turnkey Iframe url';
const iframeContainer = document.getElementById('turnkey-iframe-container');
const iframeElementId = 'turnkey-iframe';

const targetPublicKey = await walletInfra.Wallet.generateTargetPublicKey(
  iframeUrl,
  iframeContainer,
  iframeElementId,
);

await walletInfra.Wallet.recover(targetPublicKey);
```
