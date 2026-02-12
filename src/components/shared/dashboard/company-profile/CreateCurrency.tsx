import React, { useState } from 'react'
import {
  DollarSign,
  Hash,
  Type,
  TrendingUp,
  Info,
} from 'lucide-react'
import { useThemeStore } from '../../../../store/themeStore'
import type { TCreateCurrencyInput } from '../../../../lib/apis/dashboard/companyApi'
import { useCreateCurrencyMutation } from '../../../../lib/mutations'
import useDashboardStore from '../../../../store/dashboardStore' 
import { FormActions } from './FormActions' 

interface CreateCurrencyProps {
  onComplete?: () => void
}

const CreateCurrency: React.FC<CreateCurrencyProps> = ({ onComplete }) => {
  const theme = useThemeStore((state) => state.getTheme())
  const addSavedCategory = useDashboardStore((state) => state.addSavedCategory)

  const [formData, setFormData] = useState<TCreateCurrencyInput>({
    crrcode: '',
    crrname: '',
    crrbase: 1,
    crrsymbol: '',
    rate: 0,
  })

  const [error, setError] = useState<string | null>(null)
  const { mutate: saveCurrency, isPending: isLoading } = useCreateCurrencyMutation()
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
   
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
  }

  // កែសម្រួល validation function
  const validateForm = (): { isValid: boolean; errorMessage?: string } => {
    if (!formData.crrcode.trim()) {
      return { isValid: false, errorMessage: 'Currency code is required' }
    }
    if (!formData.crrname.trim()) {
      return { isValid: false, errorMessage: 'Currency name is required' }
    }
    if (!formData.crrsymbol.trim()) {
      return { isValid: false, errorMessage: 'Currency symbol is required' }
    }
    if (formData.rate <= 0) {
      return { isValid: false, errorMessage: 'Exchange rate must be greater than 0' }
    }
    return { isValid: true }
  }

  const handleSave = () => {  // លុប async ព្រោះមិនត្រូវការ
    const validation = validateForm()
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Invalid form data')
      return
    }

    saveCurrency(formData, {
      onSuccess: () => {  // លុប parameter data ព្រោះមិនបានប្រើ
        setError(null)
        addSavedCategory('currency')
        if (onComplete) onComplete()
      },
      onError: (err) => {
        setError(err.message || 'មានបញ្ហាក្នុងការបង្កើតរូបិយប័ណ្ណ')
      }
    })
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
    if (!isLoading) {
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
              disabled={isLoading}
              className={`p-3 rounded-xl text-left transition-all border ${theme.border} disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ backgroundColor: `${theme.accent}10` }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = `${theme.accent}20`
                  e.currentTarget.style.borderColor = theme.accent
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
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
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  if (!isLoading) {
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
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  if (!isLoading) {
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
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  if (!isLoading) {
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
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  if (!isLoading) {
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
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: `${theme.accent}05` }}
                onFocus={(e) => {
                  if (!isLoading) {
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

      {/* ប្រើ FormActions component */}
      <FormActions
        onClear={handleClear}
        onSave={handleSave}
        theme={theme}
        isSaving={isLoading}
        isFormValid={formData.crrcode.trim() !== '' && formData.crrname.trim() !== '' && formData.crrsymbol.trim() !== '' && formData.rate > 0}
        currentCategory="currency"
      />

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