# Get Notifications

This guide provides instructions for retrieving all the notifications for a given wallet

To retrieve them, use the `getNotifications` method:

```ts
import {
  ChainId,
  SUPPORTED_CHAINS,
  TNotifications,
} from '@brillionfi/wallet-infra-sdk';

const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const tokens: TNotifications = await walletInfra.Notifications.getNotifications(
  address,
  chainId,
);
```
