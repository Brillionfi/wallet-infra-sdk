### Authenticate a user

The authentication pattern looks like this:

1. First generate a login url depending on the method(s) you wish to offer
1. Once logged in, get the returned jwt on your endpoint to sign the user in.

```ts
import { WalletInfra } from './wallet-infra';

const walletInfra = new WalletInfra(app_id);
const authUrl = walletInfra.generateAuthUrl(redirectUrl, credentialsProvider);
// The user can be redirected to `authUrl` and verify his identity.
```

Now in your redirect endpoint, you parse the answer to read the jwt and pass it to a WalletInfra instance:

```ts
import { WalletInfra } from './wallet-infra';

const walletInfra = new WalletInfra(app_id);
await walletInfra.authenticateUser(jwt);
```
