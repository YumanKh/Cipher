import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNote, deletePassword } from '../lib/api'
import type { VaultItem } from './useVaultItems'

export function useDeleteItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item: VaultItem) =>
      item.type === 'Password' ? deletePassword(item.id) : deleteNote(item.id),
    onSuccess: (_data, item) => {
      queryClient.invalidateQueries({ queryKey: [item.type === 'Password' ? 'passwords' : 'notes'] })
    },
  })
}