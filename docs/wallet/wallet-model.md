### IWallet Model

The IWallet model represents a wallet and includes various properties that define its characteristics. This document provides an in-depth explanation of the IWallet model.

1. `walletAddress`

   - Type: `string`
   - Description: The address of the wallet

2. `walletType`

   - Type: `WalletTypes`
   - Description: The type of the wallet (e.g., "WalletTypes.EOA" for Externally Owned Account).

3. `walletName`

   - Type: `string`
   - Description: The name of the wallet.

4. `walletFormat`

   - Type: `WalletFormats`
   - Description: The format of the wallet (e.g., "WalletFormats.ETHEREUM").

5. `walletOwner`

   - Type: `string`
   - Description: The owner of the wallet.

6. `authenticationType`

   - Type: `PasskeyAuthenticationSchema`
   - Description: The schema defining the authentication type for the wallet.
