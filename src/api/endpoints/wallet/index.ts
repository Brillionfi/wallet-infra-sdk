import BaseEndpoint from '@api/BaseEndpoint';
import { TCreateWalletBody, TCreateWalletResponse } from '@models/wallet';
import { AxiosResponse } from 'axios';

class CreateWallet extends BaseEndpoint {
  url: string;

  constructor(url: string, jwt: string) {
    super(jwt);
    this.url = url;
  }

  private validateResponse = (
    response: AxiosResponse,
  ): TCreateWalletResponse => {
    if (response.status !== 200) {
      throw new Error('Invalid response');
    }

    // validate response

    return {
      eoa: response.data.data.eoa,
    };
  };

  send = async (data: TCreateWalletBody): Promise<TCreateWalletResponse> => {
    const response = await this.execute({
      url: this.url,
      method: 'POST',
      data: { data },
    });
    return this.validateResponse(response);
  };
}

export default CreateWallet;
