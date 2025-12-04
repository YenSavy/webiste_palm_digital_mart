import React from 'react'

interface SelectOption {
  key: string
  value: string
}

interface SelectInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  loading?: boolean
  theme: {
    text: string
    border: string
    accent: string
    accentGlow: string
  }
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = '-- ជ្រើសរើស --',
  required = false,
  disabled = false,
  loading = false,
  theme,
}) => {
  return (
    <div>
      <label className={`block text-sm font-medium ${theme.text} mb-2`}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
        className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.text} focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
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
      >
        <option value="">{loading ? 'កំពុងទាញ...' : placeholder}</option>
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  )
}