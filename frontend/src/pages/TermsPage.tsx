import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './FeaturesPage.module.css'
import logo from '../assets/logo.png'

const SECTIONS = [
  { title: 'Acceptance of these terms', body: "By creating an account or using Cipher, you agree to these terms. If you don't agree with them, please don't use the service." },
  { title: 'What Cipher is', body: 'Cipher is an end-to-end encrypted vault for storing passwords and private notes. Your data is encrypted on your device before it reaches our servers, so it stays private to you.' },
  { title: 'Your master password', body: 'Your master password is the single key to your vault. Because Cipher is zero-knowledge, we never see it and we cannot recover or reset it. If you forget it, your encrypted data cannot be unlocked — by us or by anyone. You are solely responsible for remembering it and keeping it safe.' },
  { title: 'Your account', body: "You're responsible for the activity on your account and for keeping your login details secure. Use a strong, unique master password and never share it." },
  { title: 'Acceptable use', body: 'Use Cipher only for lawful purposes. Do not attempt to disrupt, attack, reverse-engineer or gain unauthorized access to the service or to other users\u2019 data.' },
  { title: 'Your data and privacy', body: "We store only encrypted data plus the minimum needed to run your account, such as your email. We cannot read your passwords or notes. You can export a full copy of your data, or permanently delete your account, at any time from Settings. See the Security page for how the encryption works." },
  { title: 'Service provided "as is"', body: "Cipher is provided \u201cas is\u201d, without warranties of any kind. As a student project it may contain bugs, change, or become unavailable without notice. We don't guarantee uninterrupted access or that your data will never be lost." },
  { title: 'Limitation of liability', body: 'To the fullest extent allowed by law, Cipher and its creator are not liable for any loss or damage arising from your use of the service, including loss of data or a vault made inaccessible by a forgotten master password.' },
  { title: 'Termination', body: 'You can stop using Cipher and delete your account at any time from Settings; deletion is permanent. Access to the service may also be suspended or ended, since it is a learning project that may be taken offline.' },
  { title: 'Changes to these terms', body: "We may update these terms from time to time. The \u201cLast updated\u201d date above reflects the latest version. Continuing to use Cipher after a change means you accept it." },
  { title: 'Contact', body: 'Questions about these terms? Reach out through the project\u2019s GitHub repository at github.com/YumanKh/Cipher.' },
]

export default function TermsPage() {
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
            <h1 className={styles.title}>Terms &amp; Conditions</h1>
            <p className={styles.updated}>Last updated: November 2026</p>
          </div>

          <div className={styles.note}>
            Cipher is a personal, student portfolio project built by Yuman Khoufache to learn and demonstrate secure web development. It is not a commercial product or a registered company. These terms are written in good faith and in plain language, but they are not legal advice. Please treat Cipher as a learning project rather than a guaranteed service, and don't store anything you can't afford to lose.
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