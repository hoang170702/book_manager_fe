import api, { buildRequest } from './api';
import type { ApiResponse, Category, AddCategoryRequest, UpdateCategoryRequest, DeleteCategoryRequest, GetOneCategoryRequest } from '../types';

export const categoryService = {
  async getAll() {
    const res = await api.post<ApiResponse<Category[]>>('/v1/categories/get-all', buildRequest({}));
    return res.data;
  },

  async getOne(data: GetOneCategoryRequest) {
    const res = await api.post<ApiResponse<Category>>('/v1/categories/get-one', buildRequest(data));
    return res.data;
  },

  async create(data: AddCategoryRequest) {
    const res = await api.post<ApiResponse<Category>>('/v1/categories/add', buildRequest(data));
    return res.data;
  },

  async update(data: UpdateCategoryRequest) {
    const res = await api.post<ApiResponse<Category>>('/v1/categories/update', buildRequest(data));
    return res.data;
  },

  async delete(data: DeleteCategoryRequest) {
    const res = await api.post<ApiResponse<null>>('/v1/categories/delete', buildRequest(data));
    return res.data;
  },
};
