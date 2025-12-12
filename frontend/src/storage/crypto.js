function toBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function fromBase64(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function generateSaltBase64(byteLength = 16) {
  const salt = new Uint8Array(byteLength);
  crypto.getRandomValues(salt);
  return toBase64(salt);
}

export async function derivePinHashBase64(pin, saltBase64, iterations = 100_000) {
  if (!crypto?.subtle) {
    throw new Error('WebCrypto is not available in this browser');
  }

  const enc = new TextEncoder();
  const saltBytes = fromBase64(saltBase64);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(String(pin)),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return toBase64(new Uint8Array(bits));
}


