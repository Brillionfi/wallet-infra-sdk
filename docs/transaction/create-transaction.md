# Create Transaction

This guide provides instructions for creating and publishing a signed or unsigned transaction to a specified network chain using the Wallet Infra SDK.

## Create signed transaction

To create a signed transaction, use the `createTransaction()` method and provide the `signedTx` parameter:

```ts
import {
  ITransaction,
  TransactionTypeKeys,
  ITransactionSigned,
} from '@brillionfi/wallet-infra-sdk/dist/models/transaction.models';

const signedTransaction: ITransactionSigned = {
  transactionType: TransactionTypeKeys.SIGNED,
  signedTx: 'your-signed-transaction-hash',
};
const newTransaction: ITransaction =
  await walletInfra.Transaction.createTransaction(signedTransaction);

console.log(newTransaction);
```

```bash
{
    transactionType: "signed",
    transactionId: "3dc1b915-a76e-4a3c-b617-a93dd3d67d37",
    signedTx: "0x02f86e83aa36a780841dcd6500851800d7136c82520894684382741883e8af14e63853cefbadd4bb44e3110180c080a05437ab3891263c2585ecbc8aaa2324b5158bfbd7f1c184ebceca505f864f9562a053ea4c4a9e49c5911f2cbd99555fcb20e35b3d65a05bc028344c83f2a6915281",
    from: "0x0045905797E46A8E4Bd167836B79633278783CcE",
    to: "0x684382741883E8af14e63853CeFBaDd4bb44E311",
    value: 1,
    gasLimit: 21000,
    maxFeePerGas: 103093310316,
    maxPriorityFeePerGas: 500000000,
    nonce: 0,
    data: "0x",
    chainId: "11155111",
    status: "approved",
    authenticatedBy: "Admin",
    authenticationMethod: "API Keys",
    fingerprint: "sha256:068e893bc26b416c96ccd8d73355614bca0dd5b0959f2079c2d5b4d5387ff876",
    organizationId: "d1e21d9a-2f1c-4f0c-a092-ef4931ae04fa"
}
```

> [!NOTE]
> Please refer to the [Transaction Interface](transaction-interface.md) guide for detailed information about the transaction properties.

## Create unsigned transaction

To create an unsigned transaction, use the `createTransaction()` method and provide the `from`, `to`, `value`, `data`, and `chainID` parameters:

```ts
import { Address, ChainId } from '@brillionfi/wallet-infra-sdk';
import { SUPPORTED_CHAINS } from '@brillionfi/wallet-infra-sdk/dist/models/common.models';
import {
  ITransaction,
  TransactionTypeKeys,
  ITransactionUnsigned,
} from '@brillionfi/wallet-infra-sdk/dist/models/transaction.models';

const from: Address = 'sender-wallet-address';
const to: Address = 'receiver-wallet-address';
const value = 'sending-amount';
const data = 'transaction data';
const chainId: ChainId = SUPPORTED_CHAINS.ETHEREUM;
const unsignedTransaction: ITransactionUnsigned = {
  transactionType: TransactionTypeKeys.UNSIGNED,
  from: from,
  to: to,
  value: value,
  data: data,
  chainId: chainId,
};
const newTransaction: ITransaction =
  await walletInfra.Transaction.createTransaction(unsignedTransaction);

console.log(newTransaction);
```

```bash
{
    transactionType: "unsigned",
    transactionId: "3dc1b915-a76e-4a3c-b617-a93dd3d67d37",
    signedTx: "0x02f86e83aa36a780841dcd6500851800d7136c82520894684382741883e8af14e63853cefbadd4bb44e3110180c080a05437ab3891263c2585ecbc8aaa2324b5158bfbd7f1c184ebceca505f864f9562a053ea4c4a9e49c5911f2cbd99555fcb20e35b3d65a05bc028344c83f2a6915281",
    from: "0x0045905797E46A8E4Bd167836B79633278783CcE",
    to: "0x684382741883E8af14e63853CeFBaDd4bb44E311",
    value: 1,
    gasLimit: 21000,
    maxFeePerGas: 103093310316,
    maxPriorityFeePerGas: 500000000,
    nonce: 0,
    data: "0x",
    chainId: "11155111",
    status: "approved",
    authenticatedBy: "Admin",
    authenticationMethod: "API Keys",
    fingerprint: "sha256:068e893bc26b416c96ccd8d73355614bca0dd5b0959f2079c2d5b4d5387ff876",
    organizationId: "d1e21d9a-2f1c-4f0c-a092-ef4931ae04fa"
}
```

> [!NOTE]
> Please refer to the [Transaction Interface](transaction-interface.md) guide for detailed information about the transaction properties.
