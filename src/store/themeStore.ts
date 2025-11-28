import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeType = 'ocean' | 'sunset' | 'forest' | 'midnight' | 'royal' | 'light'

interface Theme {
  name: string
  gradient: string
  primary: string
  primaryHover: string
  accent: string
  accentGlow: string
  cardBg: string
  border: string
  text: string
  textSecondary: string
}

export const themes: Record<ThemeType, Theme> = {
  ocean: {
    name: 'Ocean Blue',
    gradient: 'from-blue-50 via-blue-50 to-blue-50',
    primary: 'from-cyan-100 via-cyan-100 to-cyan-100',
    primaryHover: 'bg-blue-100',
    accent: '#0EA5E9',
    accentGlow: 'rgba(14,165,233,0.3)',
    cardBg: 'from-white/90 to-blue-50/90',
    border: 'border-blue-200',
    text: 'text-gray-900',
    textSecondary: 'text-blue-700',
  },
  sunset: {
    name: 'Sunset Orange',
    gradient: 'from-orange-50 via-orange-50 to-orange-50',
    primary: 'from-orange-100 via-orange-100 to-orange-100',
    primaryHover: 'bg-orange-100',
    accent: '#F97316',
    accentGlow: 'rgba(249,115,22,0.3)',
    cardBg: 'from-white/90 to-orange-50/90',
    border: 'border-orange-200',
    text: 'text-gray-900',
    textSecondary: 'text-orange-700',
  },
  forest: {
    name: 'Forest Green',
    gradient: 'from-green-50 via-green-50 to-green-50',
    primary: 'from-green-100 via-green-100 to-green-100',
    primaryHover: 'bg-green-100',
    accent: '#10B981',
    accentGlow: 'rgba(16,185,129,0.3)',
    cardBg: 'from-white/90 to-green-50/90',
    border: 'border-green-200',
    text: 'text-gray-900',
    textSecondary: 'text-green-700',
  },
  midnight: {
    name: 'Midnight Purple',
    gradient: 'from-purple-50 via-purple-50 to-purple-50',
    primary: 'from-purple-100 via-purple-100 to-purple-100',
    primaryHover: 'bg-purple-100',
    accent: '#8B5CF6',
    accentGlow: 'rgba(139,92,246,0.3)',
    cardBg: 'from-white/90 to-purple-50/90',
    border: 'border-purple-200',
    text: 'text-gray-900',
    textSecondary: 'text-purple-700',
  },
  royal: {
    name: 'Royal Gold',
    gradient: 'from-amber-50 via-yellow-50 to-amber-50',
    primary: 'from-amber-100 via-yellow-100 to-amber-100',
    primaryHover: 'bg-amber-100',
    accent: '#F59E0B',
    accentGlow: 'rgba(245,158,11,0.3)',
    cardBg: 'from-white/90 to-amber-50/90',
    border: 'border-amber-200',
    text: 'text-gray-900',
    textSecondary: 'text-amber-700',
  },
  light: {
    name: 'Light Mode',
    gradient: 'from-gray-50 via-gray-100 to-gray-50',
    primary: 'from-white via-gray-50 to-white',
    primaryHover: 'bg-gray-100',
    accent: '#3B82F6',
    accentGlow: 'rgba(59,130,246,0.2)',
    cardBg: 'from-white/90 to-gray-50/90',
    border: 'border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
  },
}

interface ThemeState {
  currentTheme: ThemeType
  setTheme: (theme: ThemeType) => void
  getTheme: () => Theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'ocean',
      setTheme: (theme: ThemeType) => set({ currentTheme: theme }),
      getTheme: () => themes[get().currentTheme],
    }),
    {
      name: 'theme-storage',
    }
  )
)