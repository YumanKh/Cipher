import { useState } from 'react'
import type { FormEvent } from 'react'
import styles from './UnlockScreen.module.css'
import { useAuthStore } from '../stores/authStore'
import { deriveMasterKey, unwrapCryptingKey, fromBase64 } from '../lib/crypto'

export default function UnlockScreen() {
  const wrappedKey = useAuthStore((s) => s.wrappedKey)
  const kdfSalt = useAuthStore((s) => s.kdfSalt)
  const user = useAuthStore((s) => s.user)
  const unlock = useAuthStore((s) => s.unlock)
  const clear = useAuthStore((s) => s.clear)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!wrappedKey || !kdfSalt) return
    setBusy(true)
    setError('')
    try {
      const masterKey = await deriveMasterKey(password, fromBase64(kdfSalt))
      const cryptingKey = await unwrapCryptingKey(wrappedKey, masterKey)
      unlock(cryptingKey)
    } catch {
      setError('Wrong master password.')
      setBusy(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.card} onSubmit={submit}>
        <h1 className={styles.title}>Unlock your vault</h1>
        <p className={styles.sub}>Welcome back{user?.name ? `, ${user.name}` : ''}. Enter your master password to decrypt your vault.</p>
        <input
          className={styles.input}
          type="password"
          placeholder="Master password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.btn} type="submit" disabled={busy}>{busy ? 'Unlocking…' : 'Unlock'}</button>
        <button className={styles.logout} type="button" onClick={clear}>Log out</button>
      </form>
    </div>
  )
}