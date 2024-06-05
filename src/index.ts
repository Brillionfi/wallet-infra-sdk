import CreateWallet from '@api/endpoints/wallet';
import modules from './api';

class WalletInfraSDK {
  modules: modules;

  constructor(jwt: string) {
    const createWallet = new CreateWallet('/wallets', jwt);

    this.modules = {
      createWallet,
    };
  }
}

export default WalletInfraSDK;
