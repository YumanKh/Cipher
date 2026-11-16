import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNoteFavorite, updatePasswordFavorite } from '../lib/api'
import type { VaultItem } from './useVaultItems'

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (item: VaultItem) =>
      item.type === 'Password'
        ? updatePasswordFavorite(item.id, !item.isFavorite)
        : updateNoteFavorite(item.id, !item.isFavorite),
    onSuccess: (_data, item) => {
      queryClient.invalidateQueries({ queryKey: [item.type === 'Password' ? 'passwords' : 'notes'] })
    },
  })
}