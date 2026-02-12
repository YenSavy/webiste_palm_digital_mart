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
import useDashboardStore from '../../../../store/dashboardStore'

const INITIAL_FORM_DATA = {
  companyNameLocal: '',
  companyNameEnglish: '',
  phone: '',
  addressEnglish: '',
  file: null as File | null,
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
  const addSavedCategory = useDashboardStore((state) => state.addSavedCategory)
  const [formData, setFormData] = useState<TCreateCompanyInput>(INITIAL_FORM_DATA)
  const [countries] = useState(COUNTRIES)
  const { mutate: saveCompany, isPending: isCreating } = useCreateCompanyMutation()
  const [isError, setIsError] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
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

  const isFormValid = () => {
    return (
      formData.companyNameEnglish.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.addressEnglish.trim() !== '' &&
      formData.email.trim() !== ''
    )
  }

  const handleSave = async () => {
    if (!isFormValid()) {
      setMessage('សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់')
      setIsError(true)
      return
    }

    // បង្កើត request data object ដោយយកតែ fields ដែលត្រូវការប៉ុណ្ណោះ
    const requestData = {
      company_name_en: formData.companyNameEnglish,
      company_name_km: formData.companyNameLocal,
      phone: formData.phone,
      email: formData.email,
      address_en: formData.addressEnglish,
      country: formData.country,
      province: formData.province,
      district: formData.district,
      commune: formData.commune,
      village: formData.village,
      // បើមាន fields ផ្សេងទៀតដែល API ត្រូវការ
    }

    saveCompany(
      requestData,
      {
        onSuccess: (data) => {
          setIsError(false)
          setMessage(`បានបង្កើតក្រុមហ៊ុន "${data.data.company_name_en}" ដោយជោគជ័យ`)
          addSavedCategory('company')
        },
        onError: (data: any) => {
          setIsError(true)
          setMessage(data.message || 'មានបញ្ហាក្នុងការបង្កើតក្រុមហ៊ុន')
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
            <span className={`${isError ? "text-red-500" : "text-lime-600"}`}>{message}</span>
            <FormActions 
              onClear={handleClear} 
              onSave={handleSave} 
              theme={theme} 
              isSaving={isCreating}
              isFormValid={isFormValid()}
              currentCategory="company"
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCompany