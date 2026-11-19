import { getNotes, getPasswords } from './api'
import { decryptData } from './crypto'

export async function exportVault(cryptingKey: Uint8Array) {
  const key = Uint8Array.from(cryptingKey)

  const [{ notes }, { passwords }] = await Promise.all([getNotes(), getPasswords()])

  const exportedPasswords = await Promise.all(
    passwords.map(async (p) => {
      const data = JSON.parse(await decryptData(p.content, p.iv, key)) as {
        username?: string; password?: string; notes?: string
      }
      return {
        title: p.title,
        link: p.link,
        username: data.username ?? '',
        password: data.password ?? '',
        notes: data.notes ?? '',
        isFavorite: p.isFavorite,
      }
    })
  )

  const exportedNotes = await Promise.all(
    notes.map(async (n) => ({
      title: n.title,
      content: await decryptData(n.content, n.iv, key),
      isFavorite: n.isFavorite,
    }))
  )

  const payload = {
    app: 'Cipher',
    exportedAt: new Date().toISOString(),
    passwords: exportedPasswords,
    notes: exportedNotes,
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cipher-export-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}