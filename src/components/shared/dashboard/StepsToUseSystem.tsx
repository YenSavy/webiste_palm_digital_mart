import React, { useState, useRef, useEffect } from 'react'
import { Building2, CreditCard, UserPlus, BookOpen, Check, Lock, ChevronRight, GitBranch, Warehouse, Briefcase, DollarSign } from 'lucide-react'
import { useThemeStore, type Theme } from '../../../store/themeStore'
import CreateCompany from './company-profile/CreateCompany'
import CreateBranch from './company-profile/CreateBranch' 
import useDashboardStore from '../../../store/dashboardStore'
import CreateWarehouse from './company-profile/CreateWarehouse'
import CreatePosition from './company-profile/CreatePosition'
import CreateCurrency from './company-profile/CreateCurrency'

interface SubStep {
  id: 'company' | 'branch' | 'warehouse' | 'position' | 'currency'
  label: string
  icon: React.ElementType
  completed: boolean
}

interface Step {
  id: string
  title: string
  description: string
  icon: React.ElementType
  completed: boolean
  hasSubSteps?: boolean
  subSteps?: SubStep[]
}

const StepsToUseSystem: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeCategory = useDashboardStore((state) => state.activeCategory)
  const setActiveCategory = useDashboardStore((state) => state.setActiveCategory)
  
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'company',
      title: 'Create Company',
      description: 'Set up your company profile and organizational structure',
      icon: Building2,
      completed: false,
      hasSubSteps: true,
      subSteps: [
        { id: 'company', label: 'Company Profile', icon: Building2, completed: false },
        { id: 'branch', label: 'Branch', icon: GitBranch, completed: false },
        { id: 'warehouse', label: 'Warehouse', icon: Warehouse, completed: false },
        { id: 'position', label: 'Position', icon: Briefcase, completed: false },
        { id: 'currency', label: 'Currency', icon: DollarSign, completed: false },
      ],
    },
    {
      id: 'subscription',
      title: 'Subscription',
      description: 'Choose and activate your subscription plan',
      icon: CreditCard,
      completed: false,
    },
    {
      id: 'user',
      title: 'Create User',
      description: 'Add users and assign roles',
      icon: UserPlus,
      completed: false,
    },
    {
      id: 'guide',
      title: 'User Guide',
      description: 'Learn how to use the system effectively',
      icon: BookOpen,
      completed: false,
    },
  ])

  const [currentStep, setCurrentStep] = useState(0)

  const areAllSubStepsCompleted = (step: Step): boolean => {
    if (!step.subSteps) return true
    return step.subSteps.every((subStep) => subStep.completed)
  }

  const getActiveSubStepIndex = (): number => {
    const companyStep = steps[0]
    if (!companyStep.subSteps) return 0
    const firstIncomplete = companyStep.subSteps.findIndex((sub) => !sub.completed)
    return firstIncomplete === -1 ? companyStep.subSteps.length - 1 : firstIncomplete
  }

  const getActiveStepIndex = () => {
    const firstIncompleteIndex = steps.findIndex((step) => !step.completed)
    return firstIncompleteIndex === -1 ? steps.length - 1 : firstIncompleteIndex
  }

  const activeStepIndex = getActiveStepIndex()
  const activeSubStepIndex = getActiveSubStepIndex()

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.children[currentStep] as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [currentStep])

  const handleCompleteSubStep = (subStepId: 'company' | 'branch' | 'warehouse' | 'position' | 'currency') => {
    const newSteps = [...steps]
    const companyStep = newSteps[0]
    
    if (!companyStep.subSteps) return

    const subStepIndex = companyStep.subSteps.findIndex((sub) => sub.id === subStepId)
    if (subStepIndex !== activeSubStepIndex) return

    companyStep.subSteps[subStepIndex].completed = true

    if (areAllSubStepsCompleted(companyStep)) {
      companyStep.completed = true
    }

    setSteps(newSteps)

    if (subStepIndex < companyStep.subSteps.length - 1) {
      setActiveCategory(companyStep.subSteps[subStepIndex + 1].id)
    } else if (companyStep.completed) {
      setCurrentStep(1) 
    }
  }

  const handleCompleteStep = (index: number) => {
    if (index !== activeStepIndex) return
    if (index === 0) return 

    const newSteps = [...steps]
    newSteps[index].completed = true
    setSteps(newSteps)

    if (index < steps.length - 1) {
      setCurrentStep(index + 1)
    }
  }

  const handleStepClick = (index: number) => {
    if (index <= activeStepIndex) {
      setCurrentStep(index)
    }
  }

const handleSubStepClick = (subStepId: 'company' | 'branch' | 'warehouse' | 'position' | 'currency') => {
  const companyStep = steps[0]
  if (!companyStep.subSteps) return
  
  const subStepIndex = companyStep.subSteps.findIndex((sub) => sub.id === subStepId)

  if (subStepIndex !== -1 && (subStepIndex <= activeSubStepIndex || companyStep.subSteps[subStepIndex].completed)) {
    setActiveCategory(subStepId) 
  }
}
  const isStepClickable = (index: number) => {
    return index <= activeStepIndex
  }

  const isStepActive = (index: number) => {
    return index === currentStep
  }

const isSubStepClickable = (subStep: SubStep, subStepIndex: number): boolean => {
  return subStep.completed || subStepIndex <= activeSubStepIndex
}

  if (!activeCategory) return null

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR - Progress Steps (keeping original code) */}
          <div className="lg:col-span-1">
            {/* Mobile Horizontal Scroll */}
            <div className="lg:hidden">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              >
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = isStepActive(index)
                  const isClickable = isStepClickable(index)
                  const isCompleted = step.completed

                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      disabled={!isClickable}
                      className={`flex-shrink-0 w-[280px] snap-center transition-all duration-300 ${
                        !isClickable && 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div
                        className={`p-4 rounded-2xl border ${theme.border} ${
                          isActive ? 'shadow-lg' : 'scale-95'
                        } transition-all duration-300`}
                        style={{
                          backgroundColor: isActive
                            ? `${theme.accent}20`
                            : isClickable && !isCompleted
                            ? `${theme.accent}10`
                            : 'transparent',
                          borderColor: isActive ? theme.accent : '',
                          borderWidth: isActive ? '2px' : '1px',
                        }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                              isCompleted
                                ? 'bg-green-500'
                                : !isClickable
                                ? 'bg-gray-600'
                                : ''
                            }`}
                            style={
                              isActive && !isCompleted
                                ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }
                                : {background: theme.accent}
                            }
                          >
                            {isCompleted ? (
                              <Check size={24} className="text-white" />
                            ) : !isClickable ? (
                              <Lock size={24} className="text-gray-400" />
                            ) : (
                              <Icon size={24} className={isActive ? 'text-white' : theme.textSecondary} />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <div
                              className={`font-bold text-xs mb-1 ${
                                isCompleted ? 'text-green-400' : theme.textSecondary
                              }`}
                              style={isActive && !isCompleted ? { color: theme.accent } : {}}
                            >
                              STEP {index + 1}
                            </div>
                            <div className={`font-semibold text-sm ${theme.text}`}>
                              {step.title}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1.5 justify-center">
                          {steps.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === index ? 'w-8' : 'w-1.5'
                              }`}
                              style={{
                                backgroundColor:
                                  idx === index
                                    ? theme.accent
                                    : idx < index
                                    ? `${theme.accent}60`
                                    : `${theme.accent}20`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              
              <div
                className={`mt-4 p-4 rounded-xl bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${theme.textSecondary}`}>Overall Progress</span>
                  <span className={`text-sm font-bold ${theme.text}`}>
                    {Math.round((steps.filter((s) => s.completed).length / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${(steps.filter((s) => s.completed).length / steps.length) * 100}%`,
                      backgroundColor: theme.accent,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Desktop Vertical (keeping the sub-steps section) */}
            <div className="hidden lg:block">
              <div
                className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6 sticky top-6`}
              >
                <h2 className={`text-lg font-bold ${theme.text} mb-6`}>Progress Steps</h2>
                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = isStepActive(index)
                    const isClickable = isStepClickable(index)
                    const isCompleted = step.completed

                    return (
                      <div key={step.id}>
                        <button
                          onClick={() => handleStepClick(index)}
                          disabled={!isClickable}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                            isActive
                              ? `shadow-lg`
                              : isClickable
                              ? 'hover:scale-105'
                              : 'opacity-50 cursor-not-allowed'
                          }`}
                          style={
                            isActive
                              ? {
                                  backgroundColor: `${theme.accent}20`,
                                  borderLeft: `4px solid ${theme.accent}`,
                                }
                              : isClickable && !isCompleted
                              ? { backgroundColor: `${theme.accent}10` }
                              : {}
                          }
                        >
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                              isCompleted
                                ? ''
                                : isActive
                                ? ''
                                : !isClickable
                                ? 'bg-gray-600'
                                : ''
                            }`}
                            style={
                              isActive && !isCompleted
                                ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }
                                : { background: theme.accent}
                            }
                          >
                            {isCompleted ? (
                              <Check size={24} className="text-white" />
                            ) : !isClickable ? (
                              <Lock size={24} className="text-gray-400" />
                            ) : (
                              <Icon size={24} className={isActive ? 'text-white' : theme.textSecondary} />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <div
                              className={`font-semibold text-sm ${
                                isCompleted ? theme.textSecondary : isActive ? theme.text : theme.textSecondary
                              }`}
                              style={isActive && !isCompleted ? { color: theme.accent } : {}}
                            >
                              Step {index + 1}
                            </div>
                            <div className={`text-xs ${isActive ? theme.text : theme.textSecondary}`}>
                              {step.title}
                            </div>
                          </div>
                          {isCompleted && (
                            <Check size={20} className={`${theme.textSecondary}`} />
                          )}
                        </button>

                        {index === 0 && isActive && step.subSteps && (
                          <div className="mt-3 ml-8 space-y-2" >
                            {step.subSteps.map((subStep, subIndex) => {
                              const SubIcon = subStep.icon
                              const isSubActive = activeCategory === subStep.id
                              const isSubClickable = isSubStepClickable(subStep, subIndex)
                              const isSubCompleted = subStep.completed

                              return (
                                <button
                                  key={subStep.id}
                                  onClick={() =>{ handleSubStepClick(subStep.id); setActiveCategory(subStep.id)}}
                                  disabled={!isSubClickable}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                    !isSubClickable && 'opacity-40 cursor-not-allowed'
                                  }`}
                                  style={
                                    isSubActive
                                      ? {
                                          backgroundColor: `${theme.accent}15`,
                                          borderLeft: `3px solid ${theme.accent}`,
                                        }
                                      : isSubClickable
                                      ? { backgroundColor: `${theme.accent}08` }
                                      : {}
                                  }
                                >
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                      isSubCompleted
                                        ? ''
                                        : !isSubClickable
                                        ? 'bg-gray-600'
                                        : ''
                                    }`}
                                    style={
                                      isSubActive && !isSubCompleted
                                        ? { backgroundColor: `${theme.accent}30` }
                                        : !isSubActive && isSubClickable && !isSubCompleted
                                        ? { backgroundColor: `${theme.accent}15` }
                                        : {background: theme.accent}
                                    }
                                  >
                                    {isSubCompleted ? (
                                      <Check size={16} className="text-white" />
                                    ) : !isSubClickable ? (
                                      <Lock size={16} className="text-gray-400" />
                                    ) : (
                                      <SubIcon
                                        size={16}
                                        style={isSubActive ? { color: theme.accent } : {}}
                                        className={!isSubActive ? theme.textSecondary : ''}
                                      />
                                    )}
                                  </div>
                                  <span
                                    className={`text-xs font-medium ${
                                      isSubCompleted
                                        ? theme.textSecondary
                                        : isSubActive
                                        ? theme.text
                                        : theme.textSecondary
                                    }`}
                                    style={isSubActive && !isSubCompleted ? { color: theme.accent } : {}}
                                  >
                                    {subStep.label}
                                  </span>
                                  {isSubCompleted && (
                                    <Check size={14} className={`${theme.textSecondary} ml-auto`} />
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        )}

                        {index < steps.length - 1 && (
                          <div className="flex justify-center py-2">
                            <ChevronRight
                              size={20}
                              className={`${theme.textSecondary} transform rotate-90`}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.border.split('-').pop() }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${theme.textSecondary}`}>Overall Progress</span>
                    <span className={`text-sm font-bold ${theme.text}`}>
                      {Math.round((steps.filter((s) => s.completed).length / steps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${(steps.filter((s) => s.completed).length / steps.length) * 100}%`,
                        backgroundColor: theme.accent,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Step Content */}
          <div className="lg:col-span-2">
            <div
              className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6 sm:p-8`}
            >
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = isStepActive(index)
                const isCompleted = step.completed
                const canComplete = index === activeStepIndex

                if (!isActive) return null

                return (
                  <div key={step.id} className="animate-fadeIn">
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center`}
                        style={
                          !isCompleted
                            ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }
                            : { background: theme.accent}
                        }
                      >
                        {isCompleted ? (
                          <Check size={32} className="text-white" />
                        ) : (
                          <Icon size={32} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${theme.textSecondary}`}>
                            Step {index + 1} of {steps.length}
                          </span>
                          {isCompleted && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                              Completed
                            </span>
                          )}
                        </div>
                        <h2 className={`text-2xl sm:text-3xl font-bold ${theme.text} mb-2`}>
                          {step.title}
                        </h2>
                        <p className={`${theme.textSecondary}`}>{step.description}</p>
                      </div>
                    </div>

                    {step.id === 'company' && step.subSteps && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-sm font-medium ${theme.textSecondary}`}>
                            Company Setup Progress
                          </span>
                          <span className={`text-sm font-bold ${theme.text}`}>
                            {step.subSteps.filter((s) => s.completed).length} / {step.subSteps.length}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {step.subSteps.map((subStep) => (
                            <div
                              key={subStep.id}
                              className="flex-1 h-2 rounded-full transition-all"
                              style={{
                                backgroundColor: subStep.completed
                                  ? theme.accent
                                  : subStep.id === activeCategory
                                  ? `${theme.accent}50`
                                  : `${theme.accent}20`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* UPDATED CONTENT RENDERING - Renders different forms based on activeCategory */}
                    <div className="mt-8">
                      {step.id === 'company' && (
                        <>
                          {activeCategory === 'company' && <CreateCompany />}
                          {activeCategory === 'branch' && (
                            <CreateBranch
                              onComplete={() => handleCompleteSubStep('branch')}
                              companyId="C001"
                            />
                          )}
                          {activeCategory === 'warehouse' && (
                            <CreateWarehouse onComplete={() => handleCompleteSubStep("warehouse")}/>
                          )}
                          {activeCategory === 'position' && (
                           <CreatePosition onComplete={() => handleCompleteSubStep("position")}/>
                          )}
                          {activeCategory === 'currency' && (
                            <CreateCurrency onComplete={() => handleCompleteSubStep("currency")}/>
                          )}
                        </>
                      )}

                      {step.id === 'subscription' && (
                        <StepContent
                          title="Choose Your Plan"
                          description="Select a subscription plan that fits your business needs."
                          fields={[
                            { label: 'Plan Selection', placeholder: 'Select a plan', type: 'select' },
                            { label: 'Billing Cycle', placeholder: 'Monthly or Yearly', type: 'select' },
                          ]}
                          theme={theme}
                        />
                      )}

                      {step.id === 'user' && (
                        <StepContent
                          title="Add Team Members"
                          description="Create user accounts for your team members."
                          fields={[
                            { label: 'Full Name', placeholder: 'Enter user full name', type: 'text' },
                            { label: 'Email Address', placeholder: 'user@company.com', type: 'email' },
                          ]}
                          theme={theme}
                        />
                      )}

                      {step.id === 'guide' && (
                        <div className="space-y-6">
                          <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                            Welcome! 🎉
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { title: 'Video Tutorials', desc: 'Watch step-by-step guides' },
                              { title: 'Documentation', desc: 'Read detailed instructions' },
                              { title: 'FAQ', desc: 'Find answers to questions' },
                              { title: 'Support', desc: 'Contact our support team' },
                            ].map((resource, idx) => (
                              <div
                                key={idx}
                                className={`p-4 rounded-xl border ${theme.border} transition-all cursor-pointer`}
                                style={{ backgroundColor: `${theme.accent}10` }}
                              >
                                <h4 className={`font-semibold ${theme.text} mb-1`}>{resource.title}</h4>
                                <p className={`text-sm ${theme.textSecondary}`}>{resource.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-8 pt-6 border-t" style={{ borderColor: theme.border.split('-').pop() }}>
                      {index > 0 && (
                        <button
                          onClick={() => setCurrentStep(index - 1)}
                          className={`px-6 py-3 rounded-xl font-medium transition-all border ${theme.border}`}
                          style={{ backgroundColor: `${theme.accent}10`, color: theme.textSecondary }}
                        >
                          Previous
                        </button>
                      )}
                      
                      {step.id === 'company' && !isCompleted && (
                        <button
                          onClick={() => handleCompleteSubStep(activeCategory)}
                          disabled={activeSubStepIndex !== step.subSteps?.findIndex(s => s.id === activeCategory)}
                          className="px-6 py-3 rounded-xl font-medium text-white transition-all shadow-lg flex items-center gap-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }}
                        >
                          {activeSubStepIndex === (step.subSteps?.length ?? 0) - 1 ? 'Complete Company Setup' : `Complete ${step.subSteps?.find(s => s.id === activeCategory)?.label}`}
                          <Check size={20} />
                        </button>
                      )}

                      {step.id !== 'company' && canComplete && !isCompleted && (
                        <button
                          onClick={() => handleCompleteStep(index)}
                          className="px-6 py-3 rounded-xl font-medium text-white transition-all shadow-lg flex items-center gap-2 ml-auto"
                          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }}
                        >
                          Complete Step
                          <Check size={20} />
                        </button>
                      )}

                      {isCompleted && index < steps.length - 1 && (
                        <button
                          onClick={() => setCurrentStep(index + 1)}
                          className="px-6 py-3 rounded-xl font-medium text-white transition-all shadow-lg flex items-center gap-2 ml-auto"
                          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }}
                        >
                          Next Step
                          <ChevronRight size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

interface StepContentProps {
  title: string
  description: string
  fields: Array<{ label: string; placeholder: string; type: string }>
  theme: Theme
}

const StepContent: React.FC<StepContentProps> = ({ title, description, fields, theme }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-xl font-bold ${theme.text} mb-2`}>{title}</h3>
        <p className={`${theme.textSecondary}`}>{description}</p>
      </div>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>{field.label}</label>
            {field.type === 'select' ? (
              <select
                className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.text} focus:outline-none transition-all`}
                style={{ backgroundColor: `${theme.accent}05` }}
              >
                <option>{field.placeholder}</option>
              </select>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all`}
                style={{ backgroundColor: `${theme.accent}05` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepsToUseSystem