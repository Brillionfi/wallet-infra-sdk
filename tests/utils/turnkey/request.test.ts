import { WebauthnStamper } from '@utils/stampers';
import { sendTurnkeyRequest } from '@utils/turnkey/request';
import axios from 'axios';

jest.mock('axios');
jest.mock('@utils/stampers');

describe('Turnkey request util', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedStamper = new WebauthnStamper({
    rpId: 'id',
  }) as jest.Mocked<WebauthnStamper>;
  const organizationId = '1';
  const fingerprint = 'fingerprint';

  describe('RejectActivityInTurnkey', () => {
    it('should throw an error when axios fails', async () => {
      jest
        .spyOn(mockedStamper, 'stamp')
        .mockResolvedValue({
          stampHeaderName: 'stampHeaderName',
          stampHeaderValue: 'stampHeaderValue',
        });

      mockedAxios.post.mockRejectedValue(new Error('axios error'));

      await expect(
        sendTurnkeyRequest('url', {}, mockedStamper),
      ).rejects.toThrow('There is unexpected error happens.');
    });

    it('should return', async () => {
      jest
        .spyOn(mockedStamper, 'stamp')
        .mockResolvedValue({
          stampHeaderName: 'stampHeaderName',
          stampHeaderValue: 'stampHeaderValue',
        });

      const activity = {
        fingerprint: 'fingerprint',
        id: 'activityId',
        status: 'status',
      };
      mockedAxios.post.mockResolvedValue({ data: activity });

      const response = await sendTurnkeyRequest(
        organizationId,
        fingerprint,
        mockedStamper,
      );
      expect(response).toBeDefined();
      expect(response).toBe(activity);
    });
  });
});
