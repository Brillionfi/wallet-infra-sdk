# 🛠️ Wallet Infra SDK

The Wallet Infra SDK provides tools and services for managing wallets, transactions, and assets within the Brillion ecosystem.

## 💡 Features

- 👛 **Wallet Management**: Create, recover, and manage wallets
- 💸 **Transaction Handling**: Create, sign, and cancel transactions
- 🔐 **Authentication**: Support for multiple authentication providers
- 🪙 **Token Management**: Retrieve and manage tokens across different chains
- ⛓️ **Multi-Chain Support**: Compatible with various blockchain networks
- ⛽ **Gas Fee Estimation**: Calculate and manage transaction gas fees
- 📊 **Portfolio Tracking**: Monitor wallet portfolios across chains
- 📜 **Transaction History**: Retrieve and analyze transaction history

## 🚀 Installation

Install the Wallet Infra SDK into your project with a single command:

```shell
npm install @brillionfi/wallet-infra-sdk
```

## ⚡ Quick Start

Get started with Wallet Infra SDK in a few steps:

### 1. Obtain your API key

Visit the Brillion Dashboard to set up your organization and create your first application. This process will give you a unique API key (`appId`).

### 2. Initialize the SDK

First, create a new instance of the Wallet Infra SDK:

```ts
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";

// Initialize the SDK
const appId = "your-app-id";
const baseUrl = "your-base-url";
const walletInfra = new WalletInfra(appId, baseUrl);
```

> [!NOTE]
> Make sure to replace `"your-app-id"` with the actual API key you obtained from the Brillion Dashboard.

### 3-1. Authenticate user with social login

Create or authenticate a user using your preferred provider:

```ts
import { AuthProvider } from "@brillionfi/wallet-infra-sdk";

// Generate authentication URL
const redirectUrl = "your-redirect-url";
const authUrl = walletInfra.generateAuthUrl(redirectUrl, AuthProvider.GOOGLE);

// Redirect user to authUrl for identity verification

// In your redirect endpoint, authenticate the user with the received JWT
walletInfra.authenticateUser(receivedJWT);
```
Valid AuthProvider value are: 
- GOOGLE
- DISCORD
- TWITTER
- APPLE

### 3-2. Authenticate user with Walletconnect

Create or authenticate a user using your preferred provider:

```ts
import { AuthProvider } from "@brillionfi/wallet-infra-sdk";

// Generate authentication URL
const redirectUrl = "your-redirect-url";
const walletConnectProjectId = "your-wallet-connect-project-id"
const uri = walletInfra.generateWalletConnectUri(walletConnectProjectId, redirectUrl);

// listen to onConnectWallet Event  and redirect user to authUrl when it triggered
walletInfra.onConnectWallet((authUrl: string)=>{})

//Show uri to user and ask to connect
// WalletConnectQRCodeModal.open(uri, ()=>{});

// In your redirect endpoint, authenticate the user with the received JWT
walletInfra.authenticateUser(receivedJWT);
```

### 4. Create a wallet

After authentication, create a new wallet for the user:

```ts
import { IWallet } from "@brillionfi/wallet-infra-sdk";
import {
  WalletTypes,
  WalletFormats,
  PasskeyAuthenticationSchema
} from "@brillionfi/wallet-infra-sdk/dist/models/wallet.models";

const newWallet: IWallet = {
  name: "MyFirstWallet",
  format: WalletFormats.ETHEREUM,
  signer: {
    authentication: PasskeyAuthenticationSchema,
  }
};

await walletInfra.Wallet.createWallet(newWallet);
```

## 📚 Documentation

Check out the [docs directory](docs/) for detailed information and examples on using the Wallet Infra SDK.

## 🌐 Demo

Check out our [Simple Wallet Demo](https://github.com/Brillionfi/simple-wallet-demo) to see the Wallet Infra SDK in action. This demo showcases how to manage your organization and applications and demonstrates how to access your application as a wallet user.

## 🤝 Contributing

We value community contributions and are eager to support your involvement. Here's how you can make a difference:

- 🚀 Use Wallet Infra SDK in your projects and share your experiences.
- 🐞 Found a bug? [Open an issue](https://github.com/Brillionfi/wallet-infra-sdk/issues). Better yet, submit a [pull request](https://github.com/Brillionfi/wallet-infra-sdk/pulls) with a fix!
- 💡 Have ideas for new features? We'd love to hear them.
- 📚 Help improve our [documentation](docs/) for a smoother developer experience.

### Committing

We use [Commitizen](https://github.com/commitizen/cz-cli) to handle versioning and ensure consistent and meaningful commit messages. Here's how to use it:

```shell
npx cz
```

Or, after installing Commitizen globally:

```shell
git cz
```

## 💬 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Brillionfi/wallet-infra-sdk/issues) or contact the Brillion support team.

## 📄 License

The Wallet Infra SDK is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
