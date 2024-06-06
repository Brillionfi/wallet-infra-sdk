### Create wallet

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

```ts
await SDK.wallet.createWallet(data);
```