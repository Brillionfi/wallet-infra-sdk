# Create Wallet

This guide provides instructions for creating a new wallet using the Wallet Infra SDK.

To create a wallet for a user, use the `createWallet()` method:

```ts
import { IWallet } from '@brillionfi/wallet-infra-sdk';
import {
  WalletTypes,
  WalletFormats,
  PasskeyAuthenticationSchema,
} from '@brillionfi/wallet-infra-sdk/dist/models/wallet.models';

const newWallet: IWallet = {
  type: WalletTypes.EOA,
  name: 'MyFirstWallet',
  format: WalletFormats.ETHEREUM,
  authentication: PasskeyAuthenticationSchema,
};

const createdWallet = await walletInfra.Wallet.createWallet(newWallet);
console.log(createdWallet);
```

**result**

```bash
{
    type: "EOA",
    name: "MyFirstWallet"
    format: "ethereum",
    address: "0xEfe58A9CcF0E378C5D136e6b7276eA3d5BEa1e30",
}
```

> [!NOTE]
> Please refer to the [Wallet Interface](wallet-interface.md) guide for detailed information about the wallet properties.
