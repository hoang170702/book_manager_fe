import { create } from 'zustand';
import { authService } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('access_token'),
  username: localStorage.getItem('username'),

  login: (username, accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('username', username);
    set({ isAuthenticated: true, username });
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
      set({ isAuthenticated: false, username: null });
    }
  },

  checkAuth: () => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    set({ isAuthenticated: !!token, username });
  },
}));
