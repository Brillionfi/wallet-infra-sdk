# Authenticate User

The authentication process follows these steps:

1. Generate a login URL for the chosen authentication method
2. Redirect the user to the authentication provider
3. Receive and process the JWT token upon successful authentication

## 1. Generate authentication URL

Generate a login URL based on the authentication method you want to offer. The SDK supports various providers through the `AuthProvider` enum:

```js
import { AuthProvider } from "@brillionfi/wallet-infra-sdk";

const redirectUrl = "your-redirect-url";
const authUrl = walletInfra.generateAuthUrl(redirectUrl, AuthProvider.GOOGLE);
```

## 2. Redirect user to authentication provider

In your frontend application, redirect the user to the generated `authUrl`.

## 3. Authenticate user with JWT

After successful authentication, the user will be redirected to your specified `redirectUrl`. The authentication provider will include a JWT token in the URL parameters.

Use the received JWT to authenticate the user with the Wallet Infra SDK:

```js
walletInfra.authenticateUser(receivedJWT);
```
