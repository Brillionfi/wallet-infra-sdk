import { KemId } from '../identifiers';
import { HkdfSha256Native } from '../kdfs/hkdf';
import { Dhkem } from './dhkem';
import { Ec } from './dhkemPrimitives/ec';

export class DhkemP256HkdfSha256Native extends Dhkem {
  public readonly id: KemId = KemId.DhkemP256HkdfSha256;
  public readonly secretSize: number = 32;
  public readonly encSize: number = 65;
  public readonly publicKeySize: number = 65;
  public readonly privateKeySize: number = 32;

  constructor() {
    const kdf = new HkdfSha256Native();
    const prim = new Ec(KemId.DhkemP256HkdfSha256, kdf);
    super(KemId.DhkemP256HkdfSha256, prim, kdf);
  }
}
