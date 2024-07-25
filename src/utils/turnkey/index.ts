import { BundleStamper, WebauthnStamper } from '@utils/stampers';
import { sendTurnkeyRequest } from './request';
import { TurnkeyApiTypes } from '@turnkey/http';

export async function ApproveActivityInTurnkey(
  organizationId: string,
  fingerprint: string,
  stamper: WebauthnStamper,
): Promise<TurnkeyApiTypes['v1ActivityResponse']> {
  const requestBody = {
    type: 'ACTIVITY_TYPE_APPROVE_ACTIVITY',
    timestampMs: String(Date.now()),
    organizationId,
    parameters: {
      fingerprint,
    },
  };
  return sendTurnkeyRequest<TurnkeyApiTypes['v1ActivityResponse']>(
    '/public/v1/submit/approve_activity',
    requestBody,
    stamper,
  );
}

export async function RejectActivityInTurnkey(
  organizationId: string,
  fingerprint: string,
  stamper: WebauthnStamper,
): Promise<TurnkeyApiTypes['v1ActivityResponse']> {
  const requestBody = {
    type: 'ACTIVITY_TYPE_REJECT_ACTIVITY',
    timestampMs: String(Date.now()),
    organizationId,
    parameters: {
      fingerprint,
    },
  };
  return sendTurnkeyRequest<TurnkeyApiTypes['v1ActivityResponse']>(
    '/public/v1/submit/reject_activity',
    requestBody,
    stamper,
  );
}

export async function RecoverUserInTurnkey(
  organizationId: string,
  userId: string,
  authenticator: object,
  stamper: BundleStamper,
): Promise<TurnkeyApiTypes['v1ActivityResponse']> {
  const requestBody = {
    type: 'ACTIVITY_TYPE_RECOVER_USER',
    timestampMs: String(Date.now()),
    organizationId,
    parameters: {
      userId,
      authenticator,
    },
  };
  return sendTurnkeyRequest<TurnkeyApiTypes['v1ActivityResponse']>(
    '/public/v1/submit/recover_user',
    requestBody,
    stamper,
  );
}
