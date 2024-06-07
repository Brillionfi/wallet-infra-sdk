### Create wallet

```ts
import { IWallet, PasskeyAuthenticationSchema } from '@models/wallet.models';

const data: IWallet = {
  walletType: "eoa",
  walletName: "testWallet",
  walletFormat: "ethereum",
  authenticationType: PasskeyAuthenticationSchema,
}

await SDK.wallet.createWallet(data);
```