import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest, RegisterRequest } from '../types'
import toast from 'react-hot-toast'

export function useLogin() {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (res, variables) => {
      if (res.response_code === '00' && res.data) {
        login(variables.username, res.data.access_token, res.data.refresh_token)
        toast.success('Login successful!')
        navigate('/admin')
      } else {
        toast.error(res.response_msg || 'Login failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (res) => {
      if (res.response_code === '00') {
        toast.success('Registration successful! Please login.')
      } else {
        toast.error(res.response_msg || 'Registration failed')
      }
    },
    onError: () => toast.error('Something went wrong'),
  })
}

export function useLogout() {
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  return async () => {
    await logout()
    navigate('/login')
  }
}
