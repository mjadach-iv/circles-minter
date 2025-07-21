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
    return iv.toString('hex') + ':' + encrypted;
}

// Decrypt
export function decryptJson(encrypted, password) {
    const passwordProtect = !!password;
    const secretTMP = secret + (passwordProtect ? password : '');
    const [ivHex, encryptedData] = encrypted.split(':');
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