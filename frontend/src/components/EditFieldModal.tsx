import { useState } from 'react'
import styles from './EditFieldModal.module.css'
import { updateProfile } from '../lib/api'
import { useAuthStore } from '../stores/authStore'

type Props = {
  field: 'name' | 'email'
  label: string
  current: string
  onClose: () => void
}

export default function EditFieldModal({ field, label, current, onClose }: Props) {
  const patchUser = useAuthStore((s) => s.patchUser)
  const [value, setValue] = useState(current)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    const trimmed = value.trim()
    if (!trimmed || trimmed === current) { onClose(); return }
    setBusy(true); setError('')
    try {
      const payload = field === 'name' ? { name: trimmed } : { email: trimmed }
      await updateProfile(payload)
      patchUser(payload)
      onClose()
    } catch {
      setError(field === 'email' ? 'Invalid email, or already in use.' : 'Name must be 3–15 characters.')
      setBusy(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Edit {label}</h3>
        <input
          className={styles.input}
          type={field === 'email' ? 'email' : 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose} disabled={busy}>Cancel</button>
          <button className={styles.save} onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}