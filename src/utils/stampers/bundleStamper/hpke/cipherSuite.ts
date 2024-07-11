import type { CipherSuiteParams } from './interfaces/cipherSuiteParams';
import type { KemInterface } from './interfaces/kemInterface';

import { Aes128Gcm, Aes256Gcm } from './aeads/aesGcm';
import { ExportOnly } from './aeads/exportOnly';
import { Chacha20Poly1305 } from './aeads/chacha20Poly1305';
import { InvalidParamError } from './errors';
import { HkdfSha256 } from './kdfs/hkdfSha256';
import { HkdfSha384 } from './kdfs/hkdfSha384';
import { HkdfSha512 } from './kdfs/hkdfSha512';
import { DhkemP256HkdfSha256 } from './kems/dhkemP256';
import { DhkemP384HkdfSha384 } from './kems/dhkemP384';
import { DhkemP521HkdfSha512 } from './kems/dhkemP521';
import { DhkemX25519HkdfSha256 } from './kems/dhkemX25519';
import { DhkemX448HkdfSha512 } from './kems/dhkemX448';
import { AeadId, KdfId, KemId } from './identifiers';
import { CipherSuiteNative } from './cipherSuiteNative';

/**
 * The Hybrid Public Key Encryption (HPKE) ciphersuite,
 * which supports all of the ciphersuites defined in
 * {@link https://datatracker.ietf.org/doc/html/rfc9180 | RFC9180}.
 *
 * The class consists of the {@link https://deno.land/x/hpke/core/mod.ts | @hpke/core},
 * {@link https://deno.land/x/hpke/x/chacha20Poly1305/mod.ts | @hpke/chcha20poly1305},
 * {@link https://deno.land/x/hpke/x/dhkem-x25519/mod.ts | @hpke/dhkem-x25519} and
 * {@link https://deno.land/x/hpke/x/dhkem-x448/mod.ts | @hpke/dhkem-x448} internally.
 *
 * This class provides following functions:
 *
 * - [DEPRECATED] Generates a key pair for the cipher suite.
 * - [DEPRECATED] Derives a key pair for the cipher suite.
 * - [DEPRECATED] Imports and converts a key to a CryptoKey.
 * - Creates encryption contexts both for senders and recipients.
 *     - {@link createSenderContext}
 *     - {@link createRecipientContext}
 * - Provides single-shot encryption API.
 *     - {@link seal}
 *     - {@link open}
 *
 * The calling of the constructor of this class is the starting
 * point for HPKE operations for both senders and recipients.
 *
 * @example Use only ciphersuites supported internally.
 *
 * ```ts
 * import { AeadId, CipherSuite, KdfId, KemId } from "http://deno.land/x/hpke/mod";
 *
 * const suite = new CipherSuite({
 *   kem: KemId.DhkemP256HkdfSha256,
 *   kdf: KdfId.HkdfSha256,
 *   aead: AeadId.Aes128Gcm,
 * });
 * ```
 *
 * @example Use a ciphersuite consisting of an external module.
 *
 * ```ts
 * import { AeadId, CipherSuite, KdfId } from "http://deno.land/x/hpke/mod";
 * // Use an extension module.
 * import {
 *   HybridkemX25519Kyber768,
 * } from "https://deno.land/x/hpke/x/hybridkem-x25519-kyber768/mod";
 *
 * const suite = new CipherSuite({
 *   kem: new HybridkemX25519Kyber768(),
 *   kdf: KdfId.HkdfSha256,
 *   aead: AeadId.Aes128Gcm,
 * });
 * ```
 */
export class CipherSuite extends CipherSuiteNative {
  /**
   * @param params A set of parameters for building a cipher suite.
   * @throws {@link InvalidParamError}
   */
  constructor(params: CipherSuiteParams) {
    // KEM
    if (typeof params.kem === 'number') {
      switch (params.kem) {
        case KemId.DhkemP256HkdfSha256:
          params.kem = new DhkemP256HkdfSha256();
          break;
        case KemId.DhkemP384HkdfSha384:
          params.kem = new DhkemP384HkdfSha384();
          break;
        case KemId.DhkemP521HkdfSha512:
          params.kem = new DhkemP521HkdfSha512();
          break;
        case KemId.DhkemX25519HkdfSha256:
          params.kem = new DhkemX25519HkdfSha256();
          break;
        case KemId.DhkemX448HkdfSha512:
          params.kem = new DhkemX448HkdfSha512();
          break;
        default:
          throw new InvalidParamError(
            `The KEM (${params.kem}) cannot be specified by KemId. Use submodule for the KEM`,
          );
      }
    }

    // KDF
    if (typeof params.kdf === 'number') {
      switch (params.kdf) {
        case KdfId.HkdfSha256:
          params.kdf = new HkdfSha256();
          break;
        case KdfId.HkdfSha384:
          params.kdf = new HkdfSha384();
          break;
        default:
          // case KdfId.HkdfSha512:
          params.kdf = new HkdfSha512();
          break;
      }
    }

    // AEAD
    if (typeof params.aead === 'number') {
      switch (params.aead) {
        case AeadId.Aes128Gcm:
          params.aead = new Aes128Gcm();
          break;
        case AeadId.Aes256Gcm:
          params.aead = new Aes256Gcm();
          break;
        case AeadId.Chacha20Poly1305:
          params.aead = new Chacha20Poly1305();
          break;
        default:
          // case AeadId.ExportOnly:
          params.aead = new ExportOnly();
          break;
      }
    }
    super(params);
  }

  /**
   * Generates a key pair for the cipher suite.
   *
   * If the error occurred, throws {@link NotSupportedError}.
   *
   * @deprecated Use {@link KemInterface.generateKeyPair} instead.
   *
   * @returns A key pair generated.
   * @throws {@link NotSupportedError}
   */
  public async generateKeyPair(): Promise<CryptoKeyPair> {
    await this._setup();
    return await (this._kem as KemInterface).generateKeyPair();
  }

  /**
   * Derives a key pair for the cipher suite in the manner
   * defined in [RFC9180 Section 7.1.3](https://www.rfc-editor.org/rfc/rfc9180.html#section-7.1.3).
   *
   * If the error occurred, throws {@link DeriveKeyPairError}.
   *
   * @deprecated Use {@link KemInterface.deriveKeyPair} instead.
   *
   * @param ikm A byte string of input keying material. The maximum length is 128 bytes.
   * @returns A key pair derived.
   * @throws {@link DeriveKeyPairError}
   */
  public async deriveKeyPair(ikm: ArrayBuffer): Promise<CryptoKeyPair> {
    await this._setup();
    return await (this._kem as KemInterface).deriveKeyPair(ikm);
  }

  /**
   * Imports a public or private key and converts to a {@link CryptoKey}.
   *
   * Since key parameters for {@link createSenderContext} or {@link createRecipientContext}
   * are {@link CryptoKey} format, you have to use this function to convert provided keys
   * to {@link CryptoKey}.
   *
   * Basically, this is a thin wrapper function of
   * [SubtleCrypto.importKey](https://www.w3.org/TR/WebCryptoAPI/#dfn-SubtleCrypto-method-importKey).
   *
   * If the error occurred, throws {@link DeserializeError}.
   *
   * @deprecated Use {@link KemInterface.generateKeyPair} instead.
   *
   * @param format For now, `'raw'` and `'jwk'` are supported.
   * @param key A byte string of a raw key or A {@link JsonWebKey} object.
   * @param isPublic The indicator whether the provided key is a public key or not, which is used only for `'raw'` format.
   * @returns A public or private CryptoKey.
   * @throws {@link DeserializeError}
   */
  public async importKey(
    format: 'raw' | 'jwk',
    key: ArrayBuffer | JsonWebKey,
    isPublic = true,
  ): Promise<CryptoKey> {
    await this._setup();
    return await (this._kem as KemInterface).importKey(format, key, isPublic);
  }
}
