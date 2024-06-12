export { WalletInfra } from './wallet-infra';

import logger from '@utils/logger';
import { WalletInfra } from './wallet-infra';

async function main() {
  logger.info('wallet-infra-sdk');

  try {
    const walletInfra = new WalletInfra();

    // const newTransaction = await walletInfra.Transaction.createTransaction({
    //   transactionType: 'signed',
    //   signedTx:
    //     '0x02f86e83aa36a74e843b9aca00851b0994dd9c825208949e4549638dc32f11c7726e26205705bcdc87e0566480c080a02480eb4fcd0cee32e13244567751da50daa2dbb4ae9c42e9d7a72c8368dd6975a02a5d7a08f04ff9e4ca45b33f1ed2af6f02c022778b1cdf127e049f94b8accd27',
    // });

    const newTransaction = await walletInfra.Transaction.createTransaction({
      transactionType: 'unsigned',
      from: '0x9E4549638dC32F11c7726e26205705bcDc87E056',
      to: '0xF9e3C81871dF06754AbFC054593762DB0bE48c89',
      value: '100',
      data: '0x',
      chainId: '11155111',
    });

    logger.debug('New Transaction:', newTransaction);

    const transactionId = newTransaction.transactionId;

    const tx = await walletInfra.Transaction.getTransactionById(transactionId);

    logger.debug('Transaction:', tx);
  } catch (error) {
    logger.error('Error');
  }
}

main();
