### Authenticate a user

The authentication pattern looks like this:

1. First generate a login url depending on the method(s) you wish to offer
1. Once logged in, get the returned jwt on your endpoint to sign the user in.

```ts
import { WalletInfra } from './wallet-infra';

const app_id = 'f9e7f099-bd95-433b-9365-de8b73e72824';

const walletInfra = new WalletInfra(app_id);
const authUrl = walletInfra.generateAuthUrl(redirectUrl, AuthProvider.GOOGLE);
// The user can be redirected to `authUrl` and verify his identity.
```

Now in your redirect endpoint, you parse the answer to read the jwt and pass it to a WalletInfra instance:

```ts
import { WalletInfra } from './wallet-infra';

const walletInfra = new WalletInfra(app_id);
await walletInfra.authenticateUser(jwt);
```
