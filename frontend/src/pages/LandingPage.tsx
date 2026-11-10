import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'
import logo from '../assets/logo.png'

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* ---------- TOPBAR ---------- */}
      <header className={styles.topbar}>
        <a className={styles.brand} href="#top" aria-label="Cipher home">
          <img className={styles.brandLogo} src={logo} alt="" aria-hidden="true" />
          <span className={styles.brandText}>
            <span className={styles.brandName}>Cipher</span>
            <span className={styles.brandTag}>A calmer internet</span>
          </span>
        </a>

        <nav className={styles.navlinks} aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <a href="#how">How it works</a>
        </nav>

        <div className={styles.navActions}>
          <Link className={styles.loginLink} to="/login">Log in</Link>
          <Link className={styles.cta} to="/register">
            Create free account <span className={styles.arrow}>→</span>
          </Link>
        </div>
      </header>

      <main id="top">
        {/* ---------- HERO ---------- */}
        <section className={styles.hero} aria-label="Cipher introduction">
          <div className={styles.heroArt} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Privacy for a brighter tomorrow</p>
            <h1 className={styles.heroTitle}>Your digital life,<br />protected.</h1>
            <p className={styles.heroCopy}>
              Passwords, private notes, and the little things you never want to lose — all in one calm, secure place.
            </p>
            <div className={styles.heroButtons}>
              <Link className={styles.cta} to="/register">
                Create your free vault <span className={styles.arrow}>→</span>
              </Link>
              <a className={styles.secondary} href="#features">See how it works</a>
            </div>
            <div className={styles.trustline}>
              <span className={styles.trustItem}>
                <span className={styles.trustIcon}>
                  <svg viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>
                </span>Private by design
              </span>
              <span className={styles.trustItem}>
                <span className={styles.trustIcon}>
                  <svg viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
                </span>End-to-end encrypted
              </span>
              <span className={styles.trustItem}>
                <span className={styles.trustIcon}>
                  <svg viewBox="0 0 24 24"><path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" /></svg>
                </span>Simple by nature
              </span>
            </div>
          </div>
        </section>

        {/* ---------- FEATURES ---------- */}
        <section className={styles.features} id="features" aria-label="Cipher features">
          <article className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <h2 className={styles.featureTitle}>Passwords, organized</h2>
            <p className={styles.featureDesc}>Keep every login within reach.</p>
          </article>

          <article className={styles.feature} id="how">
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24"><path d="M15 12h-5" /><path d="M15 8h-5" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></svg>
            </div>
            <h2 className={styles.featureTitle}>Notes that stay yours</h2>
            <p className={styles.featureDesc}>Save private thoughts and important details.</p>
          </article>

          <article className={styles.feature} id="security">
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
            </div>
            <h2 className={styles.featureTitle}>Security without the clutter</h2>
            <p className={styles.featureDesc}>A focused vault that feels effortless.</p>
          </article>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <a className={styles.footerBrand} href="#top" aria-label="Cipher home">
              <img className={styles.footerLogo} src={logo} alt="" aria-hidden="true" />
              <span className={styles.footerBrandText}>
                <span className={styles.footerName}>Cipher</span>
                <span className={styles.footerTag}>Protect what matters.</span>
              </span>
            </a>
            <nav className={styles.footerlinks} aria-label="Footer navigation">
              <a href="#security">Privacy</a>
              <a href="#security">Security</a>
              <a href="#help">Help</a>
            </nav>
          </div>
          <hr className={styles.footerDivider} />
          <p className={styles.footerCopy}>© 2026 Yuman Khoufache. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}