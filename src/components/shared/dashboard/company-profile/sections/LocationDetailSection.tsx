import React from 'react'
import { MapPin } from 'lucide-react'
import type { LocationOption } from '../../../../../hooks/useLocationData'
import { SelectInput } from '../../../../SelectInput'
import { TextCompanyField } from '../../../../TextCompanyField'
import type { TCreateCompanyInput } from '../../../../../types'


interface LocationDetailsSectionProps {
  formData: TCreateCompanyInput
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  countries: LocationOption[]
  provinces: LocationOption[]
  districts: LocationOption[]
  communes: LocationOption[]
  villages: LocationOption[]
  loadingProvinces: boolean
  loadingDistricts: boolean
  loadingCommunes: boolean
  loadingVillages: boolean
  theme: {
    cardBg: string
    border: string
    text: string
    textSecondary: string
    accent: string
    accentGlow: string
  }
}

export const LocationDetailsSection: React.FC<LocationDetailsSectionProps> = ({
  formData,
  onChange,
  countries,
  provinces,
  districts,
  communes,
  villages,
  loadingProvinces,
  loadingDistricts,
  loadingCommunes,
  loadingVillages,
  theme,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6 sm:p-8`}
    >
      <h2 className={`text-xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <MapPin size={20} style={{ color: theme.accent }} />
        Location Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SelectInput
          label="ប្រទេស"
          name="country"
          value={formData.country}
          onChange={onChange}
          options={countries}
          placeholder="-- ជ្រើសរើសប្រទេស --"
          required
          theme={theme}
        />

        <SelectInput
          label="ខេត្ត/ក្រុង"
          name="province"
          value={formData.province}
          onChange={onChange}
          options={provinces}
          placeholder="-- ជ្រើសរើសខេត្ត --"
          required
          disabled={!formData.country}
          loading={loadingProvinces}
          theme={theme}
        />

        <SelectInput
          label="ស្រុក/ខណ្ឌ"
          name="district"
          value={formData.district}
          onChange={onChange}
          options={districts}
          placeholder="-- ជ្រើសរើសស្រុក --"
          required
          disabled={!formData.province}
          loading={loadingDistricts}
          theme={theme}
        />

        <SelectInput
          label="ឃុំ/សង្កាត់"
          name="commune"
          value={formData.commune}
          onChange={onChange}
          options={communes}
          placeholder="-- ជ្រើសរើសឃុំ --"
          required
          disabled={!formData.district}
          loading={loadingCommunes}
          theme={theme}
        />

        <SelectInput
          label="ភូមិ"
          name="village"
          value={formData.village}
          onChange={onChange}
          options={villages}
          placeholder="-- ជ្រើសរើសភូមិ --"
          required
          disabled={!formData.commune}
          loading={loadingVillages}
          theme={theme}
        />

        <TextCompanyField
          label="លេខផ្លូវ"
          name="roadStrNumber"
          value={formData.roadStrNumber}
          onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
          placeholder="ផ្លូវលេខ ១២៣"
          required
          theme={theme}
        />

        <TextCompanyField
          label="លេខផ្ទះ"
          name="homeStrNumber"
          value={formData.homeStrNumber}
          onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
          placeholder="ផ្ទះលេខ ៤៥"
          required
          theme={theme}
        />
      </div>
    </div>
  )
}