import React, { useState, useEffect } from 'react'
import { useThemeStore } from '../../../../store/themeStore'
import { useAuthStore } from '../../../../store/authStore'
import type { TCreateCompanyInput } from '../../../../types'
import { useLocationData } from '../../../../hooks/useLocationData'
import { CompanyInformationSection } from './sections/CompanyInformationSection'
import { FileUploadSection } from './sections/FileUploadSection'
import { LocationDetailsSection } from './sections/LocationDetailSection'
import { FormActions } from './FormActions'
import { useCreateCompanyMutation } from '../../../../lib/mutations'

const INITIAL_FORM_DATA = {
  companyNameLocal: '',
  companyNameEnglish: '',
  phone: '',
  addressEnglish: '',
  file: null,
  email: '',
  country: 'KHR',
  district: '',
  province: '',
  commune: '',
  village: '',
  roadStrNumber: '',
  homeStrNumber: '',
}

 const COUNTRIES = [{ key: 'KHR', value: 'ប្រទេសកម្ពុជា' }]


const CreateCompany: React.FC = () => {
  const token = useAuthStore((state) => state.token)
  const theme = useThemeStore((state) => state.getTheme())
  const [formData, setFormData] = useState<TCreateCompanyInput>(INITIAL_FORM_DATA)
  const [countries] = useState(COUNTRIES)
  const {mutate: saveCompany, isPending: isCreating} = useCreateCompanyMutation()
  const [isError, setIsError] = useState<boolean>(false)
  const [message, setMessage] = useState<string| null>(null)
  const {
    provinces,
    districts,
    communes,
    villages,
    loadingProvinces,
    loadingDistricts,
    loadingCommunes,
    loadingVillages,
    setProvinces,
    setDistricts,
    setCommunes,
    setVillages,
  } = useLocationData({
    token,
    country: formData.country,
    province: formData.province,
    district: formData.district,
    commune: formData.commune,
  })

  useEffect(() => {
    setFormData((prev) => ({ ...prev, country: 'KHR' }))
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'country') {
      setFormData({
        ...formData,
        country: value,
        province: '',
        district: '',
        commune: '',
        village: '',
      })
      setProvinces([])
      setDistricts([])
      setCommunes([])
      setVillages([])
    } else if (name === 'province') {
      setFormData({
        ...formData,
        province: value,
        district: '',
        commune: '',
        village: '',
      })
      setDistricts([])
      setCommunes([])
      setVillages([])
    } else if (name === 'district') {
      setFormData({
        ...formData,
        district: value,
        commune: '',
        village: '',
      })
      setCommunes([])
      setVillages([])
    } else if (name === 'commune') {
      setFormData({
        ...formData,
        commune: value,
        village: '',
      })
      setVillages([])
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleFileChange = (file: File | null) => {
    setFormData({
      ...formData,
      file,
    })
  }

  const handleClear = () => {
    setFormData(INITIAL_FORM_DATA)
    setDistricts([])
    setCommunes([])
    setVillages([])
  }

  const handleSave = async () => {
      saveCompany({
        company_name_en: formData.companyNameEnglish,
        village: formData.village
      },
         {
          onSuccess: (data) => {
            setIsError(false)
            setMessage(`Successfully created company "${data.data.company_name_en}"`)
          },
          onError: (data) => {
            setIsError(false)
            setMessage(data.message)
          }
        }
      )
  }
  return (
    <div className="">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            <CompanyInformationSection
              formData={formData}
              onChange={handleInputChange}
              theme={theme}
            />

            <FileUploadSection
              file={formData.file}
              onFileChange={handleFileChange}
              theme={theme}
            />

            <LocationDetailsSection
              formData={formData}
              onChange={handleInputChange}
              countries={countries}
              provinces={provinces}
              districts={districts}
              communes={communes}
              villages={villages}
              loadingProvinces={loadingProvinces}
              loadingDistricts={loadingDistricts}
              loadingCommunes={loadingCommunes}
              loadingVillages={loadingVillages}
              theme={theme}
            />
            <span className={`${isError ? "text-red-500": "text-lime-600"}`}>{message}</span>
            <FormActions onClear={handleClear} onSave={handleSave} theme={theme} isSaving={isCreating}/>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCompany