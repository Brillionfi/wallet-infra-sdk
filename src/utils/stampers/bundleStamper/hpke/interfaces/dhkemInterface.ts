import type { KdfInterface } from './kdfInterface';
import type { KemInterface } from './kemInterface';

/**
 * The DHKEM interface.
 */
export interface DhkemInterface extends KemInterface {
  readonly kdf: KdfInterface;
}
