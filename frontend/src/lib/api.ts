import { useAuthStore } from "../stores/authStore"

export const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number
  field?: string
  constructor(status: number, message: string, field?: string) {
    super(message)
    this.status = status
    this.field = field
  }
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? 'Something went wrong.', data.field)
  }
  return data as T
}

async function authRequest<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const doFetch = () =>
    fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(useAuthStore.getState().accessToken
          ? { Authorization: `Bearer ${useAuthStore.getState().accessToken}` }
          : {}),
      },
      credentials: 'include',
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

  let res = await doFetch()

  if (res.status === 401) {
    try {
      const { accessToken, user } = await refresh()
      useAuthStore.getState().restore({ accessToken, user })
      res = await doFetch()
    } catch {
      useAuthStore.getState().clear()
      throw new ApiError(401, 'Session expired.')
    }
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'Something went wrong.', data.field)
  return data as T
}

export function prelogin(email: string) {
  return request<{ kdfSalt: string }>('/auth/prelogin', { email })
}

export function login(email: string, authValue: string) {
  return request<{
    accessToken: string
    user: { cryptingKey: string; name?: string; email?: string }
  }>('/auth/login', { email, authValue })
}

export function register(input: {
  name: string
  email: string
  authValue: string
  cryptingKey: string
  kdfSalt: string
}) {
  return request<{ accessToken: string }>('/auth/register', input)
}

export function refresh() {
  return request<{ accessToken: string; user: { email: string; name?: string } }>('/auth/refresh', {})
}

export type NoteRow = { id: number; title: string; content: string; iv: string; isFavorite: boolean }
export type PasswordRow = { id: number; title: string; link: string | null; content: string; iv: string; isFavorite: boolean }

export function getNotes() {
  return authRequest<{ notes: NoteRow[] }>('/notes')
}

export function getPasswords() {
  return authRequest<{ passwords: PasswordRow[] }>('/passwords')
}

export function createPassword(input: { title: string; link?: string; content: string; iv: string }) {
  return authRequest<{ password: PasswordRow }>('/passwords', { method: 'POST', body: input })
}

export function createNote(input: { title: string; content: string; iv: string }) {
  return authRequest<{ note: NoteRow }>('/notes', { method: 'POST', body: input })
}