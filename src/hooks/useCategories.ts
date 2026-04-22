import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '../services/categoryService'
import type { AddCategoryRequest, UpdateCategoryRequest, DeleteCategoryRequest } from '../types'
import toast from 'react-hot-toast'

export const CATEGORY_KEYS = {
  all: ['categories'] as const,
  one: (id: number) => ['categories', id] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.all,
    queryFn: async () => {
      const res = await categoryService.getAll()
      if (res.response_code === '00' && res.data) return res.data
      throw new Error(res.response_msg || 'Failed to fetch categories')
    },
  })
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: CATEGORY_KEYS.one(id),
    queryFn: async () => {
      const res = await categoryService.getOne({ id })
      if (res.response_code === '00' && res.data) return res.data
      throw new Error(res.response_msg || 'Category not found')
    },
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AddCategoryRequest) => categoryService.create(data),
    onSuccess: (res) => {
      if (res.response_code === '00') {
        toast.success('Category added!')
        qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all })
      } else {
        toast.error(res.response_msg || 'Create failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoryService.update(data),
    onSuccess: (res) => {
      if (res.response_code === '00') {
        toast.success('Category updated!')
        qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all })
      } else {
        toast.error(res.response_msg || 'Update failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DeleteCategoryRequest) => categoryService.delete(data),
    onSuccess: (res) => {
      if (res.response_code === '00') {
        toast.success('Category deleted!')
        qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all })
      } else {
        toast.error(res.response_msg || 'Delete failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}
