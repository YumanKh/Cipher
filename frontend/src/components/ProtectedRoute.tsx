import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '../stores/authStore'
import UnlockScreen from './UnlockScreen'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status)
  const cryptingKey = useAuthStore((s) => s.cryptingKey)

  if (status === 'checking') return <div>Loading…</div>
  if (status === 'guest') return <Navigate to="/login" replace />
  if (!cryptingKey) return <UnlockScreen />
  return <>{children}</>
}