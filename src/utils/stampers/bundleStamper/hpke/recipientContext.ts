import { EMPTY } from './consts';
import { OpenError } from './errors';
import { EncryptionContextImpl } from './encryptionContext';

export class RecipientContextImpl extends EncryptionContextImpl {
  public async open(
    data: ArrayBuffer,
    aad: ArrayBuffer = EMPTY,
  ): Promise<ArrayBuffer> {
    let pt: ArrayBuffer;
    try {
      pt = await this._ctx.key.open(this.computeNonce(this._ctx), data, aad);
    } catch (e: unknown) {
      throw new OpenError(e);
    }
    this.incrementSeq(this._ctx);
    return pt;
  }
}
