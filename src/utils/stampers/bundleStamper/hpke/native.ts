import { CipherSuiteNative } from './cipherSuiteNative';
import { DhkemP256HkdfSha256Native } from './kems/dhkemNative';
import { HkdfSha256Native } from './kdfs/hkdf';

export class CipherSuite extends CipherSuiteNative {}
export class DhkemP256HkdfSha256 extends DhkemP256HkdfSha256Native {}
export class HkdfSha256 extends HkdfSha256Native {}
