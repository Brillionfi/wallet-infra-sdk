// export { WalletInfra } from './wallet-infra';
// export { TokenService } from './services/token.service';
// export { TransactionService } from './services/transaction.service';
// export { WalletService } from './services/wallet.service';
// export { AuthProvider } from './models/auth.models';
// export {
//   ITransactionSigned,
//   ITransactionUnsigned,
//   ITransaction,
// } from './models/transaction.models';
// export {
//   IWallet,
//   IWalletTransaction,
//   IWalletGasConfiguration,
// } from './models/wallet.models';
// export { ChainId, Address } from './models/common.models';
// export { IToken } from './models/token.model';

import { ChainId } from '@models/common.models';
import { WalletInfra } from 'wallet-infra';

async function main() {
  const appId = 'your-app-id';
  const baseURL = 'http://localhost:3000/dev';
  const jwt =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik1GcXVya0dHVi1sVDNmYmdKeTZ1RGpROGI0bDFDc1NNaWluT0d2QjBENkUiLCJ0eXAiOiJqd3QifQ.eyJvcmdJZCI6ImQ2ODY3MThhLThiNDUtNDRjYy1hY2UyLWViMTJiZGUwMzU0YiIsInVzZXJOYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInBpY3R1cmUiOiJwaWN0dXJlIiwiZmlyc3ROYW1lIjoiZ2l2ZW4gbmFtZSIsImxhc3ROYW1lIjoiZmFtaWx5IG5hbWUiLCJhcHBJZCI6ImRhMzllN2YzLTkyNDMtNGUyOC1iM2FkLTQ0NzExNWM1ZDU2NyIsInJvbGUiOiJXQUxMRVRfVVNFUiIsInNlc3Npb25JZCI6IjBlZDhkNWRlLTQ2NDAtNGIyZC1iYTQ5LTU1YmJjZTU0ODEwYiIsIm9BdXRoUHJvdmlkZXIiOiJTYW5kYm94IiwiaWF0IjoxNzIyODU1MjIzLCJuYmYiOjE3MjI4NTUyMjMsImlzcyI6Imh0dHBzOi8vYXBwLmJyaWxsaW9uLmZpbmFuY2UiLCJleHAiOjE3MjI4NTg4MjN9.uK0eJERw7z5qR9trYtwsPJcH9M8OZSZonjn7qsTNPrs97MIDlcAQRRgctakIn-k5EaHawjEcQOP7O73wk9WiQsrDnw8nC1AJJMbsyMb0SVOYt89paB_3EStbyXvrYsHjohQDHXMnwwILLD9BYCC33pWmbzDHJCoXEZ54S25k6sbla-Fn3fX3uNCYyK5HSzpK_yVlPCgNmAZcoLERhij7MNMAtOkQ4-UHb6E7IfMEm990ggMQQzPw4nFEToDmPceIYZpwScU-fUquVvwbxANZtjooRN5a5zzU3p6-q5sAn9I733jrJ72l-UPyfNh7DBY8cfwAZeQbrpno1rONEG3Arw';

  try {
    const walletInfra = new WalletInfra(appId, baseURL);
    walletInfra.authenticateUser(jwt);

    const wallets = await walletInfra.Wallet.getWallets();
    //eslint-disable-next-line
    console.log('Wallets:', wallets);

    const accessToken = await walletInfra.Kyc.generateAccessToken(
      '0x2Caa81eE4C33D3284C817beAd132E542f590c7F1',
      '1' as ChainId,
    );
    //eslint-disable-next-line
    console.log('Access Token:', accessToken);
  } catch (error) {
    //eslint-disable-next-line
    console.log('An error occurred:', error);
  }
}

// Call the main function
main();
