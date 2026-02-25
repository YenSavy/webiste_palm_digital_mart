import React from 'react'
import { Save, Trash2 } from 'lucide-react'

interface FormActionsProps {
  onClear: () => void
  onSave: () => void
  isSaving: boolean
  isFormValid: boolean
  currentCategory: 'company' | 'branch' | 'warehouse' | 'position' | 'currency'
  theme: {
    border: string
    textSecondary: string
    accent: string
    accentGlow: string
  }
}

export const FormActions: React.FC<FormActionsProps> = ({
  onClear,
  onSave,
  theme,
  isSaving,
  isFormValid,
  currentCategory
}) => {
  const getSaveButtonText = () => {
    if (isSaving) {
      return `Completing ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}...`
    }
    return `Complete ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
      {/* ប៊ូតុង Clear Form នៅដដែលសម្រាប់គ្រប់ទម្រង់ */}
      <button
        type="button"
        onClick={onClear}
        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border ${theme.border}`}
        style={{ backgroundColor: `${theme.accent}10`, color: theme.textSecondary }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${theme.accent}20`
          e.currentTarget.style.borderColor = theme.accent
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${theme.accent}10`
          e.currentTarget.style.borderColor = ''
        }}
      >
        <Trash2 size={20} />
        Clear Form
      </button>

      {/* ប៊ូតុង Save ប្ដូរឈ្មោះជា Complete */}
      <button
        type="button"
        onClick={isFormValid ? onSave : undefined}
        disabled={!isFormValid || isSaving}
        className={`px-8 py-3 rounded-xl font-medium text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
          !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
        }`}
        style={{
          background: !isFormValid
            ? `linear-gradient(135deg, ${theme.accent}80, ${theme.accent}80)`
            : `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
        }}
        onMouseEnter={(e) => {
          if (isFormValid) {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = `0 10px 40px ${theme.accentGlow}`
          }
        }}
        onMouseLeave={(e) => {
          if (isFormValid) {
            e.currentTarget.style.transform = 'scale(1)'
          }
        }}
      >
        <Save size={20} />
        {getSaveButtonText()}
      </button>
    </div>
  )
}