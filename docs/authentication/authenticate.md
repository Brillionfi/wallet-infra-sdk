### Authenticate a user

The authentication pattern looks like this:

```ts
import { WalletInfra } from './wallet-infra';

const walletInfra = new WalletInfra(app_id);
const authUrl = walletInfra.generateAuthUrl();
// Move the user to the ...
await walletInfra.authenticateUser(code);
```
