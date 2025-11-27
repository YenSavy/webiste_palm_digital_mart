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
    gradient: 'from-[#102A43] via-[#0D3C73] to-[#102A43]',
    primary: 'from-[#102A43] via-[#0D3C73] to-[#102A43]',
    primaryHover: 'bg-slate-700/50',
    accent: '#DAA520',
    accentGlow: 'rgba(218,165,32,0.3)',
    cardBg: 'from-slate-800/60 to-slate-900/60',
    border: 'border-slate-700/50',
    text: 'text-white',
    textSecondary: 'text-gray-400',
  },
  sunset: {
    name: 'Sunset Orange',
    gradient: 'from-[#4A1942] via-[#6B2154] to-[#4A1942]',
    primary: 'from-[#4A1942] via-[#6B2154] to-[#4A1942]',
    primaryHover: 'bg-purple-900/50',
    accent: '#FF6B35',
    accentGlow: 'rgba(255,107,53,0.3)',
    cardBg: 'from-purple-900/60 to-pink-900/60',
    border: 'border-purple-700/50',
    text: 'text-white',
    textSecondary: 'text-purple-300',
  },
  forest: {
    name: 'Forest Green',
    gradient: 'from-[#1A3A2A] via-[#2D5A3D] to-[#1A3A2A]',
    primary: 'from-[#1A3A2A] via-[#2D5A3D] to-[#1A3A2A]',
    primaryHover: 'bg-green-900/50',
    accent: '#4ADE80',
    accentGlow: 'rgba(74,222,128,0.3)',
    cardBg: 'from-green-900/60 to-emerald-900/60',
    border: 'border-green-700/50',
    text: 'text-white',
    textSecondary: 'text-green-300',
  },
  midnight: {
    name: 'Midnight Purple',
    gradient: 'from-[#1E1B4B] via-[#312E81] to-[#1E1B4B]',
    primary: 'from-[#1E1B4B] via-[#312E81] to-[#1E1B4B]',
    primaryHover: 'bg-indigo-900/50',
    accent: '#A78BFA',
    accentGlow: 'rgba(167,139,250,0.3)',
    cardBg: 'from-indigo-900/60 to-purple-900/60',
    border: 'border-indigo-700/50',
    text: 'text-white',
    textSecondary: 'text-indigo-300',
  },
  royal: {
    name: 'Royal Gold',
    gradient: 'from-[#1C1917] via-[#44403C] to-[#1C1917]',
    primary: 'from-[#1C1917] via-[#44403C] to-[#1C1917]',
    primaryHover: 'bg-stone-800/50',
    accent: '#FCD34D',
    accentGlow: 'rgba(252,211,77,0.3)',
    cardBg: 'from-stone-800/60 to-stone-900/60',
    border: 'border-stone-700/50',
    text: 'text-white',
    textSecondary: 'text-stone-300',
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