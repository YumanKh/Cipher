import { useState } from 'react'
import type { FormEvent } from 'react'
import styles from './AddItemModal.module.css'
import { useCreateItem, type NewItem } from '../hooks/useCreateItem'
import { useUpdateItem, type UpdateItem } from '../hooks/useUpdateItem'

export type EditTarget = {
  id: number
  type: 'Password' | 'Note'
  title: string
  link: string | null
  username?: string
  password?: string
  notes?: string
  content?: string
}

export default function AddItemModal({ onClose, item }: { onClose: () => void; item?: EditTarget }) {
  const isEdit = !!item
  const [type, setType] = useState<'Password' | 'Note'>(item?.type ?? 'Password')
  const [title, setTitle] = useState(item?.title ?? '')
  const [link, setLink] = useState(item?.link ?? '')
  const [username, setUsername] = useState(item?.username ?? '')
  const [password, setPassword] = useState(item?.password ?? '')
  const [notes, setNotes] = useState(item?.notes ?? '')
  const [content, setContent] = useState(item?.content ?? '')
  const [showPwd, setShowPwd] = useState(false)

  const create = useCreateItem()
  const update = useUpdateItem()
  const mutation = isEdit ? update : create

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (isEdit && item) {
      const payload: UpdateItem =
        type === 'Password'
          ? { type, id: item.id, title, link: link || undefined, username, password, notes }
          : { type, id: item.id, title, content }
      update.mutate(payload, { onSuccess: onClose })
    } else {
      const payload: NewItem =
        type === 'Password'
          ? { type, title, link: link || undefined, username, password, notes }
          : { type, title, content }
      create.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <h2 className={styles.title}>{isEdit ? 'Edit' : 'Add new'} {type.toLowerCase()}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
        </div>

        {!isEdit && (
          <div className={styles.typeToggle}>
            <button type="button" className={`${styles.typeBtn} ${type === 'Password' ? styles.typeActive : ''}`} onClick={() => setType('Password')}>Password</button>
            <button type="button" className={`${styles.typeBtn} ${type === 'Note' ? styles.typeActive : ''}`} onClick={() => setType('Note')}>Note</button>
          </div>
        )}

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
                <div className={styles.inputWrap}>
                  <input className={styles.input} type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className={styles.eye} onClick={() => setShowPwd((s) => !s)} aria-label="Reveal">{showPwd ? <EyeIcon /> : <EyeOffIcon />}</button>
                </div>
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

          {mutation.isError && <p className={styles.error}>Something went wrong. Try again.</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.save} disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EyeIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>)
}
function EyeOffIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>)
}