# 📚 Wallet Infra SDK Documentation

Welcome to the documentation for Wallet Infra SDK! This guide will help you navigate our powerful toolkit for managing wallets, transactions, and assets within the Brillion ecosystem.

## 🚀 Installation

Install the Wallet Infra SDK into your project with a single command:

```shell
npm install @brillionfi/wallet-infra-sdk
```

## 🔑 Obtain your API key

Visit the Brillion Dashboard to set up your organization and create your first application. This process will give you a unique API key (`appId`).

## ⚡ Initialize the SDK

To start using the SDK, you need to initialize it with your API key:

```ts
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";

// Initialize the SDK
const appId = "your-app-id";
const baseUrl = "your-base-url";
const walletInfra = new WalletInfra(appId, baseUrl);
```

> [!NOTE]
> Make sure to replace `"your-app-id"` with the actual API key you obtained from the Brillion Dashboard.

## 🧩 Core Modules

The Wallet Infra SDK is organized into several modules, each handling specific functionalities:

### 🔐 Authentication

The **Authentication** module handles user creation and authentication:

- [Generate Authentication URL](authentication/authenticate.md#1-generate-authentication-url)
- [Authenticate User with JWT](authentication/authenticate.md#3-authenticate-user-with-jwt)

### 👛 Wallet

The **Wallet** module provides functionality for creating and managing wallets:

- [Wallet Interface](wallet/wallet-interface.md)
- [Create Wallet](wallet/create-wallet.md)
- [Get Wallets](wallet/get-wallets.md)
- [Wallet Recovery](wallet/wallet-recovery.md)
- [Get Wallet Portfolio](wallet/get-wallet-portfolio.md)
- [Get Transaction History](wallet/get-transaction-history.md)
- [Get Wallet Nonce](wallet/get-wallet-nonce.md)
- [Gas Configuration](wallet/gas-configuration.md)
- [Get Gas Fees](wallet/get-gas-fees.md)
- [Sign Transaction](wallet/sign-transaction.md)

### 🪙 Token

The **Token** module provides functionality for retrieving information about tokens on a network:

- [Token Interface](token/token-interface.md)
- [Get Tokens](token/get-tokens.md)

### 📜 Transaction

The **Transaction** module handles the management of wallet transactions, retrieving transaction details, and estimating gas costs:

- [Transaction Interface](transaction/transaction-interface.md)
- [Create Signed Transaction](transaction/create-transaction.md#create-signed-transaction)
- [Create Unsigned Transaction](transaction/create-transaction.md#create-unsigned-transaction)
- [Get Transaction](transaction/get-transaction.md)
- [Cancel Transaction](transaction/cancel-transaction.md)

## 👣 Next Steps

Now that you're familiar with the structure of the Wallet Infra SDK, you can dive deeper into each module based on your specific needs.

Check out our [Simple Wallet Demo](https://github.com/Brillionfi/simple-wallet-demo) to see the Wallet Infra SDK in action.

## 💬 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Brillionfi/wallet-infra-sdk/issues) or contact the Brillion support team.
