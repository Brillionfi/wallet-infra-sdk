import { WebauthnStamper } from '@utils/stampers';
import * as util from '@utils/stampers/webAuthnStamper/webauthn-json';

describe('webAuthnStamper.test', () => {
  it('should stamp', async () => {
    jest.spyOn(util, 'get').mockResolvedValue({
      toJSON: () => {
        return {
          id: '12',
          response: {
            authenticatorData: '123',
            clientDataJSON: '123',
            signature: '123',
          },
        };
      },
    } as util.AuthenticationPublicKeyCredential);

    const stamper = new WebauthnStamper({
      rpId: 'localhost',
    });

    const stamp = await stamper.stamp('payload');
    expect(stamp).toBeDefined();
  });
});
