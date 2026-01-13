import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export interface LocationOption {
  key: string
  value: string
}

interface UseLocationDataProps {
  token: string | null
  country?: string
  province?: string
  district?: string
  commune?: string
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL + '/address'

export const useLocationData = ({
  token,
  country,
  province,
  district,
  commune,
}: UseLocationDataProps) => {
  const [provinces, setProvinces] = useState<LocationOption[]>([])
  const [districts, setDistricts] = useState<LocationOption[]>([])
  const [communes, setCommunes] = useState<LocationOption[]>([])
  const [villages, setVillages] = useState<LocationOption[]>([])

  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingCommunes, setLoadingCommunes] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)

  const getAxiosConfig = useCallback(() => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  }, [token])

  const convertToLocationOptions = (data: Record<string, string>): LocationOption[] => {
    return Object.entries(data).map(([name, code]) => ({
      key: code,
      value: name,
    }))
  }

  // Load provinces when country changes
  useEffect(() => {
    const loadProvinces = async (countryKey: string) => {
      setLoadingProvinces(true)
      try {
        const response = await axios.get(
          `${API_BASE_URL}/country/${countryKey}`,
          getAxiosConfig()
        )
        const provinceOptions = convertToLocationOptions(response.data)
        setProvinces(provinceOptions)
      } catch (error) {
        console.error('Error loading provinces:', error)
      } finally {
        setLoadingProvinces(false)
      }
    }

    if (country && token) {
      loadProvinces(country)
    } else {
      setProvinces([])
    }
  }, [country, token, getAxiosConfig])

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async (provinceKey: string) => {
      setLoadingDistricts(true)
      try {
        const response = await axios.get(
          `${API_BASE_URL}/province/${provinceKey}`,
          getAxiosConfig()
        )
        const districtOptions = convertToLocationOptions(response.data)
        setDistricts(districtOptions)
      } catch (error) {
        console.error('Error loading districts:', error)
      } finally {
        setLoadingDistricts(false)
      }
    }

    if (province && token) {
      loadDistricts(province)
    } else {
      setDistricts([])
    }
  }, [province, token, getAxiosConfig])

  // Load communes when district changes
  useEffect(() => {
    const loadCommunes = async (districtKey: string) => {
      setLoadingCommunes(true)
      try {
        const response = await axios.get(
          `${API_BASE_URL}/district/${districtKey}`,
          getAxiosConfig()
        )
        const communeOptions = convertToLocationOptions(response.data)
        setCommunes(communeOptions)
      } catch (error) {
        console.error('Error loading communes:', error)
      } finally {
        setLoadingCommunes(false)
      }
    }

    if (district && token) {
      loadCommunes(district)
    } else {
      setCommunes([])
    }
  }, [district, token, getAxiosConfig])

  // Load villages when commune changes
  useEffect(() => {
    const loadVillages = async (communeKey: string) => {
      setLoadingVillages(true)
      try {
        const response = await axios.get(
          `${API_BASE_URL}/commune/${communeKey}`,
          getAxiosConfig()
        )
        const villageOptions = convertToLocationOptions(response.data)
        setVillages(villageOptions)
      } catch (error) {
        console.error('Error loading villages:', error)
      } finally {
        setLoadingVillages(false)
      }
    }

    if (commune && token) {
      loadVillages(commune)
    } else {
      setVillages([])
    }
  }, [commune, token, getAxiosConfig])

  return {
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
  }
}