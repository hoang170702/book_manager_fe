import api, { buildRequest } from './api';
import type { ApiResponse, Author, AddAuthorRequest, UpdateAuthorRequest, DeleteAuthorRequest, GetOneAuthorRequest } from '../types';

export const authorService = {
  async getAll() {
    const res = await api.post<ApiResponse<Author[]>>('/v1/authors/get-all', buildRequest({}));
    return res.data;
  },

  async getOne(data: GetOneAuthorRequest) {
    const res = await api.post<ApiResponse<Author>>('/v1/authors/get-one', buildRequest(data));
    return res.data;
  },

  async create(data: AddAuthorRequest) {
    const res = await api.post<ApiResponse<Author>>('/v1/authors/add', buildRequest(data));
    return res.data;
  },

  async update(data: UpdateAuthorRequest) {
    const res = await api.post<ApiResponse<Author>>('/v1/authors/update', buildRequest(data));
    return res.data;
  },

  async delete(data: DeleteAuthorRequest) {
    const res = await api.post<ApiResponse<null>>('/v1/authors/delete', buildRequest(data));
    return res.data;
  },
};
