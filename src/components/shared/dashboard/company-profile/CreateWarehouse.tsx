import React, { useState } from 'react'
import {
  Warehouse,
  Building2,
  MapPin,
  FileText,
  Save,
  Trash2,
  Loader2,
  CheckCircle,
  GitBranch,
} from 'lucide-react'
import { useThemeStore } from '../../../../store/themeStore'

export type TCreateWarehouseInput = {
  company: number
  branch: number
  warehouse_km: string
  warehouse_en: string
  address: string
  description: string
}

interface CreateWarehouseProps {
  onComplete?: () => void
  companyId?: number
  branchId?: number
}

const CreateWarehouse: React.FC<CreateWarehouseProps> = ({ 
  onComplete, 
  companyId = 1,
  branchId = 1 
}) => {
  const theme = useThemeStore((state) => state.getTheme())

  const [formData, setFormData] = useState<TCreateWarehouseInput>({
    company: companyId,
    branch: branchId,
    warehouse_km: '',
    warehouse_en: '',
    address: '',
    description: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (error) setError(null)
  }

  const handleClear = () => {
    setFormData({
      company: companyId,
      branch: branchId,
      warehouse_km: '',
      warehouse_en: '',
      address: '',
      description: '',
    })
    setError(null)
    setIsSuccess(false)
  }

  const validateForm = (): boolean => {
    if (!formData.warehouse_en.trim()) {
      setError('Warehouse name (English) is required')
      return false
    }
    if (!formData.warehouse_km.trim()) {
      setError('Warehouse name (Khmer) is required')
      return false
    }
    if (!formData.address.trim()) {
      setError('Address is required')
      return false
    }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

      console.log('Creating warehouse with data:', formData)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSuccess(true)

      setTimeout(() => {
        if (onComplete) {
          onComplete()
        }
      }, 1000)

  }

  return (
    <div className="space-y-6">
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
              Warehouse created successfully!
            </p>
            <p className={`text-sm ${theme.textSecondary}`}>
              The warehouse has been added to your branch.
            </p>
          </div>
        </div>
      )}

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

      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: `${theme.accent}08` }}>
        <div className="flex items-center gap-2">
          <Building2 size={16} style={{ color: theme.accent }} />
          <span className={`text-sm ${theme.textSecondary}`}>
            Company: <span className={`font-medium ${theme.text}`}>#{companyId}</span>
          </span>
        </div>
        <div className="h-4 w-px bg-gray-600" />
        <div className="flex items-center gap-2">
          <GitBranch size={16} style={{ color: theme.accent }} />
          <span className={`text-sm ${theme.textSecondary}`}>
            Branch: <span className={`font-medium ${theme.text}`}>#{branchId}</span>
          </span>
        </div>
      </div>

      <div>
        <h3 className={`text-xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
          <Warehouse size={20} style={{ color: theme.accent }} />
          Warehouse Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Warehouse Name (Khmer) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Warehouse
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="warehouse_km"
                value={formData.warehouse_km}
                onChange={handleInputChange}
                placeholder="ឃ្លាំងថ្មី"
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

          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Warehouse Name (English) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Warehouse
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="warehouse_en"
                value={formData.warehouse_en}
                onChange={handleInputChange}
                placeholder="New Warehouse"
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

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className={`absolute left-3 top-3 ${theme.textSecondary}`}
              />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Phnom Penh"
                rows={3}
                disabled={isLoading || isSuccess}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
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

          {/* Description - Full Width */}
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Description
            </label>
            <div className="relative">
              <FileText
                size={18}
                className={`absolute left-3 top-3 ${theme.textSecondary}`}
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter warehouse description..."
                rows={4}
                disabled={isLoading || isSuccess}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
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
        </div>
      </div>

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
              Creating Warehouse...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle size={20} />
              Warehouse Created!
            </>
          ) : (
            <>
              <Save size={20} />
              Save Warehouse
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

export default CreateWarehouse