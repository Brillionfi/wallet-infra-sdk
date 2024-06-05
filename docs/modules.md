## Wallet module

Wallet management module for you to interact with your wallet. Simple, fast and easy.

### Actions:

#### Create wallet

Data:

```ts
const data: TCreateWalletBody = {
  walletType: {
    eoa?: {
      walletName: string;
      walletFormat: validAddressFormats,
      authenticationType: AuthenticationTypeSchema
    }
  }
}
```

Request:

```ts
await SDK.wallet.createWallet(data);
```

Response:

```ts
eoa: {
  walletName: string;
  walletFormat: string;
  walletType: string;
  walletAddress: string;
};
```

#### Get wallets

Request:

```ts
await SDK.wallet.getWallets();
```

Response:

```ts
body: {
  type: string;
  name: string;
  format: string;
  owner: string;
  address: string;
}[]
```

