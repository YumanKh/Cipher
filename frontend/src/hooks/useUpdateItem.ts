import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNote, updatePassword } from '../lib/api'
import { encryptData } from '../lib/crypto'
import { useAuthStore } from '../stores/authStore'

type UpdatePassword = { type: 'Password'; id: number; title: string; link?: string; username: string; password: string; notes: string }
type UpdateNote = { type: 'Note'; id: number; title: string; content: string }
export type UpdateItem = UpdatePassword | UpdateNote

export function useUpdateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (item: UpdateItem) => {
      const stored = useAuthStore.getState().cryptingKey
      if (!stored) throw new Error('Vault is locked')
      const cryptingKey = Uint8Array.from(stored)

      if (item.type === 'Password') {
        const secrets = JSON.stringify({ username: item.username, password: item.password, notes: item.notes })
        const { content, iv } = await encryptData(secrets, cryptingKey)
        return updatePassword(item.id, { title: item.title, link: item.link, content, iv })
      }

      const { content, iv } = await encryptData(item.content, cryptingKey)
      return updateNote(item.id, { title: item.title, content, iv })
    },
    onSuccess: (_data, item) => {
      queryClient.invalidateQueries({ queryKey: [item.type === 'Password' ? 'passwords' : 'notes'] })
    },
  })
}