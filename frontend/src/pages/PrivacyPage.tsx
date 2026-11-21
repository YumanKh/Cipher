import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './FeaturesPage.module.css'
import logo from '../assets/logo.png'

const SECTIONS = [
  { title: 'Overview', body: "This policy explains what information Cipher handles, what it can and can't see, and the choices you have. In short: your passwords and notes are encrypted on your device, and Cipher is built so that we can't read them." },
  { title: 'What we collect', body: 'To run your account, we store your name, your email address, and your encrypted data (passwords and notes, kept as unreadable encrypted blobs). We keep this to the minimum needed for the service to work.' },
  { title: "What we can't see", body: "Your passwords and notes are encrypted on your device with your master password before they ever reach our servers. We never receive your master password, and we cannot decrypt or read your vault — it's zero-knowledge by design." },
  { title: 'How your data is protected', body: 'Your data is sealed with AES-256 and locked behind a key derived from your master password. You can read the full technical breakdown on the Security page.' },
  { title: 'Cookies', body: 'We use a single secure, httpOnly cookie to keep you signed in. It is strictly functional — there are no advertising cookies and no third-party tracking.' },
  { title: 'No selling, no ads', body: "We don't sell, rent or share your personal data, and we don't run ads or hand your information to advertisers. There is no business model built on your data here." },
  { title: 'Your rights', body: 'Your data is yours. You can export a full copy of your vault, or permanently delete your account and everything in it, at any time from Settings.' },
  { title: 'Data retention', body: 'We keep your account data for as long as your account exists. When you delete your account, your data is permanently removed.' },
  { title: 'Changes to this policy', body: 'We may update this policy from time to time. The \u201cLast updated\u201d date above shows the latest version.' },
  { title: 'Contact', body: 'Questions about your privacy? Reach out through the project\u2019s GitHub repository at github.com/YumanKh/Cipher.' },
]

export default function PrivacyPage() {
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
          <div className={styles.docHead}>
            <p className={styles.eyebrow}>Legal</p>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.updated}>Last updated: November 2026</p>
          </div>

          <div className={styles.note}>
            Cipher is a personal, student portfolio project built by Yuman Khoufache to learn and demonstrate secure web development. It is not a commercial product or a registered company. This policy is written in plain language for learning purposes, not as legal advice.
          </div>

          <div className={styles.doc}>
            {SECTIONS.map((s, i) => (
              <section key={s.title}>
                <h2 className={styles.sectionTitle}>{i + 1}. {s.title}</h2>
                <p className={styles.sectionText}>{s.body}</p>
              </section>
            ))}
          </div>
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
                <Link to="/security">Security</Link>
                <Link to="/terms">Terms</Link>
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