import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote, createPassword } from '../lib/api'
import { encryptData } from '../lib/crypto'
import { useAuthStore } from '../stores/authStore'

type NewPassword = { type: 'Password'; title: string; link?: string; username: string; password: string; notes: string }
type NewNote = { type: 'Note'; title: string; content: string }
export type NewItem = NewPassword | NewNote

export function useCreateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: NewItem) => {
      const stored = useAuthStore.getState().cryptingKey
      if (!stored) throw new Error('Vault is locked')
      const cryptingKey = Uint8Array.from(stored)

      if (item.type === 'Password') {
        const secrets = JSON.stringify({ username: item.username, password: item.password, notes: item.notes })
        const { content, iv } = await encryptData(secrets, cryptingKey)
        return createPassword({ title: item.title, link: item.link, content, iv })
      }

      const { content, iv } = await encryptData(item.content, cryptingKey)
      return createNote({ title: item.title, content, iv })
    },
    onSuccess: (_data, item) => {
      queryClient.invalidateQueries({ queryKey: [item.type === 'Password' ? 'passwords' : 'notes'] })
    },
  })
}