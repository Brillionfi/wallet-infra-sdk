import { Wallet } from '@api/wallet.api';
import { HttpClient } from '@utils/http-client';
import logger from '@utils/logger';
import {
  TCreateWalletBody,
  TCreateWalletResponse,
  TGetWalletsResponse,
} from '@models/wallet';

jest.mock('@utils/http-client');

jest.mock('@utils/logger', () => ({
  info: jest.fn(),
}));

describe('Wallet', () => {
  let wallet: Wallet;
  let httpClientMock: jest.Mocked<HttpClient>;

  const walletName = 'Test wallet';
  const challenge = 'FsAxSlgRXHR7o-ePTrRreH8gm-OZVix8V3wlSqJQ50w';

  const attestation = {
    credentialId: '_xC0tyqT8LYXQfz9hCQBTVbXS4I',
    clientDataJson:
      'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoi' +
      'RnNBeFNsZ1JYSFI3by1lUFRyUnJlSDhnbS1PWlZpeDhWM3dsU3FKUT' +
      'UwdyIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImNyb3NzT3JpZ2luIjpmYWxzZX0',
    attestationObject:
      'o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YViYSZYN5YgOjGh0' +
      'NBcPZHZgW4_krrmihjLHmVzzuoMdl2NdAAAAAAAAAAAAAAAAAAAAAA' +
      'AAAAAAFP8QtLcqk_C2F0H8_YQkAU1W10uCpQECAyYgASFYIKOv0RbKM' +
      'A4DyVDI_Er_-SqUY7an5o41_8X7ugxQHwIeIlggzuElSvkH1R9SP_XRwfsk2vM0Y4Fc_UdJQpyU8lLcytM',
    transports: [
      'AUTHENTICATOR_TRANSPORT_HYBRID',
      'AUTHENTICATOR_TRANSPORT_INTERNAL',
    ],
  };

  const authenticationType = {
    challenge,
    attestation,
  };

  beforeEach(() => {
    httpClientMock = new HttpClient('') as jest.Mocked<HttpClient>;
    wallet = new Wallet(httpClientMock, '/wallets');
  });

  it('should call post on HttpClient when createWallet is called', async () => {
    const data = {
      walletType: {
        eoa: {
          walletName,
          walletFormat: 'ethereum',
          authenticationType,
        },
      },
    } as TCreateWalletBody;

    const response = {
      eoa: {
        walletName: '1',
        walletFormat: '2',
        walletType: '3',
        walletAddress: '4',
      },
    };

    httpClientMock.post = jest.fn().mockResolvedValue({ data: response });

    const result = (await wallet.createWallet(data)) as TCreateWalletResponse;

    expect(logger.info).toHaveBeenCalledWith('Creating wallet');
    expect(httpClientMock.post).toHaveBeenCalledWith('/wallets', data);
    expect(result).toEqual(response);
  });

  it('should call get on HttpClient when getWallets is called', async () => {
    const response = {
      body: [
        {
          name: 'name',
          type: 'type',
          format: 'format',
          owner: 'owner',
          address: 'address',
        },
      ],
    };

    httpClientMock.get = jest.fn().mockResolvedValue({ data: response });

    const result = (await wallet.getWallets()) as TGetWalletsResponse;

    expect(logger.info).toHaveBeenCalledWith('Getting wallets');
    expect(httpClientMock.get).toHaveBeenCalledWith('/wallets');
    expect(result).toEqual(response);
  });
});
