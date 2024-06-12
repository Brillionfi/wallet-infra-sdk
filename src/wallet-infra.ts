import { HttpClient } from '@utils/http-client';
import { WalletService } from '@services/wallet.service';
import { Config, ConfigKeys } from './config';
import { TransactionService } from '@services/transaction.service';

const jwt =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik1GcXVya0dHVi1sVDNmYmdKeTZ1RGpROGI0bDFDc1NNaWluT0d2QjBENkUiLCJ0eXAiOiJqd3QifQ.eyJvcmdJZCI6IjRmMTBlZTM5LTMxMDgtNDA4Yy04ZjdjLTRjZWYwODMwZTNkNiIsInVzZXJOYW1lIjoia2hhbGVka2FkZGFsIiwiZW1haWwiOiJraGFsZWRrYWRkYWxAZ21haWwuY29tIiwib0F1dGhQcm92aWRlciI6Ikdvb2dsZSIsImFwcElkIjoiY2NjYTk3MzktNTdjZS00MWUyLWI4NGYtZDhjNmUzMDlkM2VhIiwicm9sZSI6IldBTExFVF9VU0VSIiwic2Vzc2lvbklkIjoiMzA5NWQzODAtNmViMi00ZjljLWIzYjUtNDZmYzE2ZTRmYjM5IiwiaWF0IjoxNzE4MTk0Mjk5LCJuYmYiOjE3MTgxOTQyOTksImlzcyI6Imh0dHBzOi8vYXBwLmJyaWxsaW9uLmZpbmFuY2UiLCJleHAiOjE3MTgxOTc4OTl9.dm0UGzhmdnnZXc1uJ8YdScO98vUssg6X20Sr-skyhLsxe9-GqHy5DvZ6MamjxKl1EMOXFrc5ocHu0Xb5T6JeHkcigucu5aYh9NE_ueMShXz9Vk0J3uKJNYOwsHiz-TTxnX3fQxogGhVVKVgGuVPivMtwwKq6jD8yYaPBbfpPFAlLMON6WppPka7BuxIvYpdble1cV3LGjY_D48KcvVV28w3pvEPj9iaHocUJ604nFEZ3mBAzCmqbGXqDI63UVCXxO1qqFZWeezRC0szL9RtUbygqe0MVwh5uqCSz6VppoQzUXp9oT1vi8dmgAEpNeAmZ5sPZCNs2kxHzb93PC4CuzQ';

export class WalletInfra {
  private config: Config;
  private baseURL: string;

  private httpClient: HttpClient;
  public Transaction: TransactionService;
  public Wallet: WalletService;

  constructor() {
    this.config = new Config();
    this.baseURL = this.config.get(ConfigKeys.BASE_URL);

    this.httpClient = new HttpClient(this.baseURL, jwt);
    this.Transaction = new TransactionService(this.httpClient);

    this.Wallet = new WalletService(this.httpClient);
  }
}
