import { useNavigate } from 'react-router-dom'
import styles from './SettingsPage.module.css'
import { useAuthStore } from '../stores/authStore'
import logo from '../assets/logo.png'
import poster from '../assets/settings-poster.png'

export default function SettingsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <main className={styles.content}>
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
              <button className={styles.rowBtn}>Edit</button>
            </div>
            <div className={styles.row}>
              <div className={styles.rowCopy}><strong>Email</strong><small>{user?.email ?? '—'}</small></div>
              <button className={styles.rowBtn}>Edit</button>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.headIcon}><ShieldIcon /></span>
              <div><h2>Security</h2><p>Keep your vault safe.</p></div>
            </div>
            <div className={styles.row}>
              <div className={styles.rowCopy}><strong>Master Password</strong><small>Change your master password</small></div>
              <button className={styles.rowBtn}>Change</button>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.headIcon}><DatabaseIcon /></span>
              <div><h2>Data</h2><p>Manage your data.</p></div>
            </div>
            <div className={styles.row}>
              <div className={styles.rowCopy}><strong>Export Vault</strong><small>Download your decrypted data as JSON</small></div>
              <button className={styles.rowBtn}>Export</button>
            </div>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={`${styles.headIcon} ${styles.danger}`}><TrashIcon /></span>
              <div><h2>Account</h2><p>Irreversible actions.</p></div>
            </div>
            <div className={styles.row}>
              <div className={styles.rowCopy}><strong>Delete account</strong><small>Permanently delete your vault and account</small></div>
              <button className={`${styles.rowBtn} ${styles.dangerBtn}`}>Delete</button>
            </div>
          </section>
        </main>

        <aside className={styles.side}>
          <section className={styles.brandCard}>
            <img className={styles.brandBg} src={poster} alt="" aria-hidden="true" />
            <div className={styles.brandOverlay}>
              <div className={styles.brandTop}>
                <img className={styles.brandShield} src={logo} alt="" aria-hidden="true" />
                <h2 className={styles.brandTitle}>Cipher</h2>
                <p className={styles.brandTagline}>Your vault. Your control.</p>
              </div>
              <div className={styles.brandBottom}>
                <div className={styles.brandVersion}>Version 1.0.0 <span className={styles.brandDot} /> Up to date</div>
                <div className={styles.brandLinks}>
                  <button className={styles.brandLink}><BookIcon /> Help &amp; Support <span className={styles.brandArrow}>›</span></button>
                  <button className={styles.brandLink}><FileIcon /> Privacy Policy <span className={styles.brandArrow}>›</span></button>
                  <button className={styles.brandLink}><InfoIcon /> About Cipher <span className={styles.brandArrow}>›</span></button>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

function BackIcon() { return (<svg viewBox="0 0 24 24"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>) }
function UserIcon() { return (<svg viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>) }
function ShieldIcon() { return (<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>) }
function DatabaseIcon() { return (<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" /><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" /></svg>) }
function TrashIcon() { return (<svg viewBox="0 0 24 24"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>) }
function BookIcon() { return (<svg viewBox="0 0 24 24"><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></svg>) }
function FileIcon() { return (<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6" /></svg>) }
function InfoIcon() { return (<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>) }