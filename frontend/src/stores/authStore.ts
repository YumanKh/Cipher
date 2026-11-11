import { create } from 'zustand'

type User = { email: string; name?: string }

type AuthState = {
  accessToken: string | null
  cryptingKey: Uint8Array | null
  user: User | null
  setSession: (session: { accessToken: string; cryptingKey: Uint8Array; user: User }) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  cryptingKey: null,
  user: null,
  setSession: (session) => set(session),
  clear: () => set({ accessToken: null, cryptingKey: null, user: null }),
}))