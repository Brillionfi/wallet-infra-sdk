# Wallet Infra SDK Documentation

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

```js
import { WalletInfra } from "@brillionfi/wallet-infra-sdk";

// Initialize the SDK
const appId = "your-app-id";
const baseUrl = "your-base-url";
const walletInfra = new WalletInfra(appId, baseUrl);
```

## 🧩 Core Modules

The Wallet Infra SDK is organized into several modules, each handling specific functionalities:

### 🔐 Authentication

The **Authentication** module handles user creation and authentication:

- [Generate Authentication URL](authentication/authenticate.md#1-generate-authentication-url)
- [Authenticate User with JWT](authentication/authenticate.md#3-authenticate-user-with-jwt)

### 👛 Wallet

The **Wallet** module provides functionality for creating and managing wallets:

### 🪙 Token

The **Token** module provides functionality for retrieving information about tokens on a network:

### 📜 Transaction

The **Transaction** module handles the management of wallet transactions, retrieving transaction details, and estimating gas costs:

## 👣 Next Steps

Now that you're familiar with the structure of the Wallet Infra SDK, you can dive deeper into each module based on your specific needs.

Check out our [Simple Wallet Demo](https://github.com/Brillionfi/simple-wallet-demo) to see the Wallet Infra SDK in action.

## 💬 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Brillionfi/wallet-infra-sdk/issues) or contact the Brillion support team.
