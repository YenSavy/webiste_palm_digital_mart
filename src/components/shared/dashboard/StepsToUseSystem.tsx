import React, { useState, useRef, useEffect } from 'react'
import {
  Building2,
  CreditCard,
  UserPlus,
  BookOpen,
  Check,
  ChevronRight,
  GitBranch,
  Warehouse,
  Briefcase,
  DollarSign
} from 'lucide-react'
import { useThemeStore, type Theme } from '../../../store/themeStore'
import CreateCompany from './company-profile/CreateCompany'
import CreateBranch from './company-profile/CreateBranch'
import useDashboardStore from '../../../store/dashboardStore'
import CreateWarehouse from './company-profile/CreateWarehouse'
import CreatePosition from './company-profile/CreatePosition'
import CreateCurrency from './company-profile/CreateCurrency'
import SubscriptionStep from './steps-use-system-contents/SubscriptionStep'

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
        { id: 'currency', label: 'Currency', icon: DollarSign, completed: false }
      ]
    },
    {
      id: 'subscription',
      title: 'Subscription',
      description: 'Choose and activate your subscription plan',
      icon: CreditCard,
      completed: false
    },
    {
      id: 'user',
      title: 'Create User',
      description: 'Add users and assign roles',
      icon: UserPlus,
      completed: false
    },
    {
      id: 'guide',
      title: 'User Guide',
      description: 'Learn how to use the system effectively',
      icon: BookOpen,
      completed: false
    }
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

  const handleCompleteSubStep = (
    subStepId: 'company' | 'branch' | 'warehouse' | 'position' | 'currency'
  ) => {
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

  const isStepActive = (index: number) => {
    return index === currentStep
  }

  if (!activeCategory) return null

  return (
    <div className="">
      <div className="w-full">
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
                        : { background: theme.accent }
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
                              : `${theme.accent}20`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

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
                        <CreateWarehouse onComplete={() => handleCompleteSubStep('warehouse')} />
                      )}
                      {activeCategory === 'position' && (
                        <CreatePosition onComplete={() => handleCompleteSubStep('position')} />
                      )}
                      {activeCategory === 'currency' && (
                        <CreateCurrency onComplete={() => handleCompleteSubStep('currency')} />
                      )}
                    </>
                  )}

                  {step.id === 'subscription' && <SubscriptionStep />}

                  {step.id === 'user' && (
                    <StepContent
                      title="Add Team Members"
                      description="Create user accounts for your team members."
                      fields={[
                        { label: 'Full Name', placeholder: 'Enter user full name', type: 'text' },
                        { label: 'Email Address', placeholder: 'user@company.com', type: 'email' }
                      ]}
                      theme={theme}
                    />
                  )}

                  {step.id === 'guide' && (
                    <div className="space-y-6">
                      <h3 className={`text-xl font-bold ${theme.text} mb-4`}>Welcome! 🎉</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { title: 'Video Tutorials', desc: 'Watch step-by-step guides' },
                          { title: 'Documentation', desc: 'Read detailed instructions' },
                          { title: 'FAQ', desc: 'Find answers to questions' },
                          { title: 'Support', desc: 'Contact our support team' }
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

                <div
                  className="flex items-center gap-4 mt-8 pt-6 border-t"
                  style={{ borderColor: theme.border.split('-').pop() }}
                >
                  {index > 0 && (
                    <button
                      onClick={() => setCurrentStep(index - 1)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all border ${theme.border}`}
                      style={{ backgroundColor: `${theme.accent}10`, color: theme.textSecondary }}
                    >
                      Previous
                    </button>
                  )}

                  {/* The standalone "Complete" button for company sub‑steps has been removed.
                      Completion is now triggered solely via the "Complete X" button inside each form (FormActions). */}

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