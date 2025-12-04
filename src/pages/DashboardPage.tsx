import React, { type JSX } from 'react'
import StepsToUseSystem from '../components/shared/dashboard/StepsToUseSystem'
import { useThemeStore } from '../store/themeStore'
import { Building2, GitBranch, Warehouse, Briefcase, DollarSign } from 'lucide-react'
import useDashboardStore from '../store/dashboardStore'

const DashboardPage: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme())

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div
          className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`}
        >
          <h2 className={`text-lg font-semibold ${theme.text} mb-4`}>Select Category</h2>
          <CategoryButton />
        </div>

        <StepsToUseSystem />
      </div>
    </div>
  )
}

export default DashboardPage

type TCatBtn = {
  id: string
  label: string
  value: 'company' | 'branch' | 'warehouse' | 'position' | 'currency'
  icon: JSX.Element
  description: string
}

const categoryButtonData: TCatBtn[] = [
  {
    id: crypto.randomUUID(),
    label: 'Company',
    value: 'company',
    icon: <Building2 size={20} />,
    description: 'Manage company information',
  },
  {
    id: crypto.randomUUID(),
    label: 'Branch',
    value: 'branch',
    icon: <GitBranch size={20} />,
    description: 'Manage branch locations',
  },
  {
    id: crypto.randomUUID(),
    label: 'Warehouse',
    value: 'warehouse',
    icon: <Warehouse size={20} />,
    description: 'Manage warehouse inventory',
  },
  {
    id: crypto.randomUUID(),
    label: 'Position',
    value: 'position',
    icon: <Briefcase size={20} />,
    description: 'Manage employee positions',
  },
  {
    id: crypto.randomUUID(),
    label: 'Currency',
    value: 'currency',
    icon: <DollarSign size={20} />,
    description: 'Manage currency settings',
  },
]

const CategoryButton = () => {
  const theme = useThemeStore((state) => state.getTheme())
  const activeBtn = useDashboardStore((state) => state.activeCategory)
  const setActiveBtn = useDashboardStore((state) => state.setActiveCategory)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {categoryButtonData.map((cat) => {
        const isActive = activeBtn === cat.value
        return (
          <button
            key={cat.id}
            onClick={() => setActiveBtn(cat.value)}
            className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
              isActive ? '' : theme.border
            }`}
            style={
              isActive
                ? {
                    borderColor: theme.accent,
                    backgroundColor: `${theme.accent}15`,
                  }
                : {
                    backgroundColor: `${theme.accent}05`,
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = `${theme.accent}80`
                e.currentTarget.style.backgroundColor = `${theme.accent}10`
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accentGlow}`
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.backgroundColor = `${theme.accent}05`
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = ''
              }
            }}
          >
            {/* Active Indicator Bar */}
            {isActive && (
              <div
                className="absolute top-0 left-0 right-0 h-1 animate-pulse"
                style={{ backgroundColor: theme.accent }}
              />
            )}

            <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                  style={
                    isActive
                      ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }
                      : { backgroundColor: `${theme.accent}20` }
                  }
                >
                  <span
                    className={`transition-colors ${isActive ? 'text-white' : ''}`}
                    style={!isActive ? { color: theme.accent } : {}}
                  >
                    {cat.icon}
                  </span>
                </div>

                {isActive && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center animate-scale-in"
                    style={{ backgroundColor: theme.accent }}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>

              <div className="text-left">
                <h3
                  className={`text-base font-bold mb-1 transition-colors ${
                    isActive ? theme.text : theme.text
                  }`}
                  style={isActive ? { color: theme.accent } : {}}
                >
                  {cat.label}
                </h3>
                <p className={`text-xs ${theme.textSecondary} line-clamp-2`}>{cat.description}</p>
              </div>

              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${theme.accentGlow}, transparent 70%)`,
                }}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}