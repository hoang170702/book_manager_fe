import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookService } from '../services/bookService'
import type { AddBookRequest, UpdateBookRequest, DeleteBookRequest } from '../types'
import toast from 'react-hot-toast'

export const BOOK_KEYS = {
  all: ['books'] as const,
  one: (id: number) => ['books', id] as const,
}

export function useBooks() {
  return useQuery({
    queryKey: BOOK_KEYS.all,
    queryFn: async () => {
      const res = await bookService.getAll()
      if (res.response_code === '00' && res.data) return res.data
      throw new Error(res.response_msg || 'Failed to fetch books')
    },
  })
}

export function useBook(id: number) {
  return useQuery({
    queryKey: BOOK_KEYS.one(id),
    queryFn: async () => {
      const res = await bookService.getOne(id)
      if (res.response_code === '00' && res.data) return res.data
      throw new Error('Book not found')
    },
    enabled: !!id,
  })
}

export function useCreateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AddBookRequest) => bookService.create(data),
    onSuccess: (res) => {
      if (res.response_code === '00') {
        toast.success('Book added!')
        qc.invalidateQueries({ queryKey: BOOK_KEYS.all })
      } else {
        toast.error(res.response_msg || 'Create failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}

export function useUpdateBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateBookRequest) => bookService.update(data),
    onSuccess: (res) => {
      if (res.response_code === '00') {
        toast.success('Book updated!')
        qc.invalidateQueries({ queryKey: BOOK_KEYS.all })
      } else {
        toast.error(res.response_msg || 'Update failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}

export function useDeleteBook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DeleteBookRequest) => bookService.delete(data),
    onSuccess: (res) => {
      if (res.response_code === '00') {
        toast.success('Book deleted!')
        qc.invalidateQueries({ queryKey: BOOK_KEYS.all })
      } else {
        toast.error(res.response_msg || 'Delete failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}
