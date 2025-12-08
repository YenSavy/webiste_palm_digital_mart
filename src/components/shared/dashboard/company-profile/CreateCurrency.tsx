import React, { useState } from 'react'
import {
  DollarSign,
  Hash,
  Type,
  TrendingUp,
  Save,
  Trash2,
  Loader2,
  CheckCircle,
  Info,
} from 'lucide-react'
import { useThemeStore } from '../../../../store/themeStore'

export type TCreateCurrencyInput = {
  crrcode: string
  crrname: string
  crrbase: number
  crrsymbol: string
  rate: number
}

interface CreateCurrencyProps {
  onComplete?: () => void
}

const CreateCurrency: React.FC<CreateCurrencyProps> = ({ onComplete }) => {
  const theme = useThemeStore((state) => state.getTheme())

  const [formData, setFormData] = useState<TCreateCurrencyInput>({
    crrcode: '',
    crrname: '',
    crrbase: 1,
    crrsymbol: '',
    rate: 0,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Handle numeric fields
    if (name === 'crrbase' || name === 'rate') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseFloat(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
    
    if (error) setError(null)
  }

  const handleClear = () => {
    setFormData({
      crrcode: '',
      crrname: '',
      crrbase: 1,
      crrsymbol: '',
      rate: 0,
    })
    setError(null)
    setIsSuccess(false)
  }

  const validateForm = (): boolean => {
    if (!formData.crrcode.trim()) {
      setError('Currency code is required')
      return false
    }
    if (!formData.crrname.trim()) {
      setError('Currency name is required')
      return false
    }
    if (!formData.crrsymbol.trim()) {
      setError('Currency symbol is required')
      return false
    }
    if (formData.rate <= 0) {
      setError('Exchange rate must be greater than 0')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

      console.log('Creating currency with data:', formData)
 
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSuccess(true)

      // Call onComplete callback after 1 second
      setTimeout(() => {
        if (onComplete) {
          onComplete()
        }
      }, 1000)

  }

  // Quick select currency options
  const quickCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 4100 },
    { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', rate: 1 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 4500 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 570 },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 0.17 },
  ]

  const handleQuickSelect = (currency: typeof quickCurrencies[0]) => {
    if (!isLoading && !isSuccess) {
      setFormData({
        crrcode: currency.code,
        crrname: currency.name,
        crrbase: 1,
        crrsymbol: currency.symbol,
        rate: currency.rate,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {isSuccess && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl border-2 animate-fadeIn"
          style={{
            backgroundColor: '#10B98120',
            borderColor: '#10B981',
          }}
        >
          <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
          <div>
            <p className={`font-semibold ${theme.text}`} style={{ color: '#10B981' }}>
              Currency created successfully!
            </p>
            <p className={`text-sm ${theme.textSecondary}`}>
              The currency has been added to your system.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl border-2 animate-fadeIn"
          style={{
            backgroundColor: '#EF444420',
            borderColor: '#EF4444',
          }}
        >
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <p className={`text-sm ${theme.text}`} style={{ color: '#EF4444' }}>
            {error}
          </p>
        </div>
      )}

      {/* Info Notice */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${theme.border}`} style={{ backgroundColor: `${theme.accent}08` }}>
        <Info size={20} className="flex-shrink-0 mt-0.5" style={{ color: theme.accent }} />
        <div>
          <p className={`text-sm ${theme.text} font-medium mb-1`}>Currency Exchange Information</p>
          <p className={`text-xs ${theme.textSecondary}`}>
            Set the base currency (usually 1) and enter the exchange rate relative to your local currency. 
            For example: 1 USD = 4100 KHR
          </p>
        </div>
      </div>

      {/* Quick Select Currencies */}
      <div className={`p-4 rounded-xl border ${theme.border}`} style={{ backgroundColor: `${theme.accent}05` }}>
        <h4 className={`text-sm font-semibold ${theme.text} mb-3 flex items-center gap-2`}>
          <DollarSign size={16} style={{ color: theme.accent }} />
          Quick Select Currency
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickCurrencies.map((currency, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickSelect(currency)}
              disabled={isLoading || isSuccess}
              className={`p-3 rounded-xl text-left transition-all border ${theme.border} disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ backgroundColor: `${theme.accent}10` }}
              onMouseEnter={(e) => {
                if (!isLoading && !isSuccess) {
                  e.currentTarget.style.backgroundColor = `${theme.accent}20`
                  e.currentTarget.style.borderColor = theme.accent
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !isSuccess) {
                  e.currentTarget.style.backgroundColor = `${theme.accent}10`
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-lg font-bold ${theme.text}`}>{currency.symbol}</span>
                <span className={`text-xs font-mono ${theme.textSecondary}`}>{currency.code}</span>
              </div>
              <div className={`text-xs ${theme.text} font-medium`}>{currency.name}</div>
              <div className={`text-xs ${theme.textSecondary} mt-1`}>
                Rate: {currency.rate.toLocaleString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Currency Information Section */}
      <div>
        <h3 className={`text-xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
          <DollarSign size={20} style={{ color: theme.accent }} />
          Currency Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Currency Code */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Currency Code <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Hash
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="crrcode"
                value={formData.crrcode}
                onChange={handleInputChange}
                placeholder="USD"
                maxLength={3}
                disabled={isLoading || isSuccess}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  if (!isLoading && !isSuccess) {
                    e.currentTarget.style.borderColor = theme.accent
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentGlow}`
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              />
            </div>
            <p className={`text-xs ${theme.textSecondary} mt-1`}>3-letter ISO code (e.g., USD, EUR)</p>
          </div>

          {/* Currency Name */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Currency Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Type
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="crrname"
                value={formData.crrname}
                onChange={handleInputChange}
                placeholder="US Dollar"
                disabled={isLoading || isSuccess}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  if (!isLoading && !isSuccess) {
                    e.currentTarget.style.borderColor = theme.accent
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentGlow}`
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              />
            </div>
          </div>

          {/* Currency Symbol */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Currency Symbol <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <DollarSign
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="crrsymbol"
                value={formData.crrsymbol}
                onChange={handleInputChange}
                placeholder="$"
                maxLength={5}
                disabled={isLoading || isSuccess}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  if (!isLoading && !isSuccess) {
                    e.currentTarget.style.borderColor = theme.accent
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentGlow}`
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              />
            </div>
            <p className={`text-xs ${theme.textSecondary} mt-1`}>Symbol (e.g., $, €, £, ¥)</p>
          </div>

          {/* Base Amount */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Base Amount
            </label>
            <div className="relative">
              <Hash
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="number"
                name="crrbase"
                value={formData.crrbase}
                onChange={handleInputChange}
                placeholder="1"
                min="1"
                step="1"
                disabled={isLoading || isSuccess}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  if (!isLoading && !isSuccess) {
                    e.currentTarget.style.borderColor = theme.accent
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentGlow}`
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              />
            </div>
            <p className={`text-xs ${theme.textSecondary} mt-1`}>Usually 1</p>
          </div>

          {/* Exchange Rate - Full Width */}
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Exchange Rate <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <TrendingUp
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                placeholder="4100"
                min="0"
                step="0.01"
                disabled={isLoading || isSuccess}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  if (!isLoading && !isSuccess) {
                    e.currentTarget.style.borderColor = theme.accent
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentGlow}`
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = ''
                  e.currentTarget.style.boxShadow = ''
                }}
              />
            </div>
            <p className={`text-xs ${theme.textSecondary} mt-1`}>
              Rate relative to local currency (e.g., 1 USD = 4100 KHR)
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      {formData.crrcode && formData.crrsymbol && formData.rate > 0 && (
        <div className={`p-4 rounded-xl border ${theme.border}`} style={{ backgroundColor: `${theme.accent}08` }}>
          <h4 className={`text-sm font-semibold ${theme.text} mb-3`}>Preview</h4>
          <div className={`text-2xl font-bold ${theme.text}`}>
            {formData.crrbase} {formData.crrcode} ({formData.crrsymbol}) = {formData.rate.toLocaleString()} KHR
          </div>
          <p className={`text-xs ${theme.textSecondary} mt-2`}>
            This exchange rate will be used for currency conversions in your system
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading || isSuccess}
          className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border ${theme.border} disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{ backgroundColor: `${theme.accent}10`, color: theme.textSecondary }}
          onMouseEnter={(e) => {
            if (!isLoading && !isSuccess) {
              e.currentTarget.style.backgroundColor = `${theme.accent}20`
              e.currentTarget.style.borderColor = theme.accent
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && !isSuccess) {
              e.currentTarget.style.backgroundColor = `${theme.accent}10`
              e.currentTarget.style.borderColor = ''
            }
          }}
        >
          <Trash2 size={20} />
          Clear Form
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading || isSuccess}
          className="px-8 py-3 rounded-xl font-medium text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }}
          onMouseEnter={(e) => {
            if (!isLoading && !isSuccess) {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = `0 10px 40px ${theme.accentGlow}`
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && !isSuccess) {
              e.currentTarget.style.transform = 'scale(1)'
            }
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Creating Currency...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle size={20} />
              Currency Created!
            </>
          ) : (
            <>
              <Save size={20} />
              Save Currency
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default CreateCurrency