import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { refresh } from '../lib/api'
import { useAuthStore } from '../stores/authStore'

export default function SessionGate({ children }: { children: ReactNode }) {
  const restore = useAuthStore((s) => s.restore)
  const setGuest = useAuthStore((s) => s.setGuest)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    refresh()
      .then(({ accessToken, user }) => restore({ accessToken, user }))
      .catch(() => setGuest())
  }, [restore, setGuest])

  return <>{children}</>
}