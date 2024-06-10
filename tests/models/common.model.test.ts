import { AddressSchema } from '@models/common.models';

describe('Common Schemas', () => {
  it('should throw an error if address is not valid', () => {
    const example = '0x123';
    expect(() => AddressSchema.parse(example)).toThrow();
  });

  it('should return valid address', () => {
    const example = '0xe6d0c561728eFeA5EEFbCdF0A5d0C945e3697bEA';
    const data = AddressSchema.parse(example);
    expect(data).toBeDefined();
  });
});
