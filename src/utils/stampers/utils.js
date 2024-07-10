/**
 * Creates a new public/private key pair and persists it in localStorage
 */
export const initEmbeddedKey = async function () {
  return await generateTargetKey();
};

/*
 * Generate a key to encrypt to and export it as a JSON Web Key.
 */
export const generateTargetKey = async function () {
  const p256key = await crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true,
    ['deriveBits'],
  );

  const embeddedKeyJwk = await crypto.subtle.exportKey(
    'jwk',
    p256key.privateKey,
  );

  return {
    publicKey: p256key.publicKey,
    privateKey: p256key.privateKey,
    embeddedKeyJwk,
  };
};

/**
 * Decrypt the ciphertext (ArrayBuffer) given an encapsulation key (ArrayBuffer)
 * and the receivers private key (JSON Web Key).
 */
export const HpkeDecrypt = async function ({
  ciphertextBuf,
  encappedKeyBuf,
  receiverPrivJwk,
  hpke,
}) {
  const kemContext = new hpke.DhkemP256HkdfSha256();
  const receiverPriv = await kemContext.importKey(
    'jwk',
    { ...receiverPrivJwk },
    false,
  );

  const suite = new hpke.CipherSuite({
    kem: kemContext,
    kdf: new hpke.HkdfSha256(),
    aead: new hpke.Aes256Gcm(),
  });

  const recipientCtx = await suite.createRecipientContext({
    recipientKey: receiverPriv,
    enc: encappedKeyBuf,
    info: new TextEncoder().encode('turnkey_hpke'),
  });

  const receiverPubBuf = await p256JWKPrivateToPublic(receiverPrivJwk);
  const aad = additionalAssociatedData(encappedKeyBuf, receiverPubBuf);
  let res;
  try {
    res = await recipientCtx.open(ciphertextBuf, aad);
  } catch (e) {
    throw new Error('decryption failed: ' + e);
  }
  return res;
};

/**
 * Takes a hex string (e.g. "e4567ab") and returns an array buffer (Uint8Array)
 * @param {string} hexString
 * @returns {Uint8Array}
 */
export const uint8arrayFromHexString = function (hexString) {
  const hexRegex = /^[0-9A-Fa-f]+$/;
  if (!hexString || hexString.length % 2 != 0 || !hexRegex.test(hexString)) {
    throw new Error(
      'cannot create uint8array from invalid hex string: "' + hexString + '"',
    );
  }
  return new Uint8Array(hexString.match(/../g).map((h) => parseInt(h, 16)));
};

/**
 * Takes a Uint8Array and returns a hex string
 * @param {Uint8Array} buffer
 * @return {string}
 */
export const uint8arrayToHexString = function (buffer) {
  return [...buffer].map((x) => x.toString(16).padStart(2, '0')).join('');
};

/**
 * Additional Associated Data (AAD) in the format dictated by the enclave_encrypt crate.
 */
export const additionalAssociatedData = function (
  senderPubBuf,
  receiverPubBuf,
) {
  const s = Array.from(new Uint8Array(senderPubBuf));
  const r = Array.from(new Uint8Array(receiverPubBuf));
  return new Uint8Array([...s, ...r]);
};

/**
 * Encodes a buffer into base64url
 * @param {Uint8Array} byteArray
 */
export function base64urlEncode(byteArray) {
  return btoa(
    Array.from(byteArray)
      .map((val) => {
        return String.fromCharCode(val);
      })
      .join(''),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/\=/g, ''); // eslint-disable-line
}

/**
 * Decodes a base64-encoded string into a buffer
 * @param {string} s
 * @return {Uint8Array}
 */
export function base64urlDecode(s) {
  const binaryString = atob(s.replace(/\-/g, '+').replace(/\_/g, '/')); // eslint-disable-line
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes a base58check-encoded string into a buffer
 * This function throws an error when the string is too small, doesn't have the proper checksum, or contains invalid characters.
 * Inspired by https://gist.github.com/diafygi/90a3e80ca1c2793220e5/
 * @param {string} s
 * @return {Uint8Array}
 */
export async function base58checkDecode(s) {
  if (s.length < 5) {
    throw new Error(
      `cannot base58-decode a string of length < 5 (found length ${s.length})`,
    );
  }

  // See https://en.bitcoin.it/wiki/Base58Check_encoding
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const decodedBytes = [];
  const leadingZeros = [];
  for (let i = 0; i < s.length; i++) {
    if (alphabet.indexOf(s[i]) === -1) {
      throw new Error(`cannot base58-decode: ${s[i]} isn't a valid character`);
    }
    let carry = alphabet.indexOf(s[i]);

    // If the current base58 digit is 0, append a 0 byte.
    // "i == leadingZeros.length" can only be true if we have not seen non-zero bytes so far.
    // If we had seen a non-zero byte, carry wouldn't be 0, and i would be strictly more than `leadingZeros.length`
    if (carry == 0 && i === leadingZeros.length) {
      leadingZeros.push(0);
    }

    let j = 0;
    while (j < decodedBytes.length || carry > 0) {
      let currentByte = decodedBytes[j];

      // shift the current byte 58 units and add the carry amount
      // (or just add the carry amount if this is a new byte -- undefined case)
      if (currentByte === undefined) {
        currentByte = carry;
      } else {
        currentByte = currentByte * 58 + carry;
      }

      // find the new carry amount (1-byte shift of current byte value)
      carry = currentByte >> 8;
      // reset the current byte to the remainder (the carry amount will pass on the overflow)
      decodedBytes[j] = currentByte % 256;
      j++;
    }
  }

  const result = leadingZeros.concat(decodedBytes.reverse());

  const foundChecksum = result.slice(result.length - 4);

  const msg = result.slice(0, result.length - 4);
  const checksum1 = await crypto.subtle.digest('SHA-256', new Uint8Array(msg));
  const checksum2 = await crypto.subtle.digest(
    'SHA-256',
    new Uint8Array(checksum1),
  );
  const computedChecksum = Array.from(new Uint8Array(checksum2)).slice(0, 4);

  if (computedChecksum.toString() != foundChecksum.toString()) {
    throw new Error(
      `checksums do not match: computed ${computedChecksum} but found ${foundChecksum}`,
    );
  }

  return new Uint8Array(msg);
}

/**
 * `SubtleCrypto.sign(...)` outputs signature in IEEE P1363 format:
 * - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign#ecdsa
 *
 * Turnkey expects the signature encoding to be DER-encoded ASN.1:
 * - https://github.com/tkhq/tkcli/blob/7f0159af5a73387ff050647180d1db4d3a3aa033/src/internal/apikey/apikey.go#L149
 *
 * Code modified from https://github.com/google/tink/blob/6f74b99a2bfe6677e3670799116a57268fd067fa/javascript/subtle/elliptic_curves.ts#L114
 *
 * Transform an ECDSA signature in IEEE 1363 encoding to DER encoding.
 *
 * @param {Uint8Array} ieee the ECDSA signature in IEEE encoding
 * @return ECDSA signature in DER encoding
 */
export function convertEcdsaIeee1363ToDer(ieee) {
  if (ieee.length % 2 != 0 || ieee.length == 0 || ieee.length > 132) {
    throw new Error(
      'Invalid IEEE P1363 signature encoding. Length: ' + ieee.length,
    );
  }
  const r = toUnsignedBigNum(ieee.subarray(0, ieee.length / 2));
  const s = toUnsignedBigNum(ieee.subarray(ieee.length / 2, ieee.length));
  let offset = 0;
  const length = 1 + 1 + r.length + 1 + 1 + s.length;
  let der;
  if (length >= 128) {
    der = new Uint8Array(length + 3);
    der[offset++] = 48;
    der[offset++] = 128 + 1;
    der[offset++] = length;
  } else {
    der = new Uint8Array(length + 2);
    der[offset++] = 48;
    der[offset++] = length;
  }
  der[offset++] = 2;
  der[offset++] = r.length;
  der.set(r, offset);
  offset += r.length;
  der[offset++] = 2;
  der[offset++] = s.length;
  der.set(s, offset);
  return der;
}

/**
 * (private function, only called by `convertEcdsaIeee1363ToDer`)
 * Code modified from https://github.com/google/tink/blob/6f74b99a2bfe6677e3670799116a57268fd067fa/javascript/subtle/elliptic_curves.ts#L311
 *
 * Transform a big integer in big endian to minimal unsigned form which has
 * no extra zero at the beginning except when the highest bit is set.
 *
 * @param {Uint8Array} bytes
 *
 */
export function toUnsignedBigNum(bytes) {
  // Remove zero prefixes.
  let start = 0;
  while (start < bytes.length && bytes[start] == 0) {
    start++;
  }
  if (start == bytes.length) {
    start = bytes.length - 1;
  }
  let extraZero = 0;

  // If the 1st bit is not zero, add 1 zero byte.
  if ((bytes[start] & 128) == 128) {
    // Add extra zero.
    extraZero = 1;
  }
  const res = new Uint8Array(bytes.length - start + extraZero);
  res.set(bytes.subarray(start), extraZero);
  return res;
}

/**
 * Code modified from https://github.com/github/webauthn-json/blob/e932b3585fa70b0bd5b5a4012ba7dbad7b0a0d0f/src/webauthn-json/base64url.ts#L23
 * @param {string} input
 */
export const stringToBase64urlString = function (input) {
  const base64String = btoa(input);
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Convert a JSON Web Key private key to a public key and export the public
 * key in raw format.
 * @return {Uint8array}
 */
export const p256JWKPrivateToPublic = async function (jwkPrivate) {
  // make a copy so we don't modify the underlying object
  const jwkPrivateCopy = { ...jwkPrivate };
  // change jwk so it will be imported as a public key
  delete jwkPrivateCopy.d;
  jwkPrivateCopy.key_ops = ['verify'];

  const publicKey = await crypto.subtle.importKey(
    'jwk',
    jwkPrivateCopy,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify'],
  );
  const buffer = await crypto.subtle.exportKey('raw', publicKey);
  return new Uint8Array(buffer);
};

/**
 * Returns a CryptoKey from a P256 private key bytes
 * This is a bit awkward because webcrypto can't import raw private key bytes.
 * We use some custom crypto code to derive the public key from the private key bytes.
 * Note that this is NOT security sensitive because browsers validate x/y coordinate
 * when performing `crypto.subtle.importKey` operations.
 * @param {Uint8Array} privateKeyBytes
 */
export const importCredential = async function (privateKeyBytes) {
  const privateKeyHexString = uint8arrayToHexString(privateKeyBytes);
  const privateKey = BigInt('0x' + privateKeyHexString);
  const publicKeyPoint = P256Generator.multiply(privateKey);

  return await crypto.subtle.importKey(
    'jwk',
    {
      kty: 'EC',
      crv: 'P-256',
      d: bigIntToBase64Url(privateKey),
      x: bigIntToBase64Url(publicKeyPoint.x.num),
      y: bigIntToBase64Url(publicKeyPoint.y.num),
      ext: true,
    },
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign'],
  );
};

/**
 * Converts a `BigInt` into a base64url encoded string
 * @param {BigInt} num
 * @return {string}
 */
export const bigIntToBase64Url = function (num) {
  let hexString = num.toString(16);
  // Add an extra 0 to the start of the string to get a valid hex string (even length)
  // (e.g. 0x0123 instead of 0x123)
  hexString = hexString.padStart(Math.ceil(hexString.length / 2) * 2, 0);
  const buffer = uint8arrayFromHexString(hexString);
  return base64urlEncode(buffer);
};

/**
 * Converts a `BigInt` into a hex encoded string
 * @param {BigInt} num
 * @param {number} length expected length of the resulting hex string
 * @return {string}
 */
export const bigIntToHex = function (num, length) {
  const hexString = num.toString(16);
  if (hexString.length > length) {
    throw new Error(
      'number cannot fit in a hex string of ' + length + ' characters',
    );
  }
  // Add an extra 0 to the start of the string to get to `length`
  return hexString.padStart(length, 0);
};

/**
 * Accepts a public key array buffer, and returns a buffer with the compressed version of the public key
 * @param {Uint8Array} rawPublicKey
 */
export const compressRawPublicKey = function (rawPublicKey) {
  const len = rawPublicKey.byteLength;

  // Drop the y coordinate
  // Uncompressed key is in the form 0x04||x||y
  // `len >>> 1` is a more concise way to write `floor(len/2)`
  const compressedBytes = rawPublicKey.slice(0, (1 + len) >>> 1);

  // Encode the parity of `y` in first bit
  // `BYTE & 0x01` tests for parity and returns 0x00 when even, or 0x01 when odd
  // Then `0x02 | <parity test result>` yields either 0x02 (even case) or 0x03 (odd).
  compressedBytes[0] = 0x02 | (rawPublicKey[len - 1] & 0x01);
  return compressedBytes;
};

/**
 * Accepts a public key array buffer, and returns a buffer with the uncompressed version of the public key
 * @param {Uint8Array} rawPublicKey
 * @return {Uint8Array} the uncompressed bytes
 */
export const uncompressRawPublicKey = function (rawPublicKey) {
  // point[0] must be 2 (false) or 3 (true).
  // this maps to the initial "02" or "03" prefix
  const lsb = rawPublicKey[0] === 3;
  const x = BigInt('0x' + uint8arrayToHexString(rawPublicKey.subarray(1)));

  // https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-4.pdf (Appendix D).
  const p = BigInt(
    '115792089210356248762697446949407573530086143415290314195533631308867097853951',
  );
  const b = BigInt(
    '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
  );
  const a = p - BigInt(3);

  // Now compute y based on x
  const rhs = ((x * x + a) * x + b) % p;
  let y = modSqrt(rhs, p);
  if (lsb !== testBit(y, 0)) {
    y = (p - y) % p;
  }

  if (x < BigInt(0) || x >= p) {
    throw new Error('x is out of range');
  }

  if (y < BigInt(0) || y >= p) {
    throw new Error('y is out of range');
  }

  const uncompressedHexString = '04' + bigIntToHex(x, 64) + bigIntToHex(y, 64);
  return uint8arrayFromHexString(uncompressedHexString);
};

/**
 * Private helper to compute square root modulo p
 */
function modSqrt(x, p) {
  if (p <= BigInt(0)) {
    throw new Error('p must be positive');
  }
  const base = x % p;
  // The currently supported NIST curves P-256, P-384, and P-521 all satisfy
  // p % 4 == 3.  However, although currently a no-op, the following check
  // should be left in place in case other curves are supported in the future.
  if (testBit(p, 0) && /* istanbul ignore next */ testBit(p, 1)) {
    // Case p % 4 == 3 (applies to NIST curves P-256, P-384, and P-521)
    // q = (p + 1) / 4
    const q = (p + BigInt(1)) >> BigInt(2);
    const squareRoot = modPow(base, q, p);
    if ((squareRoot * squareRoot) % p !== base) {
      throw new Error('could not find a modular square root');
    }
    return squareRoot;
  }
  // Skipping other elliptic curve types that require Cipolla's algorithm.
  throw new Error('unsupported modulus value');
}

/**
 * Private helper function used by `modSqrt`
 */
function modPow(b, exp, p) {
  if (exp === BigInt(0)) {
    return BigInt(1);
  }
  let result = b;
  const exponentBitString = exp.toString(2);
  for (let i = 1; i < exponentBitString.length; ++i) {
    result = (result * result) % p;
    if (exponentBitString[i] === '1') {
      result = (result * b) % p;
    }
  }
  return result;
}

/**
 * Another private helper function used as part of `modSqrt`
 */
function testBit(n, i) {
  const m = BigInt(1) << BigInt(i);
  return (n & m) !== BigInt(0);
}

/**********************************************************************************************
 * Start of private crypto implementation for P256 public key derivation from a private key.
 * ----
 * IMPORTANT NOTE: below we implement basic field arithmetic for P256
 * This is only used to compute public point from a secret key inside of
 * `importCredential` above. If something goes wrong with the code below
 * the web crypto API will simply refuse to import the key.
 * None of the functions below are returned from the closure to minimize the risk of misuse.
 *********************************************************************************************/

/**
 * P256FieldElement represents a finite field element
 * The field is set to be the P256 prime:
 * 0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff
 */
const P256FieldElement = function (num) {
  this.num = BigInt(num);
  this.prime = BigInt(
    '0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
  );
};
P256FieldElement.prototype.eq = function (other) {
  return this.num === other.num;
};
P256FieldElement.prototype.add = function (other) {
  let num;
  num = this.num + other.num;
  return new P256FieldElement(num % this.prime);
};
P256FieldElement.prototype.sub = function (other) {
  let res = (this.num - other.num) % this.prime;
  if (res < BigInt(0)) {
    res += this.prime;
  }
  return new P256FieldElement(res);
};
P256FieldElement.prototype.mul = function (other) {
  let coefficient;
  let num;
  if (typeof other === 'bigint') {
    coefficient = other;
  } else if (typeof other === 'number') {
    coefficient = BigInt(other);
  } else if (other instanceof P256FieldElement) {
    coefficient = other.num;
  } else {
    throw new Error(
      'Cannot multiply element. Expected a BigInt, a Number or a P256FieldElement. Got: ' +
        other,
    );
  }
  num = (this.num * coefficient) % this.prime;
  return new P256FieldElement(num);
};
P256FieldElement.prototype.div = function (other) {
  // This uses fermat's little theorem (https://en.wikipedia.org/wiki/Fermat%27s_little_theorem)
  // => if p is prime, then for any integer a: a**(p-1) % p = 1
  // => we can compute inverses for any a: 1/a = a**(p-2) % p
  return new P256FieldElement(other.num)
    .pow(this.prime - BigInt(2))
    .mul(this.num);
};
P256FieldElement.prototype.pow = function (exponentInput) {
  let exponent = BigInt(exponentInput);
  let base = this.num % this.prime;
  // Pretty standard double-and-add loop
  let result = 1n;
  while (exponent > BigInt(0)) {
    if (exponent % BigInt(2)) {
      result = (result * base) % this.prime;
    }
    exponent = exponent / BigInt(2);
    base = (base * base) % this.prime;
  }
  return new P256FieldElement(result);
};

/**
 * P256Point is a point (x, y) on the following elliptic curve:
 *     y**2 = x**3 + ax + b
 *     (where x and y are both finite field elements on the P256 field)
 * https://www.secg.org/sec2-v2.pdf, https://neuromancer.sk/std/nist/P-256
 *
 * We only define + and * since that's what's needed for public key derivation.
 */
const P256Point = function (x, y) {
  if ((!x) instanceof P256FieldElement) {
    throw new Error('expected a P256FieldElement for x. Got: ' + x);
  }
  this.x = x;

  if ((!y) instanceof P256FieldElement) {
    throw new Error('expected a P256FieldElement for y. Got: ' + y);
  }
  this.y = y;
  this.a = new P256FieldElement(
    BigInt(
      '0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
    ),
  );
  this.b = new P256FieldElement(
    BigInt(
      '0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
    ),
  );

  if (this.x === null && this.y === null) {
    // Point at infinity
    return;
  }

  const left = this.y.pow(2).num;
  const right = this.x.pow(3).add(this.x.mul(this.a)).add(this.b).num;

  if (left != right) {
    // y**2 = x**3 + 7 is the elliptic curve equation
    throw new Error(
      'Not on the P256 curve! y**2 (' +
        left +
        ') != x3 + ax + b (' +
        right +
        ')',
    );
  }
};

/**
 * Addition is a complex operation because of the number of cases involved.
 * The point at infinity is represented by (x=null, y=null), and represents the logical "0".
 * So, to compute `A.add(B)`:
 * - Case 1a: if A is 0, return B (0+B=B)
 * - Case 1b: if B is 0, return A (A+0=A)
 * - Case 2: if A and B have the same x but different y coordinates, they're
 *           opposite points: B is "-A". So, A+B=A+(-A)=0 (return point at infinity)
 * - Case 3: if A and B are the same and at y=0, the A->B line is tangent to the y axis
 *           -> return point at infinity
 * - Case 4: if A and B are the same (with y≠0), the formula for the result R (x3, y3):
 *           s = (3*x1**2 + a) / 2*y1
 *           x3 = s**2 - 2*x1
 *           y3 = s*(x1 - x3) - y1
 *           -> return (x3, y3)
 * - Case 5: general case (different x coordinates). To get R (x3, y3) from A and B:
 *           s = (y2 -y1) / (x2 - x1)
 *           x3 = s**2 - x1 - x2
 *           y3 = s*(x1 - x3) - y1
 *           -> return (x3, y3)
 *
 * See https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication#Point_addition for helpful visuals
 */
P256Point.prototype.add = function (other) {
  if (this.x === null) {
    return other;
  } /* 1a */
  if (other.x === null) {
    return this;
  } /* 1b */

  /* 2 */
  if (this.x.eq(other.x) === true && this.y.eq(this.y) === false) {
    return new P256Point(null, null);
  }

  /* 3 */
  if (
    this.x.eq(other.x) &&
    this.y.eq(other.y) &&
    this.y.eq(new P256FieldElement(0))
  ) {
    return new P256Point(null, null);
  }

  let s;
  let x;
  let y;
  /* 4 */
  if (this.x.eq(other.x) && this.y.eq(other.y)) {
    s = this.x.pow(2).mul(3).add(this.a).div(this.y.mul(2));
    x = s.pow(2).sub(this.x.mul(2));
    y = s.mul(this.x.sub(x)).sub(this.y);
    return new P256Point(x, y);
  }

  /* 5 */
  if (this.x.eq(other.x) === false) {
    s = other.y.sub(this.y).div(other.x.sub(this.x));
    x = s.pow(2).sub(this.x).sub(other.x);
    y = s.mul(this.x.sub(x)).sub(this.y);
    return new P256Point(x, y);
  }

  throw new Error(
    'cannot handle addition of (' +
      this.x +
      ', ' +
      this.y +
      ') with (' +
      other.x +
      ', ' +
      other.y +
      ')',
  );
};
/**
 * Multiplication uses addition. Nothing crazy here.
 * We start with "0" (point at infinity). Then we add increasing powers of 2.
 * So, to multiply A by e.g. 25 (25 is 11001 in binary), we add 1*A, then compute
 * 2*A, 4*A, 8*A by successive additions. Then add 8*A, then compute 16*A, then
 * add 16*A.
 */
P256Point.prototype.multiply = function (coefficient) {
  let coef = BigInt(coefficient);
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let current = this;
  let result = new P256Point(null, null);
  while (coef) {
    if (coef & BigInt(1)) {
      result = result.add(current);
    }
    current = current.add(current);
    coef >>= BigInt(1);
  }
  return result;
};

/**
 * This is the P256 base point (aka generator)
 * See https://www.secg.org/sec2-v2.pdf and https://neuromancer.sk/std/nist/P-256
 */
const P256Generator = new P256Point(
  new P256FieldElement(
    BigInt(
      '0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296',
    ),
  ),
  new P256FieldElement(
    BigInt(
      '0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
    ),
  ),
);

/**********************************************************************************************
 * End of private crypto implementation for P256 public key derivation from a private key.
 *********************************************************************************************/
