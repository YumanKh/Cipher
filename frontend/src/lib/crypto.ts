const ITERATIONS = 600_000

type Bytes = Uint8Array<ArrayBuffer>

export function toBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

export function fromBase64(b64: string): Bytes {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function generateKdfSalt(): Bytes {
  return crypto.getRandomValues(new Uint8Array(16))
}

export function generateCryptingKey(): Bytes {
  return crypto.getRandomValues(new Uint8Array(32))
}

export async function deriveMasterKey(password: string, kdfSalt: Bytes): Promise<ArrayBuffer> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  )
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: kdfSalt, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    256,
  )
}

export async function computeAuthValue(masterKey: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', masterKey)
  return toBase64(hash)
}

async function importWrappingKey(masterKey: ArrayBuffer, usage: KeyUsage): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', masterKey, { name: 'AES-GCM' }, false, [usage])
}

export async function wrapCryptingKey(cryptingKey: Bytes, masterKey: ArrayBuffer): Promise<string> {
  const key = await importWrappingKey(masterKey, 'encrypt')
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, cryptingKey))

  // output = iv (12 bytes) prepended to ciphertext, so unwrap can recover both
  const combined = new Uint8Array(iv.length + ct.length)
  combined.set(iv, 0)
  combined.set(ct, iv.length)
  return toBase64(combined)
}

export async function unwrapCryptingKey(wrapped: string, masterKey: ArrayBuffer): Promise<Bytes> {
  const key = await importWrappingKey(masterKey, 'decrypt')
  const combined = fromBase64(wrapped)

  // split back into iv (first 12 bytes) and ciphertext (the rest)
  const iv = combined.slice(0, 12)
  const ct = combined.slice(12)
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
  return new Uint8Array(plain)
}