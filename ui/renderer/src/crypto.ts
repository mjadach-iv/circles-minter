// Web Crypto API AES-256-CBC compatible functions for browser/React
// Note: Web Crypto uses AES-GCM or AES-CBC, but key derivation and encoding are different from Node.js

// Helper: Convert string to ArrayBuffer
function str2ab(str: string): ArrayBuffer {
  return new TextEncoder().encode(str);
}

// Helper: Convert ArrayBuffer to hex string
function ab2hex(buffer: ArrayBuffer): string {
  return Array.prototype.map.call(new Uint8Array(buffer), (x: number) => ('00' + x.toString(16)).slice(-2)).join('');
}

// Helper: Convert hex string to ArrayBuffer
function hex2ab(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
}

// Derive a key from password using PBKDF2
async function deriveKey(secret: string, salt: string = 'salt') {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt
export async function encryptString(input: string, secret: string): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(secret);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    str2ab(input)
  );
  return '1:' + ab2hex(iv.buffer) + ':' + ab2hex(encrypted);
}

// Decrypt
export async function decryptString(encrypted: string, secret: string): Promise<string> {
  const [version, ivHex, encryptedData] = encrypted.split(':');
  const iv = new Uint8Array(hex2ab(ivHex));
  const key = await deriveKey(secret);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    hex2ab(encryptedData)
  );
  return new TextDecoder().decode(decrypted);
}
