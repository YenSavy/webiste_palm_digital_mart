// store/authStore.ts
import { create } from 'zustand'

interface AuthStore {
  isAuthenticated: boolean
  isAuthLoading: boolean 
  token: string | null
  isSignInPage: boolean
  loginFormData: { username: string; password: string }
  registerFormData: { username: string; email: string; password: string }
  
  setToken: (token: string) => void
  setIsAuthenticated: (value: boolean) => void
  logout: () => void
  setIsSignInPage: (value: boolean) => void
  setLoginFormData: (data: { username: string; password: string }) => void
  setRegisterFormData: (data: { username: string; email: string; password: string }) => void
  initializeAuth: () => void
}

const getAuthToken = (): string | null => {
  const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'))
  return match ? match[2] : null

}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isAuthLoading: true, 
  token: null,
  isSignInPage: true,
  loginFormData: { username: '', password: '' },
  registerFormData: { username: '', email: '', password: '' },

  setToken: (token) => set({ token, isAuthenticated: true, isAuthLoading: false }),
  
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  
  logout: () => {
    document.cookie = 'auth_token=; max-age=0; path=/'
    set({ token: null, isAuthenticated: false })
  },
  
  setIsSignInPage: (value) => set({ isSignInPage: value }),
  
  setLoginFormData: (data) => set({ loginFormData: data }),
  
  setRegisterFormData: (data) => set({ registerFormData: data }),
  
  initializeAuth: () => {
    const token = getAuthToken()
    if (token) {
      set({ token, isAuthenticated: true, isAuthLoading: false })
    } else {
      set({ isAuthLoading: false })  // No token found, stop loading
    }
  }
}))