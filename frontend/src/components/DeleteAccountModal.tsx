import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './EditFieldModal.module.css'
import { deleteAccount } from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import { fromBase64, deriveMasterKey, computeAuthValue } from '../lib/crypto'

type Props = { onClose: () => void }

export default function DeleteAccountModal({ onClose }: Props) {
  const navigate = useNavigate()
  const kdfSalt = useAuthStore((s) => s.kdfSalt)
  const clear = useAuthStore((s) => s.clear)
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function confirmDelete() {
    if (!kdfSalt || !password) return
    setBusy(true); setError('')
    try {
      const masterKey = await deriveMasterKey(password, fromBase64(kdfSalt))
      const authValue = await computeAuthValue(masterKey)
      await deleteAccount(authValue)
      clear()
      navigate('/login')
    } catch {
      setError('Incorrect password, or something went wrong.')
      setBusy(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Delete account</h3>
        <p className={styles.warn}>This permanently deletes your vault and account. This cannot be undone. Enter your master password to confirm.</p>
        <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Master password" autoFocus />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose} disabled={busy}>Cancel</button>
          <button className={styles.delete} onClick={confirmDelete} disabled={busy}>{busy ? 'Deleting…' : 'Delete account'}</button>
        </div>
      </div>
    </div>
  )
}