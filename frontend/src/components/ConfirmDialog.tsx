import styles from './ConfirmDialog.module.css'

type Props = {
  title: string
  message: string
  confirmLabel?: string
  busyLabel?: string
  tone?: 'danger' | 'neutral'
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', busyLabel = 'Working…', tone = 'danger', busy, onConfirm, onCancel }: Props) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>Cancel</button>
          <button className={`${styles.confirm} ${tone === 'neutral' ? styles.confirmNeutral : ''}`} onClick={onConfirm} disabled={busy}>{busy ? busyLabel : confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}