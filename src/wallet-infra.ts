import { WalletService } from '@services/wallet.service';
import { TransactionService } from '@services/transaction.service';
import { KycService } from '@services/kyc.service';
import { HttpClient } from './utils';
import { Config } from './config';
import { AuthProvider, AuthProviderSchema } from '@models/auth.models';
import { TokenService } from '@services/token.service';
import { NotificationsService } from '@services/notifications.service';
import Client, { SignClient } from '@walletconnect/sign-client';
import crypto from 'crypto';
import { SimpleEventEmitter } from '@utils/simpleEvent';

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
  public generateAuthUrl(redirectUrl: string, provider: AuthProvider): string {
    const parsedProvider = AuthProviderSchema.parse(provider);
    return `${this.baseURL}/users/login?provider=${parsedProvider}&loginType=WALLET_USER&redirectUrl=${redirectUrl}&appId=${this.appId}`;
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
    metadata?: { name: string; description: string; url: string; icons: [] },
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
