import type { AeadEncryptionContext } from './aeadEncryptionContext';

export interface KeyInfo {
  key: AeadEncryptionContext;
  baseNonce: Uint8Array;
  seq: number;
}
