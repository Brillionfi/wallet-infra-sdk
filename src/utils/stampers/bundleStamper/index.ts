import * as TKHQ from './utils';
import * as hpke from './hpke';

// Header name for an API key stamp
const stampHeaderName = 'X-Stamp';

type TStamp = {
  stampHeaderName: string;
  stampHeaderValue: string;
};

/**
 * Stamper to use with `@turnkey/http`'s `TurnkeyClient`
 */
export class BundleStamper {
  stamperPublicKey: CryptoKey | null;
  stamperPrivateKey: CryptoKey | null;
  embeddedKey: JsonWebKey | null;
  embeddedKeyHex: string | null;
  credentialsBytes: Uint8Array | null;

  /**
   * Creates a new stamper.
   * Call `.init()` to generate keys.
   */
  constructor() {
    this.stamperPublicKey = null;
    this.stamperPrivateKey = null;
    this.embeddedKey = null;
    this.embeddedKeyHex = null;
    this.credentialsBytes = null;
  }

  /**
   * Inserts the stamper's public key
   */
  async init(): Promise<void> {
    const { publicKey, privateKey, embeddedKeyJwk } =
      await TKHQ.initEmbeddedKey();
    this.stamperPublicKey = publicKey;
    this.stamperPrivateKey = privateKey;
    this.embeddedKey = embeddedKeyJwk;

    const targetPubBuf = await TKHQ.p256JWKPrivateToPublic(embeddedKeyJwk);
    const targetPubHex = TKHQ.uint8arrayToHexString(targetPubBuf);
    this.embeddedKeyHex = targetPubHex;
  }

  /**
   * Returns the public key.
   */
  publicKey(): string {
    if (this.embeddedKeyHex === null) {
      throw new Error('null public key. Have you called/awaited .init()?');
    }
    return this.embeddedKeyHex;
  }

  /**
   * Function to inject a new credential into the stamper
   * The bundle should be encrypted to the stamper's initial public key
   * Encryption should be performed with HPKE (RFC 9180).
   * This is used during recovery and auth flows.
   */
  async injectCredentialBundle(bundle: string): Promise<void> {
    let bundleBytes;
    if (
      // Non-alphanumerical characters in base64url: - and _. These aren't in base58.
      bundle.indexOf('-') === -1 &&
      bundle.indexOf('_') === -1 &&
      // Uppercase o (O), uppercase i (I), lowercase L (l), and 0 aren't in the character set either.
      bundle.indexOf('O') === -1 &&
      bundle.indexOf('I') === -1 &&
      bundle.indexOf('l') === -1 &&
      bundle.indexOf('0') === -1
    ) {
      // If none of these characters are in the bundle we assume it's a base58check-encoded string
      // This isn't perfect: there's a small chance that a base64url-encoded string doesn't have any of these characters by chance!
      // But we accept this risk given this branching is only here to support our transition to base58check.
      // I hear you'd like to quantify this risk? Let's do it.
      // Assuming random bytes in our bundle and a bundle length of 33 (public key, compressed) + 48 (encrypted cred) = 81 bytes.
      // The odds of a byte being in the overlap set between base58 and base64url is 58/64=0.90625.
      // Which means the odds of a 81 bytes string being in the overlap character set for its entire length is...
      // ... 0.90625^81 = 0.0003444209703
      // Are you convinced that this is good enough? I am :)
      bundleBytes = await TKHQ.base58checkDecode(bundle);
    } else {
      bundleBytes = TKHQ.base64urlDecode(bundle);
    }

    if (bundleBytes.byteLength <= 33) {
      throw new Error(
        'bundle size ' +
          bundleBytes.byteLength +
          ' is too low. Expecting a compressed public key (33 bytes) and an encrypted credential',
      );
    }

    const compressedEncappedKeyBuf = bundleBytes.subarray(0, 33);
    const ciphertextBuf = bundleBytes.subarray(33);

    // Decompress the compressed key
    const encappedKeyBuf = TKHQ.uncompressRawPublicKey(
      compressedEncappedKeyBuf,
    );

    const credentialBytes = await TKHQ.HpkeDecrypt({
      ciphertextBuf,
      encappedKeyBuf,
      receiverPrivJwk: this.embeddedKey,
      hpke,
    });

    this.credentialsBytes = new Uint8Array(credentialBytes);
  }

  /**
   * Function to sign a payload with the stamper keys
   */
  async stamp(payload: string): Promise<TStamp> {
    if (this.stamperPublicKey === null) {
      throw new Error('null public key. Have you called/awaited .init()?');
    }
    if (this.credentialsBytes === null) {
      throw new Error(
        'cannot sign payload without credential. Credential bytes are null',
      );
    }

    const key = await TKHQ.importCredential(this.credentialsBytes);
    const signatureIeee1363 = await crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-256' },
      },
      key,
      new TextEncoder().encode(payload),
    );

    const derSignature = TKHQ.convertEcdsaIeee1363ToDer(
      new Uint8Array(signatureIeee1363),
    );
    const derSignatureHexString = TKHQ.uint8arrayToHexString(derSignature);

    // This is a bit of a pain, but we need to go through this:
    // - Key needs to be exported to JWK first
    // - Then imported without the private "d" component, and exported to get the public key
    //   ^^ (that's what `p256JWKPrivateToPublic` does)
    // - Finally, compress the public key.
    const jwkKey = await crypto.subtle.exportKey('jwk', key);
    const publicKey = await TKHQ.p256JWKPrivateToPublic(jwkKey);
    const compressedPublicKey = TKHQ.compressRawPublicKey(publicKey);

    const stamp = {
      publicKey: TKHQ.uint8arrayToHexString(compressedPublicKey),
      scheme: 'SIGNATURE_SCHEME_TK_API_P256',
      signature: derSignatureHexString,
    };

    const stampHeaderValue = TKHQ.stringToBase64urlString(
      JSON.stringify(stamp),
    );

    return {
      stampHeaderName: stampHeaderName,
      stampHeaderValue: stampHeaderValue,
    };
  }
}
