import { useState } from 'react'
import styles from './VaultPage.module.css'
import logo from '../assets/logo.png'
import { useAuthStore } from '../stores/authStore'
import { useVaultItems } from '../hooks/useVaultItems'
import AddItemModal from '../components/AddItemModal'

const NAV = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'passwords', label: 'Passwords', icon: PasswordsIcon },
  { id: 'notes', label: 'Notes', icon: NotesIcon },
  { id: 'favorites', label: 'Favorites', icon: StarIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
]

type DecryptedFields = { username?: string; password?: string; notes?: string }

export default function VaultPage() {
  const [active, setActive] = useState('home')
  const currentUser = useAuthStore((s) => s.user)
  const displayName = currentUser?.name || currentUser?.email || 'User'
  const initials = getInitials(displayName)
  const [filter, setFilter] = useState<'all' | 'passwords' | 'notes'>('all')
  const firstName = displayName.split(/[\s@]/)[0]

  const { items, isLoading } = useVaultItems()
  const passwordsCount = items.filter((i) => i.type === 'Password').length
  const notesCount = items.filter((i) => i.type === 'Note').length
  const favoritesCount = items.filter((i) => i.isFavorite).length
  const recent = items.filter((i) =>
    filter === 'all' ||
    (filter === 'passwords' && i.type === 'Password') ||
    (filter === 'notes' && i.type === 'Note'),
  )

  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const selected = items.find((i) => `${i.type}-${i.id}` === selectedKey) ?? null
  const [showPwd, setShowPwd] = useState(false)
  const copy = (text: string) => navigator.clipboard.writeText(text)
  const [decrypted] = useState<DecryptedFields | null>(null)
  const [showAdd, setShowAdd] = useState(false)

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
        <section className={styles.welcome}>
          <div className={styles.welcomeText}>
            <p className={styles.welcomeEyebrow}>Welcome back,</p>
            <h1 className={styles.welcomeTitle}>{getGreeting()}, {firstName}</h1>
            <p className={styles.welcomeSub}>Your vault is organized and ready.</p>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.statGreen}`}><LockIcon /></span>
            <div><div className={styles.statNum}>{passwordsCount}</div><div className={styles.statLabel}>Passwords</div></div>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.statBlue}`}><NotesIcon /></span>
            <div><div className={styles.statNum}>{notesCount}</div><div className={styles.statLabel}>Notes</div></div>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.statGold}`}><StarIcon /></span>
            <div><div className={styles.statNum}>{favoritesCount}</div><div className={styles.statLabel}>Favorites</div></div>
          </div>
          <button className={styles.addNew} onClick={() => setShowAdd(true)}><PlusIcon /> Add New</button>
        </section>

        <section className={styles.recent}>
          <div className={styles.recentHead}>
            <h2 className={styles.recentTitle}>Recent Items</h2>
            <div className={styles.tabs}>
              {(['all', 'passwords', 'notes'] as const).map((t) => (
                <button
                  key={t}
                  className={`${styles.tab} ${filter === t ? styles.tabActive : ''}`}
                  onClick={() => setFilter(t)}
                >
                  {t === 'all' ? 'All' : t === 'passwords' ? 'Passwords' : 'Notes'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.itemList}>
            {isLoading ? (
              <div className={styles.placeholder} style={{ padding: 18 }}>Loading…</div>
            ) : recent.length === 0 ? (
              <div className={styles.placeholder} style={{ padding: 18 }}>No items yet.</div>
            ) : (
              recent.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  className={styles.item}
                  onClick={() => setSelectedKey(`${item.type}-${item.id}`)}
                >
                  <span className={styles.itemIcon}>{item.title[0]}</span>
                  <span className={styles.itemMain}>
                    <span className={styles.itemName}>{item.title}</span>
                    {item.link && <span className={styles.itemSub}>{item.link}</span>}
                  </span>
                  <span className={`${styles.badge} ${item.type === 'Password' ? styles.badgePwd : styles.badgeNote}`}>
                    {item.type}
                  </span>
                  <span className={styles.itemMenu}><DotsIcon /></span>
                </button>
              ))
            )}
          </div>
        </section>
      </main>

      <section className={styles.detail}>
        {!selected ? (
          <div className={styles.placeholder} style={{ padding: 24 }}>Select an item to view its details.</div>
        ) : (
          <>
            <div className={styles.detailCard}>
              <div className={styles.detailHead}>
                <span className={styles.detailIcon}>{selected.title[0]}</span>
                <div className={styles.detailTitle}>
                  <div className={styles.detailName}>{selected.title}</div>
                  {selected.link && <div className={styles.detailDomain}>{selected.link}</div>}
                  <span className={`${styles.badge} ${selected.type === 'Password' ? styles.badgePwd : styles.badgeNote}`}>{selected.type}</span>
                </div>
                <button className={`${styles.iconBtn} ${selected.isFavorite ? styles.starBtn : ''}`} aria-label="Favorite"><StarIcon /></button>
                <button className={styles.iconBtn} aria-label="More"><DotsIcon /></button>
              </div>

              <div className={styles.fields}>
                {decrypted && (
                  <>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>Username</div>
                      <div className={styles.fieldRow}>
                        <span className={styles.fieldValue}>{decrypted.username}</span>
                        <button className={styles.copyBtn} onClick={() => copy(decrypted.username ?? '')} aria-label="Copy"><CopyIcon /></button>
                      </div>
                    </div>
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>Password</div>
                      <div className={styles.fieldRow}>
                        <span className={styles.fieldValue}>{showPwd ? decrypted.password : '••••••••••••'}</span>
                        <button className={styles.copyBtn} onClick={() => setShowPwd((s) => !s)} aria-label="Reveal">{showPwd ? <EyeIcon /> : <EyeOffIcon />}</button>
                        <button className={styles.copyBtn} onClick={() => copy(decrypted.password ?? '')} aria-label="Copy"><CopyIcon /></button>
                      </div>
                    </div>
                  </>
                )}

                {!decrypted && (
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Encrypted content</div>
                    <div className={styles.fieldRow}>
                      <span className={styles.fieldValue}>Will decrypt once wired</span>
                    </div>
                  </div>
                )}

                {selected.link && (
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Website</div>
                    <div className={styles.fieldRow}>
                      <a className={styles.fieldLink} href={selected.link} target="_blank" rel="noreferrer">{selected.link}</a>
                      <a className={styles.copyBtn} href={selected.link} target="_blank" rel="noreferrer" aria-label="Open"><ExternalIcon /></a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.notesCard}>
              <div className={styles.notesHead}>
                <span className={styles.notesHeadLeft}><NotesIcon /> Notes</span>
                <ChevronIcon />
              </div>
              <p className={styles.notesText}>{decrypted?.notes ?? 'Encrypted — will appear once decryption is wired.'}</p>
            </div>

            <div className={styles.detailActions}>
              <button className={styles.editBtn}><EditIcon /> Edit</button>
              <button className={styles.deleteBtn}><TrashIcon /> Delete</button>
            </div>

            <div className={styles.detailBanner} aria-hidden="true" />
          </>
        )}
      </section>

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} />}
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
function PlusIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M5 12h14" /><path d="M12 5v14" /></svg>)
}
function DotsIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>)
}
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
function CopyIcon() {
  return (<svg viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>)
}
function EyeIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>)
}
function EyeOffIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>)
}
function ExternalIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>)
}
function ChevronIcon() {
  return (<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>)
}
function EditIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>)
}
function TrashIcon() {
  return (<svg viewBox="0 0 24 24"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>)
}