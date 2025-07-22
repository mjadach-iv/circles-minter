import crypto from 'crypto';
import 'dotenv/config'

const secret = process.env.ENCRYPT_SECRET;
const algorithm = 'aes-256-cbc';

// Encrypt
export function encryptJson(json, password) {
    const passwordProtect = !!password;
    const secretTMP = secret + (passwordProtect ? password : '');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, crypto.scryptSync(secretTMP, 'salt', 32), iv);
    let encrypted = cipher.update(JSON.stringify(json), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return '1:' + iv.toString('hex') + ':' + encrypted;
}

// Decrypt
export function decryptJson(encrypted, password) {
    const passwordProtect = !!password;
    const secretTMP = secret + (passwordProtect ? password : '');
    const [version, ivHex, encryptedData] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, crypto.scryptSync(secretTMP, 'salt', 32), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}

// Test if the secret/password is correct for decryption
export function testSecret(encrypted, password) {
    try {
        const passwordProtect = !!password;
        const secretTMP = secret + (passwordProtect ? password : '');
        decryptJson(encrypted, secretTMP);
        return true;
    } catch (e) {
        return false;
    }
}

export function generateSecret() {
    const randomString = crypto.randomBytes(16).toString('hex'); // 32 hex chars
    return randomString; // Return the newly generated secret
}

// Helper: Convert hex string to ArrayBuffer
function hex2ab(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
}

// Derive a key from password using PBKDF2
async function deriveKey(secret, salt = 'salt') {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
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

// Decrypt
export async function decryptString(encrypted, secret) {
  const [version, ivHex, encryptedData] = encrypted.split(':');
  const iv = new Uint8Array(hex2ab(ivHex));
  const key = await deriveKey(secret);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    hex2ab(encryptedData)
  );
  return new TextDecoder().decode(decrypted);
}
