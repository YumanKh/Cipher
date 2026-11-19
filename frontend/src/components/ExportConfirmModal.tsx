import { useState } from 'react'
import styles from './EditFieldModal.module.css'
import { exportVault } from '../lib/exportVault'
import { useAuthStore } from '../stores/authStore'

type Props = { onClose: () => void }

export default function ExportConfirmModal({ onClose }: Props) {
  const cryptingKey = useAuthStore((s) => s.cryptingKey)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function download() {
    if (!cryptingKey) return
    setBusy(true); setError('')
    try {
      await exportVault(cryptingKey)
      onClose()
    } catch {
      setError('Export failed. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Export your vault</h3>
        <p className={styles.warn}>
          This file will contain all your passwords and notes <strong>in plain text</strong>, fully decrypted.
          Anyone who opens it can read everything. Store it somewhere safe and delete it when you're done.
        </p>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose} disabled={busy}>Cancel</button>
          <button className={styles.save} onClick={download} disabled={busy}>{busy ? 'Exporting…' : 'I understand, download'}</button>
        </div>
      </div>
    </div>
  )
}