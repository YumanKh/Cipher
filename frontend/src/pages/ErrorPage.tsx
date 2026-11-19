import { useNavigate } from 'react-router-dom'
import styles from './ErrorPage.module.css'

type Props = { code?: string; title?: string; message?: string; onHome?: () => void }

export default function ErrorPage({
  code = '404',
  title = 'Page not found',
  message = "This page doesn't exist or may have been moved. Let's get you back to safety.",
  onHome,
}: Props) {
  const navigate = useNavigate()
  const goHome = onHome ?? (() => navigate('/'))
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <span className={styles.code}>{code}</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>
        <button className={styles.button} onClick={goHome}>Back to home</button>
      </div>
    </div>
  )
}