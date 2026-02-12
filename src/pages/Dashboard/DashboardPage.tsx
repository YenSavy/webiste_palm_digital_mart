import React, { type JSX, useState, useEffect } from 'react';
import StepsToUseSystem from '../../components/shared/dashboard/StepsToUseSystem';
import { useThemeStore } from '../../store/themeStore';
import { Building2, GitBranch, Warehouse, Briefcase, DollarSign, Lock, CheckCircle2 } from 'lucide-react';
import useDashboardStore from '../../store/dashboardStore';

const DashboardPage: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());

  return (
    <div>
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
  );
};

export default DashboardPage;

type TCatBtn = {
  id: string;
  label: string;
  value: 'company' | 'branch' | 'warehouse' | 'position' | 'currency';
  icon: JSX.Element;
  description: string;
};

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
];

const CategoryButton = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const activeBtn = useDashboardStore((state) => state.activeCategory);
  const setActiveBtn = useDashboardStore((state) => state.setActiveCategory);
  const savedCategories = useDashboardStore((state) => state.savedCategories || []);

  const categorySequence: TCatBtn['value'][] = ['company', 'branch', 'warehouse', 'position', 'currency'];
  const [lockedCategories, setLockedCategories] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newLockedStatus: Record<string, boolean> = {};
    const newIsSaved: Record<string, boolean> = {};

    categorySequence.forEach((category, index) => {
      const isCategorySaved = savedCategories.includes(category);
      newIsSaved[category] = isCategorySaved;

      if (index === 0) {
        // First category (Company) is never locked
        newLockedStatus[category] = false;
      } else {
        // Check if the previous category has been saved
        const previousCategory = categorySequence[index - 1];
        const isPreviousSaved = savedCategories.includes(previousCategory);
        newLockedStatus[category] = !isPreviousSaved;
      }
    });

    setLockedCategories(newLockedStatus);
    setIsSaved(newIsSaved);
  }, [savedCategories]);

  const handleCategoryClick = (value: TCatBtn['value'], isLocked: boolean) => {
    if (isLocked) {
      const currentIndex = categorySequence.indexOf(value);
      const previousCategory = categorySequence[currentIndex - 1];
      const previousCategoryName = previousCategory.charAt(0).toUpperCase() + previousCategory.slice(1);

      alert(`សូមបំពេញព័ត៌មាន ${previousCategoryName} និងចុច SAVE ជាមុនសិន`);
      return;
    }

    setActiveBtn(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {categoryButtonData.map((cat) => {
        const isActive = activeBtn === cat.value;
        const isLocked = lockedCategories[cat.value] || false;
        const isCategorySaved = isSaved[cat.value] || false;

        return (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.value, isLocked)}
            disabled={isLocked}
            className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
              isActive ? '' : theme.border
            } ${isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            style={
              isActive
                ? {
                    borderColor: theme.accent,
                    backgroundColor: `${theme.accent}15`,
                  }
                : isLocked
                ? {
                    backgroundColor: `${theme.textSecondary}10`,
                    borderColor: `${theme.textSecondary}30`,
                  }
                : {
                    backgroundColor: `${theme.accent}05`,
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive && !isLocked) {
                e.currentTarget.style.borderColor = `${theme.accent}80`;
                e.currentTarget.style.backgroundColor = `${theme.accent}10`;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accentGlow}`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive && !isLocked) {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.backgroundColor = `${theme.accent}05`;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
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

            {/* Lock Overlay */}
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-[1px] rounded-2xl z-10">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${theme.accent}40` }}
                >
                  <Lock size={20} className={theme.text} />
                </div>
              </div>
            )}

            {/* Saved Indicator */}
            {isCategorySaved && !isActive && (
              <div className="absolute top-3 right-3 z-10">
                <CheckCircle2 size={20} className="text-green-500" />
              </div>
            )}

            <div className="p-5 relative z-0">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  } ${isLocked ? 'opacity-60' : ''}`}
                  style={
                    isActive
                      ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }
                      : isLocked
                      ? { backgroundColor: `${theme.textSecondary}20` }
                      
                      : { backgroundColor: `${theme.accent}20` }
                  }
                >
                  <span
                    className={`transition-colors ${isActive ? 'text-white' : ''} ${
                      isLocked ? theme.textSecondary : ''
                    }`}
                    style={!isActive && !isLocked ? { color: theme.accent } : {}}
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
                  } ${isLocked ? theme.textSecondary : ''}`}
                  style={isActive ? { color: theme.accent } : {}}
                >
                  {cat.label}
                  {isLocked && <span className="ml-1 text-xs">(Locked)</span>}
                </h3>
                <p className={`text-xs ${isLocked ? theme.textSecondary : theme.textSecondary} line-clamp-2`}>
                  {cat.description}
                </p>
              </div>

              {isCategorySaved && (
                <div className="mt-2">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${theme.accent}20`, color: theme.accent }}
                  >
                    Saved ✓
                  </span>
                </div>
              )}

              <div
                className={`absolute inset-0 opacity-0 transition-opacity pointer-events-none ${
                  !isLocked ? 'group-hover:opacity-100' : ''
                }`}
                style={{
                  background: `radial-gradient(circle at center, ${theme.accentGlow}, transparent 70%)`,
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};