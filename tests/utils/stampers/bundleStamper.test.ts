import { BundleStamper } from '@utils/stampers';
import * as util from '@utils/stampers/utils';

describe('BundleStamper', () => {
  const bundle =
    'qLuk5ta7j5EN4ZnbditTgccECYW62613vcmP89iReGTUpt8SgaJN1xVLgBnMizHzmW7uBMe6XSjokPFu7MGMgnGSLX9zhgGU545UaDqZSX491TuVH7D';

  it('should throw error if try to get publicKey when not init', () => {
    const stamper = new BundleStamper();
    expect(() => stamper.publicKey()).toThrow(
      'null public key. Have you called/awaited .init()?',
    );
  });

  it('should init and return publicKey key', async () => {
    const stamper = new BundleStamper();
    await stamper.init();
    expect(stamper.publicKey()).toBeDefined();
  });

  it('should throw error if injectCredentialBundle has wrong bundle', async () => {
    const stamper = new BundleStamper();
    await stamper.init();
    await expect(() =>
      stamper.injectCredentialBundle('bundle'),
    ).rejects.toThrow(
      'bundle size 4 is too low. Expecting a compressed public key (33 bytes) and an encrypted credential',
    );
  });

  it('should injectCredentialBundle', async () => {
    jest.spyOn(util, 'HpkeDecrypt').mockResolvedValue('something');
    const stamper = new BundleStamper();
    await stamper.init();
    await stamper.injectCredentialBundle(bundle);
  });

  it('should throw stamp error if not init', async () => {
    const stamper = new BundleStamper();
    await expect(() => stamper.stamp('bundle')).rejects.toThrow(
      'null public key. Have you called/awaited .init()?',
    );
  });

  it('should throw stamp error if not bundle injected', async () => {
    const stamper = new BundleStamper();
    await stamper.init();
    await expect(() => stamper.stamp('bundle')).rejects.toThrow(
      'cannot sign payload without credential. Credential bytes are null',
    );
  });

  it('should stamp', async () => {
    jest.spyOn(util, 'HpkeDecrypt').mockResolvedValue('something');
    jest
      .spyOn(util, 'uncompressRawPublicKey')
      .mockReturnValue(new Uint8Array());
    jest.spyOn(util, 'importCredential').mockResolvedValue(new CryptoKey());
    jest.spyOn(crypto.subtle, 'sign').mockResolvedValue(new ArrayBuffer(1));
    jest
      .spyOn(crypto.subtle, 'exportKey')
      .mockResolvedValue(new ArrayBuffer(1));
    jest.spyOn(util, 'p256JWKPrivateToPublic').mockResolvedValue('publicKey');
    jest.spyOn(util, 'compressRawPublicKey').mockReturnValue(new Uint8Array());
    jest.spyOn(util, 'uint8arrayToHexString').mockReturnValue('publicKey');
    jest
      .spyOn(util, 'convertEcdsaIeee1363ToDer')
      .mockReturnValue(new Uint8Array());

    const stamper = new BundleStamper();
    await stamper.init();
    await stamper.injectCredentialBundle(bundle);
    const stamp = await stamper.stamp('payload');
    expect(stamp).toBeDefined();
  });
});
