import { TCreateWalletBody, TCreateWalletResponse } from '@models/wallet';
import { HttpClient } from '@utils/http-client';

export class CreateWallet {
  private httpClient: HttpClient;
  url: string;

  constructor(httpClient: HttpClient, url: string) {
    this.httpClient = httpClient;
    this.url = url;
  }

  public async createWallet(
    data: TCreateWalletBody,
  ): Promise<TCreateWalletResponse> {
    const response = await this.httpClient.post(this.url, data);
    return response.data as TCreateWalletResponse;
  }
}
