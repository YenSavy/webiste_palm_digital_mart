import React, { useState, useRef, useEffect } from 'react'
import { Building2, CreditCard, UserPlus, BookOpen, Check, Lock, ChevronRight } from 'lucide-react'
import { useThemeStore } from '../../../store/themeStore'

interface Step {
  id: string
  title: string
  description: string
  icon: React.ElementType
  completed: boolean
}

const StepsToUseSystem: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'company',
      title: 'Create Company',
      description: 'Set up your company profile and information',
      icon: Building2,
      completed: false,
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

  const getActiveStepIndex = () => {
    const firstIncompleteIndex = steps.findIndex((step) => !step.completed)
    return firstIncompleteIndex === -1 ? steps.length - 1 : firstIncompleteIndex
  }

  const activeStepIndex = getActiveStepIndex()

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.children[currentStep] as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [currentStep])

  const handleCompleteStep = (index: number) => {
    if (index !== activeStepIndex) return

    const newSteps = [...steps]
    newSteps[index].completed = true
    setSteps(newSteps)

    if (index < steps.length - 1) {
      setCurrentStep(index + 1)
    }
  }

  // Handle step click
  const handleStepClick = (index: number) => {
    if (index <= activeStepIndex) {
      setCurrentStep(index)
    }
  }

  const isStepClickable = (index: number) => {
    return index <= activeStepIndex
  }

  const isStepActive = (index: number) => {
    return index === currentStep
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className={`text-3xl sm:text-4xl font-bold ${theme.text} mb-2`}>
          Getting Started
        </h1>
        <p className={`${theme.textSecondary} text-sm sm:text-base`}>
          Complete these steps to start using the system
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="lg:hidden">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
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
                                : {}
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
                        
                        {/* Progress indicator dots */}
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
              
              {/* Progress Bar Mobile */}
              <div
                className={`mt-4 p-4 rounded-xl bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${theme.textSecondary}`}>Overall Progress</span>
                  <span className={`text-sm font-bold ${theme.text}`}>
                    {Math.round((steps.filter((s) => s.completed).length / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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

            {/* Desktop Vertical */}
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
                                ? 'bg-green-500'
                                : isActive
                                ? ''
                                : !isClickable
                                ? 'bg-gray-600'
                                : ''
                            }`}
                            style={
                              isActive && !isCompleted
                                ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }
                                : {}
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
                                isCompleted ? 'text-green-400' : isActive ? theme.text : theme.textSecondary
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
                            <Check size={20} className="text-green-400 flex-shrink-0" />
                          )}
                        </button>
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

                {/* Progress Bar Desktop */}
                <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.border.split('-').pop() }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${theme.textSecondary}`}>Overall Progress</span>
                    <span className={`text-sm font-bold ${theme.text}`}>
                      {Math.round((steps.filter((s) => s.completed).length / steps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
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

          {/* Step Content - Right Side */}
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
                    {/* Step Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
                          isCompleted ? 'bg-green-500' : ''
                        }`}
                        style={
                          !isCompleted
                            ? { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }
                            : {}
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

                    {/* Step Content Based on ID */}
                    <div className="mt-8">
                      {step.id === 'company' && (
                        <StepContent
                          title="Company Information"
                          description="Please provide your company details to get started. This information will be used across the platform."
                          fields={[
                            { label: 'Company Name', placeholder: 'Enter company name', type: 'text' },
                            { label: 'Business Type', placeholder: 'Select business type', type: 'select' },
                            { label: 'Tax ID', placeholder: 'Enter tax identification number', type: 'text' },
                            { label: 'Address', placeholder: 'Enter company address', type: 'textarea' },
                          ]}
                          theme={theme}
                        />
                      )}

                      {step.id === 'subscription' && (
                        <StepContent
                          title="Choose Your Plan"
                          description="Select a subscription plan that fits your business needs. You can upgrade or downgrade anytime."
                          fields={[
                            { label: 'Plan Selection', placeholder: 'Select a plan', type: 'select' },
                            { label: 'Billing Cycle', placeholder: 'Monthly or Yearly', type: 'select' },
                            { label: 'Payment Method', placeholder: 'Credit card, PayPal, etc.', type: 'select' },
                          ]}
                          theme={theme}
                        />
                      )}

                      {step.id === 'user' && (
                        <StepContent
                          title="Add Team Members"
                          description="Create user accounts for your team members and assign appropriate roles and permissions."
                          fields={[
                            { label: 'Full Name', placeholder: 'Enter user full name', type: 'text' },
                            { label: 'Email Address', placeholder: 'user@company.com', type: 'email' },
                            { label: 'Role', placeholder: 'Select user role', type: 'select' },
                            { label: 'Department', placeholder: 'Select department', type: 'select' },
                          ]}
                          theme={theme}
                        />
                      )}

                      {step.id === 'guide' && (
                        <div className="space-y-6">
                          <div>
                            <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                              Welcome to the System! 🎉
                            </h3>
                            <p className={`${theme.textSecondary} mb-4`}>
                              Congratulations on completing the setup! Here are some helpful resources to get you started:
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { title: 'Video Tutorials', desc: 'Watch step-by-step guides' },
                              { title: 'Documentation', desc: 'Read detailed instructions' },
                              { title: 'FAQ', desc: 'Find answers to common questions' },
                              { title: 'Support', desc: 'Contact our support team' },
                            ].map((resource, idx) => (
                              <div
                                key={idx}
                                className={`p-4 rounded-xl border ${theme.border} transition-all cursor-pointer`}
                                style={{ backgroundColor: `${theme.accent}10` }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.05)'
                                  e.currentTarget.style.borderColor = theme.accent
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)'
                                  e.currentTarget.style.borderColor = ''
                                }}
                              >
                                <h4 className={`font-semibold ${theme.text} mb-1`}>{resource.title}</h4>
                                <p className={`text-sm ${theme.textSecondary}`}>{resource.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-8 pt-6 border-t" style={{ borderColor: theme.border.split('-').pop() }}>
                      {index > 0 && (
                        <button
                          onClick={() => setCurrentStep(index - 1)}
                          className={`px-6 py-3 rounded-xl font-medium transition-all ${theme.textSecondary} border ${theme.border}`}
                          style={{ backgroundColor: `${theme.accent}10` }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${theme.accent}20`
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = `${theme.accent}10`
                          }}
                        >
                          Previous
                        </button>
                      )}
                      {canComplete && !isCompleted && (
                        <button
                          onClick={() => handleCompleteStep(index)}
                          className="px-6 py-3 rounded-xl font-medium text-white transition-all shadow-lg flex items-center gap-2 ml-auto"
                          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)'
                            e.currentTarget.style.boxShadow = `0 10px 40px ${theme.accentGlow}`
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
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
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

// Helper component for step content
interface StepContentProps {
  title: string
  description: string
  fields: Array<{ label: string; placeholder: string; type: string }>
  theme: any
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
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                placeholder={field.placeholder}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.accent
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentGlow}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              />
            ) : field.type === 'select' ? (
              <select
                className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.text} focus:outline-none transition-all`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.accent
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentGlow}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <option>{field.placeholder}</option>
              </select>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.accent
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentGlow}`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepsToUseSystem