import React from 'react'
import { type LucideIcon } from 'lucide-react'

interface TextInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  required?: boolean
  icon?: LucideIcon
  theme: {
    text: string
    textSecondary: string
    border: string
    accent: string
    accentGlow: string
  }
}

export const TextCompanyField: React.FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  icon: Icon,
  theme,
}) => {
  return (
    <div>
      <label className={`block text-sm font-medium ${theme.text} mb-2`}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
          />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all`}
          style={{ backgroundColor: `${theme.accent}05` }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme.accent
            e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentGlow}`
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = ''
            e.currentTarget.style.boxShadow = ''
          }}
          required={required}
        />
      </div>
    </div>
  )
}