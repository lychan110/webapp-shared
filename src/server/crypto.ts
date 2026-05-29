/**
 * Server-side AES-256-GCM encrypt / decrypt utilities.
 *
 * Uses Node's built-in `crypto` module. Includes secure IV generation and
 * key derivation helpers.
 *
 * **IMPORTANT**: This module provides the *algorithm implementation* only.
 * No encryption keys are embedded in this file. Keys must be supplied by the
 * consumer via `ENCRYPTION_KEY` environment variable or passed explicitly.
 *
 * @example
 * ```ts
 * import { encrypt, decrypt } from '@lenya/webapp-shared/server/crypto';
 *
 * // Encrypt a value (key from ENCRYPTION_KEY env var)
 * const encrypted = encrypt('my-sensitive-data');
 *
 * // Decrypt it back
 * const decrypted = decrypt(encrypted); // 'my-sensitive-data'
 * ```
 *
 * @example
 * ```ts
 * import { encryptWithKey, decryptWithKey, deriveKey } from '@lenya/webapp-shared/server/crypto';
 *
 * // Derive a 32-byte key from a passphrase
 * const key = deriveKey('my-passphrase', 'some-salt');
 *
 * const encrypted = encryptWithKey('secret', key);
 * const decrypted = decryptWithKey(encrypted, key);
 * ```
 */

import * as crypto from 'node:crypto';

// ── Constants ───────────────────────────────────────────────────────────────

/** AES-256-GCM algorithm identifier. */
const ALGORITHM = 'aes-256-gcm';

/** IV length in bytes (16 bytes = 128 bits for GCM). */
const IV_LENGTH = 16;

/** Auth tag length in bytes (16 bytes = 128 bits). */
const TAG_LENGTH = 16;

/** Required key length in bytes (32 bytes = 256 bits). */
const KEY_LENGTH = 32;

// ── Key resolution ──────────────────────────────────────────────────────────

/**
 * Resolve the encryption key from the `ENCRYPTION_KEY` environment variable.
 *
 * Pads or truncates to exactly 32 bytes for AES-256.
 *
 * @throws If `ENCRYPTION_KEY` is not set.
 */
export function resolveKeyFromEnv(): Buffer {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      'Crypto: ENCRYPTION_KEY environment variable is not set. ' +
      'Set it to a 32-byte (or longer) secret passphrase.',
    );
  }
  return normalizeKey(raw);
}

/**
 * Normalise a passphrase to exactly 32 bytes for use as an AES-256 key.
 *
 * - If the input is exactly 32 bytes, returns it as-is.
 * - If shorter, pads with zero bytes.
 * - If longer, truncates to 32 bytes.
 */
export function normalizeKey(passphrase: string | Buffer): Buffer {
  const key = Buffer.isBuffer(passphrase) ? passphrase : Buffer.from(passphrase, 'utf8');
  if (key.length === KEY_LENGTH) return key;

  const padded = Buffer.alloc(KEY_LENGTH);
  key.copy(padded, 0, 0, Math.min(key.length, KEY_LENGTH));
  return padded;
}

/**
 * Derive a 32-byte key from a passphrase and salt using PBKDF2.
 *
 * @param passphrase - The secret passphrase.
 * @param salt - A unique salt (should be at least 16 bytes for production use).
 * @param iterations - Number of PBKDF2 iterations (default: 100000).
 */
export function deriveKey(
  passphrase: string | Buffer,
  salt: string | Buffer,
  iterations = 100_000,
): Buffer {
  const pass = Buffer.isBuffer(passphrase) ? passphrase : Buffer.from(passphrase, 'utf8');
  const slt = Buffer.isBuffer(salt) ? salt : Buffer.from(salt, 'utf8');

  return crypto.pbkdf2Sync(pass, slt, iterations, KEY_LENGTH, 'sha256');
}

// ── Encrypt / Decrypt (env-based key) ────────────────────────────────────────

/**
 * Encrypt a string using AES-256-GCM.
 *
 * Key is resolved from the `ENCRYPTION_KEY` environment variable.
 * Returns a base64-encoded string containing: `iv + authTag + ciphertext`.
 */
export function encrypt(plaintext: string): string {
  const key = resolveKeyFromEnv();
  return encryptWithKey(plaintext, key);
}

/**
 * Decrypt a string encrypted with AES-256-GCM.
 *
 * Key is resolved from the `ENCRYPTION_KEY` environment variable.
 * Expects the base64-encoded format produced by `encrypt()`:
 * `iv + authTag + ciphertext`.
 */
export function decrypt(encryptedToken: string): string {
  const key = resolveKeyFromEnv();
  return decryptWithKey(encryptedToken, key);
}

// ── Encrypt / Decrypt (explicit key) ────────────────────────────────────────

/**
 * Encrypt a string using AES-256-GCM with an explicit key.
 *
 * @param plaintext - The string to encrypt.
 * @param key - A 32-byte Buffer key. Will be normalised if not exactly 32 bytes.
 * @returns Base64-encoded string: `iv (16) + authTag (16) + ciphertext (variable)`.
 */
export function encryptWithKey(plaintext: string, key: Buffer): string {
  const normalizedKey = normalizeKey(key);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, normalizedKey, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Combine iv + authTag + encrypted data
  const combined = Buffer.concat([iv, authTag, encrypted]);
  return combined.toString('base64');
}

/**
 * Decrypt a string using AES-256-GCM with an explicit key.
 *
 * @param encryptedToken - Base64-encoded string in the format produced by `encryptWithKey()`.
 * @param key - A 32-byte Buffer key. Will be normalised if not exactly 32 bytes.
 * @returns The original plaintext string.
 */
export function decryptWithKey(encryptedToken: string, key: Buffer): string {
  const normalizedKey = normalizeKey(key);
  const combined = Buffer.from(encryptedToken, 'base64');

  if (combined.length < IV_LENGTH + TAG_LENGTH) {
    throw new Error(
      `Crypto: encrypted payload too short (${combined.length} bytes). ` +
      `Expected at least ${IV_LENGTH + TAG_LENGTH} bytes.`,
    );
  }

  // Extract components
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, normalizedKey, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
