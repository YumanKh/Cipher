import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './FeaturesPage.module.css'
import logo from '../assets/logo.png'

const POINTS = [
  { icon: EyeOffIcon, title: 'Zero-knowledge by default', body: "Your passwords and notes are encrypted on your device before they ever leave it. Our servers only ever hold encrypted blobs, we can't read your data, and neither can anyone who breaches our servers." },
  { icon: KeyIcon, title: "Your account's password never leaves your device.", body: 'We never receive it. Your device uses it to derive an encryption key locally, so the password itself is never sent, stored or seen by us.' },
  { icon: LockIcon, title: 'AES-256 encryption', body: 'Every item is sealed with AES-256-GCM, the standard trusted by banks and governments. Each entry gets its own unique nonce, so no two encrypted values ever look alike.' },
  { icon: LayersIcon, title: 'Envelope encryption', body: "Your vault is locked with a random key unique to you. That key is itself wrapped by your account's password, so changing your password re-locks the vault instantly, without re-encrypting every item." },
  { icon: AlertIcon, title: "We can't recover your master password", body: "Because we never see it, there's no reset link that can unlock your vault. That's the honest trade-off of real privacy: only you hold the key, so keep it somewhere safe." },
  { icon: ShieldIcon, title: 'Secure sessions', body: "You stay signed in through a token kept in a secure httpOnly cookie that scripts can't read. Reload the app and your vault re-locks until you enter your master password again." },
]

export default function SecurityPage() {
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
            <Link to="/security">Security</Link>
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
            <p className={styles.eyebrow}>Security</p>
            <h1 className={styles.title}>How Cipher keeps your data safe.</h1>
            <p className={styles.lead}>Zero-knowledge, end-to-end encrypted. Here's exactly what that means — and what we can and can't see.</p>
          </section>

          <section className={styles.grid}>
            {POINTS.map((p) => {
              const Icon = p.icon
              return (
                <article key={p.title} className={styles.card}>
                  <span className={styles.cardIcon}><Icon /></span>
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{p.title}</h2>
                    <p className={styles.cardText}>{p.body}</p>
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
        <Link to="/security" onClick={closeMenu}>Security</Link>
        <Link to="/terms" onClick={closeMenu}>Terms</Link>
        <Link to="/login" className={styles.drawerLogin} onClick={closeMenu}>Log in</Link>
        <Link to="/register" className={styles.drawerCta} onClick={closeMenu}>Register</Link>
      </nav>
    </>
  )
}

function EyeOffIcon() { return (<svg viewBox="0 0 24 24"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>) }
function KeyIcon() { return (<svg viewBox="0 0 24 24"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L21 4" /><path d="m21 2-9.6 9.6" /><circle cx="7.5" cy="15.5" r="5.5" /></svg>) }
function LockIcon() { return (<svg viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>) }
function LayersIcon() { return (<svg viewBox="0 0 24 24"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" /></svg>) }
function AlertIcon() { return (<svg viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>) }
function ShieldIcon() { return (<svg viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>) }