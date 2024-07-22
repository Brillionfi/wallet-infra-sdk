export const LABEL_DKP_PRK = new Uint8Array([100, 107, 112, 95, 112, 114, 107]);

export const KEM_USAGES: KeyUsage[] = ['deriveBits'];

export interface DhkemPrimitives {
  serializePublicKey(key: CryptoKey): Promise<ArrayBuffer>;

  deserializePublicKey(key: ArrayBuffer): Promise<CryptoKey>;

  serializePrivateKey(key: CryptoKey): Promise<ArrayBuffer>;

  deserializePrivateKey(key: ArrayBuffer): Promise<CryptoKey>;

  importKey(
    format: 'raw' | 'jwk',
    key: ArrayBuffer | JsonWebKey,
    isPublic: boolean,
  ): Promise<CryptoKey>;

  generateKeyPair(): Promise<CryptoKeyPair>;

  deriveKeyPair(ikm: ArrayBuffer): Promise<CryptoKeyPair>;

  // DHKEM-specific function.
  derivePublicKey(key: CryptoKey): Promise<CryptoKey>;

  // DHKEM-specific function.
  dh(sk: CryptoKey, pk: CryptoKey): Promise<ArrayBuffer>;
}
