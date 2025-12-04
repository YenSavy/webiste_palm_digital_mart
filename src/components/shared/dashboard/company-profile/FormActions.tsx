import React from 'react'
import { Save, Trash2 } from 'lucide-react'

interface FormActionsProps {
  onClear: () => void
  onSave: () => void
  isSaving : boolean;
  theme: {
    border: string
    textSecondary: string
    accent: string
    accentGlow: string
  }
}

export const FormActions: React.FC<FormActionsProps> = ({ onClear, onSave, theme,isSaving }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
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
      <button
        type="button"
        onClick={onSave}
        className="px-8 py-3 rounded-xl font-medium text-white transition-all shadow-lg flex items-center justify-center gap-2"
        style={{
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.boxShadow = `0 10px 40px ${theme.accentGlow}`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <Save size={20} />
        {isSaving ? "Saving Company": "Save Company"}
      </button>
    </div>
  )
}