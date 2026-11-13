import { useState } from 'react'
import type { FormEvent } from 'react'
import styles from './AddItemModal.module.css'
import { useCreateItem, type NewItem } from '../hooks/useCreateItem'

export default function AddItemModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<'Password' | 'Note'>('Password')
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notes, setNotes] = useState('')
  const [content, setContent] = useState('')

  const create = useCreateItem()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const item: NewItem =
      type === 'Password'
        ? { type, title, link: link || undefined, username, password, notes }
        : { type, title, content }
    create.mutate(item, { onSuccess: onClose })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <h2 className={styles.title}>Add new {type.toLowerCase()}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className={styles.typeToggle}>
          <button type="button" className={`${styles.typeBtn} ${type === 'Password' ? styles.typeActive : ''}`} onClick={() => setType('Password')}>Password</button>
          <button type="button" className={`${styles.typeBtn} ${type === 'Note' ? styles.typeActive : ''}`} onClick={() => setType('Note')}>Note</button>
        </div>

        <form className={styles.form} onSubmit={submit}>
          <label className={styles.field}>
            <span className={styles.label}>Title</span>
            <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          {type === 'Password' ? (
            <>
              <label className={styles.field}>
                <span className={styles.label}>Website</span>
                <input className={styles.input} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Username</span>
                <input className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Password</span>
                <input className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Notes</span>
                <textarea className={styles.textarea} value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </label>
            </>
          ) : (
            <label className={styles.field}>
              <span className={styles.label}>Content</span>
              <textarea className={styles.textarea} value={content} onChange={(e) => setContent(e.target.value)} rows={5} required />
            </label>
          )}

          {create.isError && <p className={styles.error}>Something went wrong. Try again.</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.save} disabled={create.isPending}>
              {create.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}