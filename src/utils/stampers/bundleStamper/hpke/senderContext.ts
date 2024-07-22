import type { AeadParams } from './interfaces/aeadParams';
import type { Encapsulator } from './interfaces/encapsulator';
import type { KdfInterface } from './interfaces/kdfInterface';

import { EMPTY } from './consts';
import { SealError } from './errors';
import { EncryptionContextImpl } from './encryptionContext';

export class SenderContextImpl
  extends EncryptionContextImpl
  implements Encapsulator
{
  public readonly enc: ArrayBuffer;

  constructor(
    api: SubtleCrypto,
    kdf: KdfInterface,
    params: AeadParams,
    enc: ArrayBuffer,
  ) {
    super(api, kdf, params);
    this.enc = enc;
  }

  public async seal(
    data: ArrayBuffer,
    aad: ArrayBuffer = EMPTY,
  ): Promise<ArrayBuffer> {
    let ct: ArrayBuffer;
    try {
      ct = await this._ctx.key.seal(this.computeNonce(this._ctx), data, aad);
    } catch (e: unknown) {
      throw new SealError(e);
    }
    this.incrementSeq(this._ctx);
    return ct;
  }
}
