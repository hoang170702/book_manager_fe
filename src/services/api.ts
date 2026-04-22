import axios from 'axios';
import type { ApiRequest, ApiResponse } from '../types';

const api = axios.create({
  baseURL: '/book-store/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — unwrap or pass through
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401 and we have refresh token, try refresh
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
            '/book-store/api/auth/refresh',
            buildRequest({ refresh_token: refreshToken })
          );
          if (res.data.response_code === '00') {
            localStorage.setItem('access_token', res.data.data.access_token);
            localStorage.setItem('refresh_token', res.data.data.refresh_token);
            originalRequest.headers.Authorization = `Bearer ${res.data.data.access_token}`;
            return api(originalRequest);
          }
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Helper: wrap data in Request[T] format
export function buildRequest<T>(data: T, paginate?: { page: number; limit: number }): ApiRequest<T> {
  return {
    request_id: crypto.randomUUID(),
    request_time: new Date().toISOString(),
    data,
    paginate,
  };
}

// Helper: check if response is successful
export function isSuccess<T>(response: ApiResponse<T>): boolean {
  return response.response_code === '00';
}

export default api;
