import { useState } from 'react'
import styles from './VaultPage.module.css'
import logo from '../assets/logo.png'
import { useAuthStore } from '../stores/authStore'

const NAV = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'passwords', label: 'Passwords', icon: PasswordsIcon },
  { id: 'notes', label: 'Notes', icon: NotesIcon },
  { id: 'favorites', label: 'Favorites', icon: StarIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

export default function VaultPage() {
  const [active, setActive] = useState('home')
  const currentUser = useAuthStore((s) => s.user)
  const displayName = currentUser?.name || currentUser?.email || 'User'
  const initials = getInitials(displayName)

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          <div className={styles.brand}>
            <img className={styles.brandLogo} src={logo} alt="" aria-hidden="true" />
            <div>
              <div className={styles.brandName}>Cipher</div>
              <div className={styles.brandTag}>Passwords. Notes. Peace of mind.</div>
            </div>
          </div>

          <nav className={styles.nav}>
            {NAV.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  className={`${styles.navItem} ${active === item.id ? styles.navActive : ''}`}
                  onClick={() => setActive(item.id)}
                >
                  <Icon />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className={styles.secure}>
            <span className={styles.secureIcon}><LockIcon /></span>
            <div className={styles.secureText}>
              <div className={styles.secureTitle}>Your data is secure</div>
              <div className={styles.secureSub}>End-to-end encrypted</div>
            </div>
            <span className={styles.secureDot} />
          </div>
        </div>
      </aside>

      <header className={styles.header}>
        <div className={styles.search}>
          <SearchIcon />
          <input placeholder="Search passwords, notes, or categories..." />
        </div>
        <div className={styles.user}>
          <span className={styles.avatar}>{initials}</span>
          <span className={styles.userName}>{displayName}</span>
        </div>
      </header>

      <main className={styles.main}>
        <p className={styles.placeholder}>Main content — morceau 2.</p>
      </main>

      <section className={styles.detail}>
        <p className={styles.placeholder}>Item detail — morceau 2.</p>
      </section>
    </div>
  )
}

function HomeIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>)
}
function PasswordsIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M19 16v-2a2 2 0 0 0-4 0v2" /><path d="M9.5 15H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><rect x="13" y="16" width="8" height="5" rx=".899" /></svg>)
}
function NotesIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M2 6h4" /><path d="M2 10h4" /><path d="M2 14h4" /><path d="M2 18h4" /><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M9.5 8h5" /><path d="M9.5 12H16" /><path d="M9.5 16H14" /></svg>)
}
function StarIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>)
}
function SettingsIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg>)
}
function SearchIcon() {
  return (<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>)
}
function LockIcon() {
  return (<svg viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>)
}
function getInitials(value: string) {
  const parts = value.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return value.slice(0, 2).toUpperCase()
}