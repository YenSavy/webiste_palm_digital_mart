import React from 'react'
import { Building2, Globe, Phone, Mail, MapPin } from 'lucide-react'
import { TextCompanyField } from '../../../../TextCompanyField'
import type { TCreateCompanyInput } from '../../../../../types'

interface CompanyInformationSectionProps {
  formData: TCreateCompanyInput
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  theme: {
    cardBg: string
    border: string
    text: string
    textSecondary: string
    accent: string
    accentGlow: string
  }
}

export const CompanyInformationSection: React.FC<CompanyInformationSectionProps> = ({
  formData,
  onChange,
  theme,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-1 sm:p-8`}
    >
      <h2 className={`text-xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <Building2 size={20} style={{ color: theme.accent }} />
        Company Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextCompanyField
          label="Company Name (Local)"
          name="companyNameLocal"
          value={formData.companyNameLocal}
          onChange={onChange}
          placeholder="ឈ្មោះក្រុមហ៊ុន"
          required
          icon={Building2}
          theme={theme}
        />

        <TextCompanyField
          label="Company Name (English)"
          name="companyNameEnglish"
          value={formData.companyNameEnglish}
          onChange={onChange}
          placeholder="Company Name"
          required
          icon={Globe}
          theme={theme}
        />

        <TextCompanyField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="+855 12 345 678"
          icon={Phone}
          theme={theme}
        />

        <TextCompanyField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="company@example.com"
          icon={Mail}
          theme={theme}
        />

        <div className="md:col-span-2">
          <TextCompanyField
            label="Address (English)"
            name="addressEnglish"
            value={formData.addressEnglish}
            onChange={onChange}
            placeholder="Full address in English"
            required
            icon={MapPin}
            theme={theme}
          />
        </div>
      </div>
    </div>
  )
}