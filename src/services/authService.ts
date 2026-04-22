import api, { buildRequest, isSuccess } from './api';
import type { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, RefreshRequest } from '../types';

export const authService = {
  async login(data: LoginRequest) {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', buildRequest(data));
    if (isSuccess(res.data) && res.data.data) {
      localStorage.setItem('access_token', res.data.data.access_token);
      localStorage.setItem('refresh_token', res.data.data.refresh_token);
    }
    return res.data;
  },

  async register(data: RegisterRequest) {
    const res = await api.post<ApiResponse<null>>('/auth/register', buildRequest(data));
    return res.data;
  },

  async refresh(data: RefreshRequest) {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/refresh', buildRequest(data));
    return res.data;
  },

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      await api.post('/auth/logout', buildRequest({ refresh_token: refreshToken || '' }));
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
};
