import type { AeadInterface } from './interfaces/aeadInterface';
import type { AeadParams } from './interfaces/aeadParams';
import type { KeyInfo } from './interfaces/keyInfo';
import type { KdfInterface } from './interfaces/kdfInterface';

import { MessageLimitReachedError } from './errors';
import { ExporterContextImpl } from './exporterContext';
import { i2Osp } from './utils/misc';

export function xor(a: Uint8Array, b: Uint8Array): Uint8Array {
  if (a.byteLength !== b.byteLength) {
    throw new Error('xor: different length inputs');
  }
  const buf = new Uint8Array(a.byteLength);
  for (let i = 0; i < a.byteLength; i++) {
    buf[i] = a[i] ^ b[i];
  }
  return buf;
}

export class EncryptionContextImpl extends ExporterContextImpl {
  // AEAD id.
  protected _aead: AeadInterface;
  // The length in bytes of a key for the algorithm.
  protected _nK: number;
  // The length in bytes of a nonce for the algorithm.
  protected _nN: number;
  // The length in bytes of an authentication tag for the algorithm.
  protected _nT: number;
  // The end-to-end encryption key information.
  protected _ctx: KeyInfo;

  constructor(api: SubtleCrypto, kdf: KdfInterface, params: AeadParams) {
    super(api, kdf, params.exporterSecret);

    if (
      params.key === undefined ||
      params.baseNonce === undefined ||
      params.seq === undefined
    ) {
      throw new Error('Required parameters are missing');
    }
    this._aead = params.aead;
    this._nK = this._aead.keySize;
    this._nN = this._aead.nonceSize;
    this._nT = this._aead.tagSize;

    const key = this._aead.createEncryptionContext(params.key);
    this._ctx = {
      key: key,
      baseNonce: params.baseNonce,
      seq: params.seq,
    };
  }

  protected computeNonce(k: KeyInfo): ArrayBuffer {
    const seqBytes = i2Osp(k.seq, k.baseNonce.byteLength);
    return xor(k.baseNonce, seqBytes);
  }

  protected incrementSeq(k: KeyInfo) {
    // if (this.seq >= (1 << (8 * this.baseNonce.byteLength)) - 1) {
    if (k.seq > Number.MAX_SAFE_INTEGER) {
      throw new MessageLimitReachedError('Message limit reached');
    }
    k.seq += 1;
    return;
  }
}
