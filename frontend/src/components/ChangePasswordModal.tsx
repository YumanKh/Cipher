import { useState } from 'react'
import styles from './EditFieldModal.module.css'
import { changeMasterPassword } from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import { fromBase64, deriveMasterKey, computeAuthValue, wrapCryptingKey, unwrapCryptingKey } from '../lib/crypto'

type Props = { onClose: () => void }

export default function ChangePasswordModal({ onClose }: Props) {
  const wrappedKey = useAuthStore((s) => s.wrappedKey)
  const kdfSalt = useAuthStore((s) => s.kdfSalt)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    if (!wrappedKey || !kdfSalt) return
    if (next.length < 12) { setError('New password must be at least 12 characters.'); return }
    if (next !== confirm) { setError('New passwords do not match.'); return }
    setBusy(true); setError('')
    try {
      const salt = fromBase64(kdfSalt)
      const currentMasterKey = await deriveMasterKey(current, salt)

      const rawKey = await unwrapCryptingKey(wrappedKey, currentMasterKey).catch(() => null)
      if (!rawKey) { setError('Current password is incorrect.'); setBusy(false); return }

      const currentAuthValue = await computeAuthValue(currentMasterKey)
      const newMasterKey = await deriveMasterKey(next, salt)
      const newAuthValue = await computeAuthValue(newMasterKey)
      const newWrappedKey = await wrapCryptingKey(rawKey, newMasterKey)

      await changeMasterPassword({ currentAuthValue, newAuthValue, cryptingKey: newWrappedKey })

      useAuthStore.setState({ wrappedKey: newWrappedKey })
      onClose()
    } catch {
      setError('Could not change password. Try again.')
      setBusy(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Change master password</h3>
        <div className={styles.fields}>
          <label className={styles.label}>Current password
            <input className={styles.input} type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoFocus />
          </label>
          <label className={styles.label}>New password
            <input className={styles.input} type="password" value={next} onChange={(e) => setNext(e.target.value)} />
          </label>
          <label className={styles.label}>Confirm new password
            <input className={styles.input} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </label>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose} disabled={busy}>Cancel</button>
          <button className={styles.save} onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Change password'}</button>
        </div>
      </div>
    </div>
  )
}