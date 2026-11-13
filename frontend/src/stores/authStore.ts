import { create } from 'zustand'

type User = { email: string; name?: string }
type Status = 'checking' | 'authed' | 'guest'

type AuthState = {
  status: Status
  accessToken: string | null
  cryptingKey: Uint8Array | null
  wrappedKey: string | null
  kdfSalt: string | null
  user: User | null
  setSession: (session: { accessToken: string; cryptingKey: Uint8Array; user: User }) => void
  setGuest: () => void
  clear: () => void
  restore: (data: { accessToken: string; user: User; wrappedKey: string; kdfSalt: string }) => void
  unlock: (cryptingKey: Uint8Array) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'checking',
  accessToken: null,
  cryptingKey: null,
  wrappedKey: null,
  kdfSalt: null,
  user: null,
  setSession: (session) => set({ ...session, status: 'authed' }),
  setGuest: () => set({ status: 'guest' }),
  clear: () => set({ status: 'guest', accessToken: null, cryptingKey: null, wrappedKey: null, kdfSalt: null, user: null }),
  restore: (data) => set({ accessToken: data.accessToken, user: data.user, wrappedKey: data.wrappedKey, kdfSalt: data.kdfSalt, status: 'authed' }),
  unlock: (cryptingKey) => set({ cryptingKey }),
}))