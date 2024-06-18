import { SUPPORTED_CHAINS } from '@models/common.models';
import logger from '@utils/logger';
import { WalletInfra } from 'wallet-infra';

async function main() {
  try {
    // CREATE A NEW INSTANCE ON WALLET INFRA
    const walletInfra = new WalletInfra();

    // GET A WALLET
    const myWallets = await walletInfra.Wallet.getWallets();
    logger.debug(`My current wallets:`, myWallets);

    // Se Gas Configuration
    const gasConfiguration = await walletInfra.Wallet.setGasConfig(
      myWallets[0].address as string,
      SUPPORTED_CHAINS.ETHEREUM_SEPOLIA,
      {
        gasLimit: '21000',
        maxPriorityFeePerGas: '500000000',
        maxFeePerGas: '103093310316',
      },
    );

    logger.debug(`Gas Configuration:`, gasConfiguration);
  } catch (error) {
    logger.error('Failed');
  }
}

main();
