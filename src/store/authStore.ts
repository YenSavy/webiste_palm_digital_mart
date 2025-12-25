import { create } from 'zustand'

interface User {
  name: string
  phone: string;
  email: string;
  full_name: string | null;
  avatar_image?: string
}

interface AuthStore {
  isAuthenticated: boolean
  isAuthLoading: boolean 
  token: string | null
  user: User | null
  isSignInPage: boolean
  loginFormData: { username: string; password: string }
  registerFormData: { username: string; email: string; password: string }
  
  setToken: (token: string, user?: User, expireTime?: number) => void
  setIsAuthenticated: (value: boolean) => void
  logout: () => void
  setIsSignInPage: (value: boolean) => void
  setLoginFormData: (data: { username: string; password: string }) => void
  setRegisterFormData: (data: { username: string; email: string; password: string }) => void
  initializeAuth: () => void
  setUser: (user: User) => void
}

export const getAuthToken = (): string | null => {
  const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'))
  return match ? match[2] : null
}

const getUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }
  return null
}

    const setAuthCookie = (token: string, maxAgeSeconds?: number) => {
        if (maxAgeSeconds) {
            document.cookie = `auth_token=${token}; max-age=${maxAgeSeconds}; path=/; secure; samesite=strict`
        } else {
            document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`
        }
    }

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isAuthLoading: true, 
  token: null,
  user: null,
  isSignInPage: true,
  loginFormData: { username: '', password: '' },
  registerFormData: { username: '', email: '', password: '' },

  setToken: (token, user, expireTime) => {
    set({ token, isAuthenticated: true, isAuthLoading: false })
    setAuthCookie(token, expireTime)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      set({ user })
    }
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
  
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  
  logout: () => {
    document.cookie = 'auth_token=; max-age=0; path=/'
    localStorage.removeItem('user')
    set({ token: null, isAuthenticated: false, user: null })
  },
  
  setIsSignInPage: (value) => set({ isSignInPage: value }),
  
  setLoginFormData: (data) => set({ loginFormData: data }),
  
  setRegisterFormData: (data) => set({ registerFormData: data }),
  
  initializeAuth: () => {
    const token = getAuthToken()
    const user = getUserFromStorage()
    if(user && token) console.log(true)
    if (token && user) {
      set({ user })
      set({ token, isAuthenticated: true, isAuthLoading: false })
    } else {
      set({ isAuthLoading: false })  
    }
  }
}))

useAuthStore.getState().initializeAuth();