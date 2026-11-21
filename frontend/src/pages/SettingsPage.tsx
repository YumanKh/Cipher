import { useNavigate, Link } from 'react-router-dom'
import styles from './SettingsPage.module.css'
import { useAuthStore } from '../stores/authStore'
import logo from '../assets/logo.png'
import { useState } from 'react'
import EditFieldModal from '../components/EditFieldModal'
import ChangePasswordModal from '../components/ChangePasswordModal'
import DeleteAccountModal from '../components/DeleteAccountModal'
import ExportConfirmModal from '../components/ExportConfirmModal'

export default function SettingsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [edit, setEdit] = useState<{ field: 'name' | 'email'; label: string; current: string } | null>(null)
  const [changePwd, setChangePwd] = useState(false)
  const [del, setDel] = useState(false)
  const [showExport, setShowExport] = useState(false)

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <button className={styles.back} onClick={() => navigate('/vault')}><BackIcon /> Back to vault</button>

        <section className={styles.hero}>
          <h1>Settings</h1>
          <p>Customize your Cipher experience.</p>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.headIcon}><UserIcon /></span>
            <div><h2>Profile</h2><p>Your account details.</p></div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowCopy}><strong>Name</strong><small>{user?.name ?? '—'}</small></div>
            <button className={styles.rowBtn} onClick={() => setEdit({ field: 'name', label: 'Name', current: user?.name ?? '' })}>Edit</button>
          </div>
          <div className={styles.row}>
            <div className={styles.rowCopy}><strong>Email</strong><small>{user?.email ?? '—'}</small></div>
            <button className={styles.rowBtn} onClick={() => setEdit({ field: 'email', label: 'Email', current: user?.email ?? '' })}>Edit</button>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.headIcon}><ShieldIcon /></span>
            <div><h2>Security</h2><p>Keep your vault safe.</p></div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowCopy}><strong>Master Password</strong><small>Change your password</small></div>
            <button className={styles.rowBtn} onClick={() => setChangePwd(true)}>Change</button>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={styles.headIcon}><DatabaseIcon /></span>
            <div><h2>Data</h2><p>Manage your data.</p></div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowCopy}><strong>Export Vault</strong><small>Download your decrypted data as JSON</small></div>
            <button className={styles.rowBtn} onClick={() => setShowExport(true)}>Export</button>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <span className={`${styles.headIcon} ${styles.danger}`}><TrashIcon /></span>
            <div><h2>Account</h2><p>Irreversible actions.</p></div>
          </div>
          <div className={styles.row}>
            <div className={styles.rowCopy}><strong>Delete account</strong><small>Permanently delete your vault and account</small></div>
            <button className={`${styles.rowBtn} ${styles.dangerBtn}`} onClick={() => setDel(true)}>Delete</button>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <img className={styles.footerLogo} src={logo} alt="" aria-hidden="true" />
              <span className={styles.footerBrandText}>
                <span className={styles.footerName}>Cipher</span>
                <span className={styles.footerTag}>Protect what matters.</span>
              </span>
            </div>
            <nav className={styles.footerLinks}>
              <Link to="/privacy" target="_blank" rel="noreferrer">Privacy</Link>
              <Link to="/security" target="_blank" rel="noreferrer">Security</Link>
              <Link to="/terms" target="_blank" rel="noreferrer">Terms</Link>
            </nav>
          </div>
          <hr className={styles.footerDivider} />
          <p className={styles.footerCopy}>© 2026 Yuman Khoufache. All rights reserved.</p>
        </div>
      </footer>

      {edit && <EditFieldModal field={edit.field} label={edit.label} current={edit.current} onClose={() => setEdit(null)} />}
      {changePwd && <ChangePasswordModal onClose={() => setChangePwd(false)} />}
      {del && <DeleteAccountModal onClose={() => setDel(false)} />}
      {showExport && <ExportConfirmModal onClose={() => setShowExport(false)} />}
    </div>
  )
}

function BackIcon() { return (<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>) }
function UserIcon() { return (<svg viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>) }
function ShieldIcon() { return (<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>) }
function DatabaseIcon() { return (<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" /><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" /></svg>) }
function TrashIcon() { return (<svg viewBox="0 0 24 24"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>) }