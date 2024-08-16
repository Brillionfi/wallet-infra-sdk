# Create KYC session

This guide provides instructions for creating a kyc session using the Wallet Infra SDK. The KYC session is per wallet address, leveraging NexeraId service.

To create a kyc session, use the `createKycSession()` method, which respond with an accessToken that could be used to initiate a verification flow session:

```ts
import { ChainId } from '@brillionfi/wallet-infra-sdk';
import { SUPPORTED_CHAINS } from '@brillionfi/wallet-infra-sdk/dist/models/common.models';

const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const walletAddress: Address = 'your-wallet-address';

const accessToken: string = await walletInfra.Kyc.createKycSession(
  walletAddress,
  chainId,
);
```

> [!NOTE]
> Please refer to the [NexeraId sdk](https://docs.nexera.id/developing/identitysdk) documentation to start the verification flow on your application. Following Nexera Documentation, you can get the accessToken using the `createKycSession()` function.
