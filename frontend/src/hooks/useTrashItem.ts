import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setNoteTrash, setPasswordTrash } from '../lib/api'
import type { VaultItem } from './useVaultItems'

export function useTrashItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ item, isTrash }: { item: VaultItem; isTrash: boolean }) =>
      item.type === 'Password'
        ? setPasswordTrash(item.id, isTrash)
        : setNoteTrash(item.id, isTrash),
    onSuccess: (_data, { item }) => {
      queryClient.invalidateQueries({ queryKey: [item.type === 'Password' ? 'passwords' : 'notes'] })
    },
  })
}