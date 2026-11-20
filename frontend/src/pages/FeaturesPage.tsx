import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './FeaturesPage.module.css'
import logo from '../assets/logo.png'

const FEATURES = [
  { icon: LockIcon, title: 'Passwords', body: "Save a login once, find it in seconds. Each entry holds a title, website, username, password and notes. Cipher pulls the site's logo straight from its link, and you can reveal or copy any field in one click.", how: 'Add New → Password, fill it in, save.' },
  { icon: NoteIcon, title: 'Secure notes', body: "Keep private text safe — recovery codes, a passport number, anything you'd rather not leave in a plain notes app.", how: 'Add New → Note, type, save.' },
  { icon: StarIcon, title: 'Favorites', body: 'Pin what you reach for most. Starred items get their own view, so your daily logins stay one click away.', how: 'Open an item and tap the star, or use the ⋮ menu.' },
  { icon: SearchIcon, title: 'Search & filter', body: 'Find anything instantly by title, or narrow the list to Passwords, Notes or Favorites from the sidebar.' },
  { icon: TrashIcon, title: 'Trash', body: "Deleting moves an item to Trash first — nothing is lost by accident. Restore it anytime, or delete it permanently once you're sure." },
  { icon: DownloadIcon, title: 'Export your vault', body: 'Download a full, decrypted copy of everything as a JSON file whenever you like. Your data is always yours to take.' },
  { icon: ShieldIcon, title: 'Private by design', body: 'Everything is encrypted on your device before it ever reaches our servers — we never see your master password or your data.' },
]

export default function FeaturesPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <div className={styles.page}>
        <header className={styles.topbar}>
          <Link className={styles.brand} to="/" aria-label="Cipher home">
            <img className={styles.brandLogo} src={logo} alt="" aria-hidden="true" />
            <span className={styles.brandText}>
              <span className={styles.brandName}>Cipher</span>
              <span className={styles.brandTag}>A calmer internet</span>
            </span>
          </Link>
          <nav className={styles.navlinks} aria-label="Main navigation">
            <Link to="/features">Features</Link>
            <a href="/#security">Security</a>
            <Link to="/terms">Terms</Link>
          </nav>
          <div className={styles.navActions}>
            <Link className={styles.loginLink} to="/login">Log in</Link>
            <Link className={styles.cta} to="/register">Register</Link>
          </div>
          <button
            className={styles.menuToggle}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </header>

        <main className={styles.inner}>
          <section className={styles.hero}>
            <p className={styles.eyebrow}>Features</p>
            <h1 className={styles.title}>Everything in Cipher, explained.</h1>
            <p className={styles.lead}>A calm, private home for your passwords and notes. Here's how each piece works.</p>
          </section>

          <section className={styles.grid}>
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <article key={f.title} className={styles.card}>
                  <span className={styles.cardIcon}><Icon /></span>
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{f.title}</h2>
                    <p className={styles.cardText}>{f.body}</p>
                    {f.how && <p className={styles.how}><span>How</span>{f.how}</p>}
                  </div>
                </article>
              )
            })}
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerTop}>
              <Link className={styles.footerBrand} to="/">
                <img className={styles.footerLogo} src={logo} alt="" aria-hidden="true" />
                <span className={styles.footerBrandText}>
                  <span className={styles.footerName}>Cipher</span>
                  <span className={styles.footerTag}>Protect what matters.</span>
                </span>
              </Link>
              <nav className={styles.footerLinks}>
                <Link to="/features">Features</Link>
                <Link to="/terms">Terms</Link>
                <Link to="/login">Log in</Link>
              </nav>
            </div>
            <hr className={styles.footerDivider} />
            <p className={styles.footerCopy}>© 2026 Yuman Khoufache. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <div
        className={`${styles.drawerBackdrop} ${menuOpen ? styles.open : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <nav className={`${styles.drawer} ${menuOpen ? styles.open : ''}`} aria-label="Mobile navigation">
        <div className={styles.drawerTop}>
          <span className={styles.brandName}>Cipher</span>
          <button className={styles.drawerClose} aria-label="Close menu" onClick={closeMenu}>×</button>
        </div>
        <Link to="/features" onClick={closeMenu}>Features</Link>
        <a href="/#security" onClick={closeMenu}>Security</a>
        <Link to="/terms" onClick={closeMenu}>Terms</Link>
        <Link to="/login" className={styles.drawerLogin} onClick={closeMenu}>Log in</Link>
        <Link to="/register" className={styles.drawerCta} onClick={closeMenu}>Register</Link>
      </nav>
    </>
  )
}

function LockIcon() { return (<svg viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>) }
function NoteIcon() { return (<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6" /></svg>) }
function StarIcon() { return (<svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>) }
function SearchIcon() { return (<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>) }
function TrashIcon() { return (<svg viewBox="0 0 24 24"><path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>) }
function DownloadIcon() { return (<svg viewBox="0 0 24 24"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>) }
function ShieldIcon() { return (<svg viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>) }