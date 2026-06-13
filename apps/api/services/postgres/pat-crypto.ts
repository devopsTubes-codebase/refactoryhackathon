import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

import { getBackendConfig } from '../../config';

export interface EncryptedText {
  encryptedText: string;
  ivHex: string;
  authTagHex: string;
}

function getKey(): Buffer {
  return createHash('sha256').update(getBackendConfig().encryption.secretKey).digest();
}

export function encryptText(value: string): EncryptedText {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return {
    encryptedText: encrypted.toString('base64'),
    ivHex: iv.toString('hex'),
    authTagHex: cipher.getAuthTag().toString('hex'),
  };
}

export function decryptText(value: EncryptedText): string {
  const decipher = createDecipheriv('aes-256-gcm', getKey(), Buffer.from(value.ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(value.authTagHex, 'hex'));
  return Buffer.concat([
    decipher.update(Buffer.from(value.encryptedText, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
