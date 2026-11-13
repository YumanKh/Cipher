import { useQuery } from '@tanstack/react-query'
import { getNotes, getPasswords } from '../lib/api'

export type VaultItem = {
  id: number
  type: 'Password' | 'Note'
  title: string
  isFavorite: boolean
  content: string
  iv: string
  link: string | null
}

export function useVaultItems() {
  const notesQuery = useQuery({ queryKey: ['notes'], queryFn: getNotes })
  const passwordsQuery = useQuery({ queryKey: ['passwords'], queryFn: getPasswords })

  const items: VaultItem[] = [
    ...(passwordsQuery.data?.passwords ?? []).map((p) => ({
      id: p.id, type: 'Password' as const, title: p.title, isFavorite: p.isFavorite, content: p.content, iv: p.iv, link: p.link,
    })),
    ...(notesQuery.data?.notes ?? []).map((n) => ({
      id: n.id, type: 'Note' as const, title: n.title, isFavorite: n.isFavorite, content: n.content, iv: n.iv, link: null,
    })),
  ]

  return {
    items,
    isLoading: notesQuery.isLoading || passwordsQuery.isLoading,
    isError: notesQuery.isError || passwordsQuery.isError,
  }
}