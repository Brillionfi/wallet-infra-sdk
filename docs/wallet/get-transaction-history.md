# Get Transaction History

This guide provides instructions for retrieving the transactions of a wallet on a specified chain using the Wallet Infra SDK.

To retrieve the transaction history for a wallet, use the `getTransactionHistory()` method:

```ts
import { Address, ChainId } from '@brillionfi/wallet-infra-sdk';
import { SUPPORTED_CHAINS } from '@brillionfi/wallet-infra-sdk/dist/models/common.models';
import { ITransaction } from '@brillionfi/wallet-infra-sdk/dist/models/transaction.models';

const walletAddress: Address = 'your-wallet-address';
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const transactionHistory: ITransaction[] =
  await walletInfra.Wallet.getTransactionHistory(walletAddress, chainId);

console.log(transactionHistory);
```

**result**

```bash
[
    {
      transactionType: "unsigned",
      transactionId: "92abc246-e1a2-404e-8971-33ec066affd0",
      transactionHash: "0x1bd18f9bed8953897cd4498312466cd1454a2427c3812537d0d5c65892460f40",
      from: "0x3539A4E8577A31BD02c756CAdB326D913e7b89fC",
      to: "0x684382741883E8af14e63853CeFBaDd4bb44E311",
      value: 1,
      gasLimit: 21000,
      maxFeePerGas: 103093310316,
      maxPriorityFeePerGas: 500000000,
      nonce: 0,
      data: "0x",
      chainId: "11155111",
      status: "success",
      authenticatedBy: "Admin",
      authenticationMethod: "API Keys",
      fingerprint: "sha256:1fd9b90b4c73e20bc6a825649662be6a346fb063696bd51a2731e80bc964f37d",
      organizationId: "2121b344-c8b4-471e-822e-ffd3068d89df"
    }
]
```

> [!NOTE]
> Please refer to the [Transaction Interface](../transaction/transaction-interface.md) guide for detailed information about the transaction properties.
