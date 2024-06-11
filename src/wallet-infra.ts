import { HttpClient } from '@utils/http-client';
import { ExampleService } from '@services/example.service';
import { TransactionService } from '@services/transaction.service';
import { Config, ConfigKeys } from './config';

const jwt =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6Ik1GcXVya0dHVi1sVDNmYmdKeTZ1RGpROGI0bDFDc1NNaWluT0d2QjBENkUiLCJ0eXAiOiJqd3QifQ.eyJvcmdJZCI6IjRmMTBlZTM5LTMxMDgtNDA4Yy04ZjdjLTRjZWYwODMwZTNkNiIsInVzZXJOYW1lIjoia2hhbGVka2FkZGFsIiwiZW1haWwiOiJraGFsZWRrYWRkYWxAZ21haWwuY29tIiwib0F1dGhQcm92aWRlciI6Ikdvb2dsZSIsImFwcElkIjoiY2NjYTk3MzktNTdjZS00MWUyLWI4NGYtZDhjNmUzMDlkM2VhIiwicm9sZSI6IldBTExFVF9VU0VSIiwic2Vzc2lvbklkIjoiYTcwMTRmMDktN2I1MC00Njc4LWIyODMtZTgzMDMzZmE5NTUxIiwiaWF0IjoxNzE4MDI0NjgyLCJuYmYiOjE3MTgwMjQ2ODIsImlzcyI6Imh0dHBzOi8vYXBwLmJyaWxsaW9uLmZpbmFuY2UiLCJleHAiOjE3MTgwMjgyODF9.I70PM5pu9Zpa-zefVpv0w8PK87mKIdZiUnqmqNwlEyCUa-Bxjnl-f4IBGETl_eHszNrCaME742XCduOQRizLh80bbT18JcYURCE4ujumhh80BtQFbAJ5RoZvfeBSclgmEXU6aaY8Tz-13iH3mOoaCUTh3DiNafxr3_R8K7TfokRYArZvWVioqilP81iPC7ECdpRXagyafsuZXECd7DbbQ97w8FAUWmD4tZezYheIq0XChxslk-aT-8yBnvj-Mtzlz4DyGu7j2ppm76M5j6uBo2viXnWn5RSFZwEmBcPciXpkujlErYSh5vzAUX36Rr2LEV-wJw1tDJHBvFfhn5D9yg';

export class WalletInfra {
  private config: Config;
  private baseURL: string;

  private httpClient: HttpClient;
  public example: ExampleService;
  public transaction: TransactionService;

  constructor() {
    this.config = new Config();
    this.baseURL = this.config.get(ConfigKeys.BASE_URL);

    this.httpClient = new HttpClient(this.baseURL, jwt);
    this.example = new ExampleService(this.httpClient);
    this.transaction = new TransactionService(this.httpClient);
  }
}
