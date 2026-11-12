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