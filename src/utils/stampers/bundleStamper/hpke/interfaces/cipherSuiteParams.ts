import type { AeadId, KdfId, KemId } from '../identifiers';
import type { AeadInterface } from './aeadInterface';
import type { KdfInterface } from './kdfInterface';
import type { KemInterface } from './kemInterface';

/**
 * The parameters used to configure the `CipherSuite`.
 */
export interface CipherSuiteParams {
  /** The KEM (Key Encapsulation Mechanism) identifier or the KEM object. */
  kem: KemId | KemInterface;

  /** The KDF (Key Derivation Function) identifier or the KDF object. */
  kdf: KdfId | KdfInterface;

  /** The AEAD (Authenticated Encryption with Addtional Data) identifier or the AEAD object. */
  aead: AeadId | AeadInterface;
}
