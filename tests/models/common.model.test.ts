import { EthereumAddressSchema } from '@models/common.models';
import { CredentialsProvider } from '@models/wallet.models';

describe('Common Schemas', () => {
  it('should throw an error if address is not valid', () => {
    const example = '0x123';
    expect(() => EthereumAddressSchema.parse(example)).toThrow();
  });

  it('should return valid address', () => {
    const example = '0xe6d0c561728eFeA5EEFbCdF0A5d0C945e3697bEA';
    const data = EthereumAddressSchema.parse(example);
    expect(data).toBeDefined();
  });

  it('Should have the correct casing for login methods', () => {
    expect(CredentialsProvider.GOOGLE).toBe('Google');
  });
});
