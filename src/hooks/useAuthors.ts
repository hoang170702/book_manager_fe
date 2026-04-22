import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authorService } from '../services/authorService'
import type { AddAuthorRequest, UpdateAuthorRequest, DeleteAuthorRequest } from '../types'
import toast from 'react-hot-toast'

export const AUTHOR_KEYS = {
  all: ['authors'] as const,
  one: (id: number) => ['authors', id] as const,
}

export function useAuthors() {
  return useQuery({
    queryKey: AUTHOR_KEYS.all,
    queryFn: async () => {
      const res = await authorService.getAll()
      if (res.response_code === '00' && res.data) return res.data
      throw new Error(res.response_msg || 'Failed to fetch authors')
    },
  })
}

export function useAuthor(id: number) {
  return useQuery({
    queryKey: AUTHOR_KEYS.one(id),
    queryFn: async () => {
      const res = await authorService.getOne({ id })
      if (res.response_code === '00' && res.data) return res.data
      throw new Error(res.response_msg || 'Author not found')
    },
    enabled: !!id,
  })
}

export function useCreateAuthor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AddAuthorRequest) => authorService.create(data),
    onSuccess: (res) => {
      if (res.response_code === '00') {
        toast.success('Author added!')
        qc.invalidateQueries({ queryKey: AUTHOR_KEYS.all })
      } else {
        toast.error(res.response_msg || 'Create failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}

export function useUpdateAuthor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateAuthorRequest) => authorService.update(data),
    onSuccess: (res) => {
      if (res.response_code === '00') {
        toast.success('Author updated!')
        qc.invalidateQueries({ queryKey: AUTHOR_KEYS.all })
      } else {
        toast.error(res.response_msg || 'Update failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}

export function useDeleteAuthor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DeleteAuthorRequest) => authorService.delete(data),
    onSuccess: (res) => {
      if (res.response_code === '00') {
        toast.success('Author deleted!')
        qc.invalidateQueries({ queryKey: AUTHOR_KEYS.all })
      } else {
        toast.error(res.response_msg || 'Delete failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}
