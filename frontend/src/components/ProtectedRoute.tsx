import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '../stores/authStore'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status)

  if (status === 'checking') return <div>Loading…</div>
  if (status === 'guest') return <Navigate to="/login" replace />
  return <>{children}</>
}