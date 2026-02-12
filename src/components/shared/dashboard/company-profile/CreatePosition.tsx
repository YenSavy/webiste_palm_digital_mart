import React, { useState } from 'react'
import {
  Briefcase,
  Building2,
  FileText,
} from 'lucide-react'
import { useThemeStore } from '../../../../store/themeStore'
import { useCreatePositionMutation } from '../../../../lib/mutations'
import type { TCreatePositionInput } from '../../../../lib/apis/dashboard/companyApi'
import useDashboardStore from '../../../../store/dashboardStore' 
import { FormActions } from './FormActions' 

interface CreatePositionProps {
  onComplete?: () => void;
  companyId?: string;
}

const CreatePosition: React.FC<CreatePositionProps> = ({ 
  onComplete, 
  companyId = "1" 
}) => {
  const theme = useThemeStore((state) => state.getTheme());
  const addSavedCategory = useDashboardStore((state) => state.addSavedCategory);

  const [formData, setFormData] = useState<TCreatePositionInput>({
    company_id: companyId,
    position_km: '',
    position_en: '',
    description: '',
  });

  const { mutate: savePosition, isPending: isLoading } = useCreatePositionMutation();
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError(null);
  };

  const handleClear = () => {
    setFormData({
      company_id: companyId,
      position_km: '',
      position_en: '',
      description: '',
    });
    setError(null);
  };

  // Validation function
  const validateForm = (): { isValid: boolean; errorMessage?: string } => {
    if (!formData.position_en.trim()) {
      return { isValid: false, errorMessage: 'Position name (English) is required' };
    }
    if (!formData.position_km.trim()) {
      return { isValid: false, errorMessage: 'Position name (Khmer) is required' };
    }
    return { isValid: true };
  };

  const handleSave = () => {
    const validation = validateForm();
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Invalid form data');
      return;
    }

    savePosition(formData, {
      onSuccess: () => {
        setError(null);
        addSavedCategory('position');
        if (onComplete) onComplete();
      },
      onError: (err) => {
        setError(err.message || 'មានបញ្ហាក្នុងការបង្កើតតួនាទី');
      }
    });
  };

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

      {/* Company Info Display */}
      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: `${theme.accent}08` }}>
        <div className="flex items-center gap-2">
          <Building2 size={16} style={{ color: theme.accent }} />
          <span className={`text-sm ${theme.textSecondary}`}>
            Company: <span className={`font-medium ${theme.text}`}>#{companyId}</span>
          </span>
        </div>
      </div>

      {/* Position Information Section */}
      <div>
        <h3 className={`text-xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
          <Briefcase size={20} style={{ color: theme.accent }} />
          Position Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position Name Khmer */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Position Name (Khmer) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Briefcase
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="position_km"
                value={formData.position_km}
                onChange={handleInputChange}
                placeholder="ប្រធានផ្នែក"
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

         
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Position Name (English) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Briefcase
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="position_en"
                value={formData.position_en}
                onChange={handleInputChange}
                placeholder="Department Head"
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
                placeholder="Main manager"
                rows={4}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
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
        </div>
      </div>

     
      <div className={`p-4 rounded-xl border ${theme.border}`} style={{ backgroundColor: `${theme.accent}05` }}>
        <h4 className={`text-sm font-semibold ${theme.text} mb-3 flex items-center gap-2`}>
          <Briefcase size={16} style={{ color: theme.accent }} />
          Common Positions
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { km: 'នាយក', en: 'Director' },
            { km: 'អ្នកគ្រប់គ្រង', en: 'Manager' },
            { km: 'ប្រធានផ្នែក', en: 'Department Head' },
            { km: 'កម្មករ', en: 'Staff' },
            { km: 'គណនេយ្យករ', en: 'Accountant' },
            { km: 'អ្នកលក់', en: 'Sales' },
            { km: 'បច្ចេកទេស', en: 'Technician' },
            { km: 'អ្នកជំនួយការ', en: 'Assistant' },
          ].map((pos, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (!isLoading) {
                  setFormData({
                    ...formData,
                    position_km: pos.km,
                    position_en: pos.en,
                  })
                }
              }}
              disabled={isLoading}
              className={`px-3 py-2 rounded-lg text-xs transition-all border ${theme.border} disabled:opacity-50 disabled:cursor-not-allowed`}
              style={{ backgroundColor: `${theme.accent}10`, color: theme.textSecondary }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = `${theme.accent}20`
                  e.currentTarget.style.borderColor = theme.accent
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = `${theme.accent}10`
                  e.currentTarget.style.borderColor = ''
                }
              }}
            >
              <div className={`font-medium ${theme.text}`}>{pos.en}</div>
              <div className={`text-xs ${theme.textSecondary}`}>{pos.km}</div>
            </button>
          ))}
        </div>
      </div>

     
      <FormActions
        onClear={handleClear}
        onSave={handleSave}
        theme={theme}
        isSaving={isLoading}
        isFormValid={formData.position_en.trim() !== '' && formData.position_km.trim() !== ''}
        currentCategory="position"
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

export default CreatePosition