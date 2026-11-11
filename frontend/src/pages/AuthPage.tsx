import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './AuthPage.module.css'
import logo from '../assets/logo.png'
import {
  generateKdfSalt, generateCryptingKey, deriveMasterKey,
  computeAuthValue, wrapCryptingKey, unwrapCryptingKey, toBase64, fromBase64,
} from '../lib/crypto'
import { prelogin, login, register, ApiError } from '../lib/api'
import { useAuthStore } from '../stores/authStore'

type Mode = 'login' | 'register'
type Field = 'name' | 'email' | 'password' | 'confirm'
type Errors = Partial<Record<Field | 'general', string>>

export default function AuthPage() {
    const location = useLocation()
    const [mode, setMode] = useState<Mode>(location.pathname === '/register' ? 'register' : 'login')
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState<Errors>({})
    const [agreed, setAgreed] = useState(false)
    const navigate = useNavigate()
    const setSession = useAuthStore((s) => s.setSession)
    const [submitting, setSubmitting] = useState(false)

    const isRegister = mode === 'register'
    const strength = computeStrength(form.password)

    const update = (field: Field) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [field]: e.target.value }))

    function switchMode(next: Mode) {
        setMode(next)
        setErrors({})
    }

async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    if (isRegister && !agreed) {
        setErrors({ general: 'Please accept the Terms and Privacy Policy to continue.' })
        return
    }
    if (isRegister && form.password !== form.confirm) {
        setErrors({ confirm: "Passwords don't match." })
        return
    }
    if (isRegister && form.password.length < 8) {
        setErrors({ password: 'Password must be at least 8 characters.' })
        return
    }
    setSubmitting(true)
    try {
        if (isRegister) {
        const kdfSalt = generateKdfSalt()
        const masterKey = await deriveMasterKey(form.password, kdfSalt)
        const authValue = await computeAuthValue(masterKey)
        const cryptingKey = generateCryptingKey()
        const wrappedKey = await wrapCryptingKey(cryptingKey, masterKey)

        const { accessToken } = await register({
            name: form.name,
            email: form.email,
            authValue,
            cryptingKey: wrappedKey,
            kdfSalt: toBase64(kdfSalt),
        })

        setSession({ accessToken, cryptingKey, user: { email: form.email, name: form.name } })
        navigate('/vault')
        } else {
        const { kdfSalt } = await prelogin(form.email)
        const masterKey = await deriveMasterKey(form.password, fromBase64(kdfSalt))
        const authValue = await computeAuthValue(masterKey)

        const { accessToken, cryptingKey: wrappedKey } = await login(form.email, authValue)
        const cryptingKey = await unwrapCryptingKey(wrappedKey, masterKey)

        setSession({ accessToken, cryptingKey, user: { email: form.email } })
        navigate('/vault')
        }
    } catch (err) {
        if (err instanceof ApiError) {
        if (err.field) setErrors({ [err.field]: err.message })
        else setErrors({ general: err.message })
        } else {
        setErrors({ general: 'Something went wrong. Please try again.' })
        }
    } finally {
        setSubmitting(false)
    }
}

    return (
        <main className={styles.page}>
        <section className={styles.formSide}>
            <header className={styles.top}>
            <Link className={styles.brand} to="/" aria-label="Cipher home">
                <img src={logo} alt="" aria-hidden="true" />
                <span>Cipher</span>
            </Link>
            <span className={styles.topNote}>A calmer internet</span>
            </header>

            <div className={styles.formWrap}>
            <p className={styles.eyebrow}>Your private space starts here</p>
            <h1 className={styles.title}>{isRegister ? 'Create your vault.' : 'Welcome back.'}</h1>
            <p className={styles.intro}>
                {isRegister
                ? 'Create your Cipher account and give your passwords and private notes a secure place to live.'
                : 'Sign in to return to your passwords, private notes, and everything you keep safe with Cipher.'}
            </p>

            <div className={styles.switcher} role="tablist" aria-label="Account access">
                <button type="button" role="tab" aria-selected={!isRegister}
                className={`${styles.switchBtn} ${!isRegister ? styles.active : ''}`}
                onClick={() => switchMode('login')}>
                Log in
                </button>
                <button type="button" role="tab" aria-selected={isRegister}
                className={`${styles.switchBtn} ${isRegister ? styles.active : ''}`}
                onClick={() => switchMode('register')}>
                Create account
                </button>
            </div>

            {errors.general && <div className={styles.notice}>{errors.general}</div>}

            <form onSubmit={handleSubmit} noValidate>
                {isRegister && (
                <div className={styles.field}>
                    <label htmlFor="name">Your name</label>
                    <input id="name" name="name" autoComplete="name" placeholder="Username"
                    className={errors.name ? styles.inputError : undefined}
                    value={form.name} onChange={update('name')} />
                    {errors.name && <p className={styles.fieldError}>{errors.name}</p>}
                </div>
                )}

                <div className={styles.field}>
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" placeholder="Email"
                    className={errors.email ? styles.inputError : undefined}
                    value={form.email} onChange={update('email')} />
                {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
                </div>

                <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrap}>
                    <input id="password" name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    placeholder={isRegister ? 'Create a strong password' : 'Enter your password'}
                    className={`${styles.password} ${errors.password ? styles.inputError : ''}`}
                    value={form.password} onChange={update('password')} />
                        <button type="button" className={styles.showPass}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword((s) => !s)}>
                            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                        </button>
                </div>
                {isRegister && (
                    <>
                    <div className={styles.strength}>
                        <span className={styles.strengthBar} style={{ width: `${strength.score * 20}%` }} />
                    </div>
                    <div className={styles.strengthLabel}>{strength.label}</div>
                    </>
                )}
                {errors.password && <p className={styles.fieldError}>{errors.password}</p>}
                </div>

                {isRegister && (
                <div className={styles.field}>
                    <label htmlFor="confirm">Confirm password</label>
                    <div className={styles.inputWrap}>
                    <input id="confirm" name="confirm"
                        type={showConfirm ? 'text' : 'password'}
                        autoComplete="new-password" placeholder="Re-enter your password"
                        className={`${styles.password} ${errors.confirm ? styles.inputError : ''}`}
                        value={form.confirm} onChange={update('confirm')} />
                        <button type="button" className={styles.showPass}
                            aria-label={showConfirm ? 'Hide password' : 'Show password'}
                            onClick={() => setShowConfirm((s) => !s)}>
                            {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
                        </button>
                    </div>
                    {errors.confirm && <p className={styles.fieldError}>{errors.confirm}</p>}
                </div>
                )}

                {isRegister && (
                <div className={styles.formRow}>
                    <label className={styles.check}>
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                    <span>
                        I agree to the <a className={styles.textLink} href="#">Terms</a> and{' '}
                        <a className={styles.textLink} href="#">Privacy Policy</a>.
                    </span>
                    </label>
                </div>
                )}

                <button type="submit" className={styles.submit} disabled={submitting}>
                    {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}
                </button>
            </form>

            <div className={styles.separator}>or</div>

            <Link to="/" className={styles.secondary}>Explore Cipher</Link>

            <p className={styles.terms}>
                Your information is protected with privacy at its core.{' '}
                <a href="#">Learn about our approach</a>.
            </p>
            </div>

            <footer className={styles.footer}>
            <span>© 2026 Yuman Khoufache. All rights reserved.</span>
            <nav className={styles.footerLinks}>
                <a href="#">Privacy</a>
                <a href="#">Security</a>
                <a href="#">Help</a>
            </nav>
            </footer>
        </section>

        <aside className={styles.visual} aria-label="A quiet mountain lake at sunset">
            <div className={styles.visualContent}>
            <p className={styles.visualKicker}>Privacy for a brighter tomorrow</p>
            <h2 className={styles.visualTitle}>Everything important, in one peaceful place.</h2>
            <p>Your digital life deserves a little more calm. Keep your passwords and private notes close, secure, and beautifully organized.</p>
            <div className={styles.trust}>
                <span><b>✦</b> Private by design</span>
                <span><b>◈</b> End-to-end minded</span>
                <span><b>❧</b> Simple by nature</span>
            </div>
            </div>
        </aside>
        </main>
    )
}

function computeStrength(p: string) {
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/\d/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const label = !p
    ? 'Use at least 8 characters.'
    : score < 3 ? 'A little more variety would help.'
    : score < 5 ? 'Good password strength.'
    : 'Strong password.'
  return { score, label }
}

function EyeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
        </svg>
    )
    }
    function EyeOffIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
        <path d="m2 2 20 20" />
        </svg>
    )
}