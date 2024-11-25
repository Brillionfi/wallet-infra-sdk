import { WalletService } from '@services/wallet.service';
import { TransactionService } from '@services/transaction.service';
import { KycService } from '@services/kyc.service';
import { HttpClient } from './utils';
import { Config } from './config';
import { AuthProvider, IAuthURLParams } from '@models/auth.models';
import { TokenService } from '@services/token.service';
import { NotificationsService } from '@services/notifications.service';
import Client, { SignClient } from '@walletconnect/sign-client';
import crypto from 'crypto';
import { SimpleEventEmitter } from '@utils/simpleEvent';
import MetaMaskSDK from '@metamask/sdk';
import logger from 'loglevel';

export class WalletInfra {
  public Notifications: NotificationsService;
  public Transaction: TransactionService;
  public Wallet: WalletService;
  public Token: TokenService;
  public Kyc: KycService;
  private appId: string;
  private httpClient: HttpClient;
  private config: Config;
  private event: SimpleEventEmitter;
  private client: Client | undefined;

  constructor(
    appId: string,
    private baseURL: string,
  ) {
    this.appId = appId;
    this.config = new Config();
    this.httpClient = new HttpClient(baseURL);
    this.Notifications = new NotificationsService(this.httpClient);
    this.Transaction = new TransactionService(this.httpClient);
    this.Token = new TokenService(this.httpClient);
    this.Wallet = new WalletService(this.httpClient);
    this.Kyc = new KycService(this.httpClient);
    this.event = new SimpleEventEmitter();
  }

  public onConnectWallet(listener: (authUrl: unknown) => void): void {
    this.event.on('onWalletConnect', listener);
  }

  public async generateAuthUrl(params: IAuthURLParams): Promise<string> {
    if (params.provider === AuthProvider.METAMASK) {
      params.signedMessage =
        await this.promptMetamaskAccountAndGetSignedMessage();
    }
    const query = new URLSearchParams({
      ...params,
      loginType: 'WALLET_USER',
      appId: this.appId,
    });
    return `${this.baseURL}/users/login?${query.toString()}`;
  }

  private async promptMetamaskAccountAndGetSignedMessage() {
    const sdk = new MetaMaskSDK();
    try {
      const ethereum = sdk.getProvider();
      if (ethereum === undefined) {
        throw new Error('Couldnt get Metamask');
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (!Array.isArray(accounts)) {
        throw new Error('No account available');
      }
      const signedMessage = await ethereum.request({
        method: 'personal_sign',
        params: ['Brillionfi', accounts[0]],
      });
      if (typeof signedMessage !== 'string') {
        throw new Error('Not a string');
      }
      return signedMessage;
    } catch (error) {
      logger.error('Message signing failed:', error);
    }
  }

  //eslint-disable-next-line
  private async walletConnectCallback(redirectUrl: string, session: any) {
    const sessionId = crypto.randomBytes(16).toString('hex');
    const message = `Login to Brillion Wallet via Your account, session ID: ${sessionId}`;
    const address = session.namespaces.eip155.accounts[0].split(':')[2];
    if (this.client) {
      const signedMessage = await this.client.request({
        topic: session.topic,
        chainId: 'eip155:1',
        request: {
          method: 'personal_sign',
          params: [message, address],
        },
      });
      const authUrl =
        `${this.baseURL}/users/login?` +
        'provider=WalletConnect&' +
        'loginType=WALLET_USER&' +
        `redirectUrl=${redirectUrl}&` +
        `appId=${this.appId}&` +
        `signedMessage=${signedMessage}&` +
        `sessionId=${sessionId}`;
      this.event.emit('onWalletConnect', authUrl);
    }
  }
  public async generateWalletConnectUri(
    wcProjectId: string,
    redirectUrl: string,
    metadata?: {
      name: string;
      description: string;
      url: string;
      icons: string[];
    },
  ): Promise<string | undefined> {
    this.client = await SignClient.init({
      relayUrl: 'wss://relay.walletconnect.com',
      projectId: wcProjectId,
      metadata: metadata ?? {
        name: 'Brillion',
        description: 'Brillion Wallet',
        url: 'https://brillion.finance',
        icons: [''], // TODO add brillion icon
      },
    });
    const { uri, approval } = await this.client.connect({
      requiredNamespaces: {
        eip155: {
          methods: ['personal_sign'],
          chains: ['eip155:1'],
          events: ['connect', 'disconnect'],
        },
      },
    });
    approval().then(this.walletConnectCallback.bind(this, redirectUrl));
    return uri;
  }

  public authenticateUser(jwt: string) {
    this.httpClient.authorize(jwt);
  }
}
