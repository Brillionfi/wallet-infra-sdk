import { BundleStamper, WebauthnStamper } from '@utils/stampers';
import { sendTurnkeyRequest } from './request';
import {
  ITurnkeyWalletActivity,
  ITurnkeyWalletActivityResponse,
  TurnkeyWalletActivitySchema,
} from '@models/wallet.models';

export async function ApproveActivityInTurnkey(
  organizationId: string,
  fingerprint: string,
  stamper: WebauthnStamper,
): Promise<ITurnkeyWalletActivity> {
  const requestBody = {
    type: 'ACTIVITY_TYPE_APPROVE_ACTIVITY',
    timestampMs: String(Date.now()),
    organizationId,
    parameters: {
      fingerprint,
    },
  };
  const { activity } = await sendTurnkeyRequest<ITurnkeyWalletActivityResponse>(
    '/public/v1/submit/approve_activity',
    requestBody,
    stamper,
  );
  return TurnkeyWalletActivitySchema.parse(activity);
}

export async function RejectActivityInTurnkey(
  organizationId: string,
  fingerprint: string,
  stamper: WebauthnStamper,
): Promise<ITurnkeyWalletActivity> {
  const requestBody = {
    type: 'ACTIVITY_TYPE_REJECT_ACTIVITY',
    timestampMs: String(Date.now()),
    organizationId,
    parameters: {
      fingerprint,
    },
  };
  const { activity } = await sendTurnkeyRequest<ITurnkeyWalletActivityResponse>(
    '/public/v1/submit/reject_activity',
    requestBody,
    stamper,
  );
  return TurnkeyWalletActivitySchema.parse(activity);
}

export async function RecoverUserInTurnkey(
  organizationId: string,
  userId: string,
  authenticator: object,
  stamper: BundleStamper,
): Promise<ITurnkeyWalletActivity> {
  const requestBody = {
    type: 'ACTIVITY_TYPE_RECOVER_USER',
    timestampMs: String(Date.now()),
    organizationId,
    parameters: {
      userId,
      authenticator,
    },
  };
  const { activity } = await sendTurnkeyRequest<ITurnkeyWalletActivityResponse>(
    '/public/v1/submit/recover_user',
    requestBody,
    stamper,
  );
  return TurnkeyWalletActivitySchema.parse(activity);
}
