import {
  ITurnkeyWalletActivity,
  TurnkeyWalletActivitySchema,
} from '@models/wallet.models';
import { WebauthnStamper } from '@utils/stampers';
import { RejectActivityInTurnkey } from '@utils/turnkey';
import * as TurnkeyRequestUtils from '@utils/turnkey/request';

describe('Turnkey utils', () => {
  const mockedStamper = new WebauthnStamper({
    rpId: 'id',
  }) as jest.Mocked<WebauthnStamper>;
  const organizationId = '1';
  const fingerprint = 'fingerprint';

  describe('RejectActivityInTurnkey', () => {
    it('should throw an error when sendTurnkeyRequest fails', async () => {
      jest
        .spyOn(TurnkeyRequestUtils, 'sendTurnkeyRequest')
        .mockRejectedValue(new Error('axios error'));

      await expect(
        RejectActivityInTurnkey(organizationId, fingerprint, mockedStamper),
      ).rejects.toThrow('axios error');
    });

    it('should reject', async () => {
      jest
        .spyOn(TurnkeyRequestUtils, 'sendTurnkeyRequest')
        .mockImplementation(() =>
          Promise.resolve({
            activity: {},
          }),
        );
      const activity = {
        fingerprint: 'fingerprint',
        id: 'activityId',
        status: 'status',
      };
      jest
        .spyOn(TurnkeyWalletActivitySchema, 'parse')
        .mockImplementation(() => activity as ITurnkeyWalletActivity);

      const response = await RejectActivityInTurnkey(
        organizationId,
        fingerprint,
        mockedStamper,
      );
      expect(response).toBeDefined();
      expect(response).toBe(activity);
    });
  });
});
