import React, { useState } from 'react'
import {
  GitBranch,
  Building2,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Navigation, 
} from 'lucide-react'
import { useThemeStore } from '../../../../store/themeStore'
import type { TCreateBranchInput } from '../../../../lib/apis/dashboard/companyApi'
import { useCreateBranchMutation } from '../../../../lib/mutations'
import useDashboardStore from '../../../../store/dashboardStore'
import { FormActions } from './FormActions'

interface CreateBranchProps {
  onComplete?: () => void;
  companyId?: string;
}

const CreateBranch: React.FC<CreateBranchProps> = ({ onComplete, companyId = 'C001' }) => {
  const theme = useThemeStore((state) => state.getTheme());
  const addSavedCategory = useDashboardStore((state) => state.addSavedCategory);
  const { mutate: saveBranch, isPending: isLoading } = useCreateBranchMutation();
  const [formData, setFormData] = useState<TCreateBranchInput>({
    branch_name_km: '',
    branch_name_en: '',
    company: companyId,
    branch_email: '',
    branch_phone: '',
    branch_address_en: '',
    lat: '',
    lng: '',
    telegram: '',
  });

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
      branch_name_km: '',
      branch_name_en: '',
      company: companyId,
      branch_email: '',
      branch_phone: '',
      branch_address_en: '',
      lat: '',
      lng: '',
      telegram: '',
    });
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.branch_name_en.trim()) {
      return 'Branch name (English) is required';
    }
    if (!formData.branch_name_km.trim()) {
      return 'Branch name (Khmer) is required';
    }
    if (formData.branch_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.branch_email)) {
      return 'Invalid email format';
    }
    return null;
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get current location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const handleSave = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    
    saveBranch(formData, {
      onSuccess: (_data) => {
        setError(null);
        // បន្ថែម branch ទៅក្នុង savedCategories
        addSavedCategory('branch');
        if (onComplete) onComplete();
      },
      onError: (err) => {
        setError(err.message);
      }
    });
    
  };

  return (
    <div className="space-y-6
    ">
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

      {/* Branch Information Section */}
      <div>
        <h3 className={`text-xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
          <GitBranch size={20} style={{ color: theme.accent }} />
          Branch Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Branch Name Khmer */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Branch Name (Khmer) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <GitBranch
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="branch_name_km"
                value={formData.branch_name_km}
                onChange={handleInputChange}
                placeholder="ឈ្មោះសាខា"
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

          {/* Branch Name English */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Branch Name (English) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Building2
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="branch_name_en"
                value={formData.branch_name_en}
                onChange={handleInputChange}
                placeholder="New Branch"
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

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>Branch Email</label>
            <div className="relative">
              <Mail
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="email"
                name="branch_email"
                value={formData.branch_email}
                onChange={handleInputChange}
                placeholder="branch@example.com"
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

          {/* Phone */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>Branch Phone</label>
            <div className="relative">
              <Phone
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="branch_phone"
                value={formData.branch_phone}
                onChange={handleInputChange}
                placeholder="0123456789"
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

          {/* Telegram */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>Telegram</label>
            <div className="relative">
              <MessageCircle
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={handleInputChange}
                placeholder="@branchtelegram"
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

          {/* Address - Full Width */}
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Branch Address (English)
            </label>
            <div className="relative">
              <MapPin size={18} className={`absolute left-3 top-3 ${theme.textSecondary}`} />
              <textarea
                name="branch_address_en"
                value={formData.branch_address_en}
                onChange={handleInputChange}
                placeholder="Street 123"
                rows={3}
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

      {/* Location Coordinates Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${theme.text} flex items-center gap-2`}>
            <MapPin size={20} style={{ color: theme.accent }} />
            Location Coordinates
          </h3>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${theme.border} flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ backgroundColor: `${theme.accent}10`, color: theme.accent }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = `${theme.accent}20`
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = `${theme.accent}10`
              }
            }}
          >
            <Navigation size={16} />
            Get Location
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Latitude */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>Latitude</label>
            <input
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleInputChange}
              placeholder="11.562108"
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
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

          {/* Longitude */}
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>Longitude</label>
            <input
              type="text"
              name="lng"
              value={formData.lng}
              onChange={handleInputChange}
              placeholder="104.888535"
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.text} placeholder-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
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

        {/* Map Preview */}
        {formData.lat && formData.lng && (
          <div className="mt-4">
            <div
              className="w-full h-48 rounded-xl overflow-hidden border-2"
              style={{ borderColor: theme.accent }}
            >
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.google.com/maps?q=${formData.lat},${formData.lng}&output=embed`}
                title="Branch Location"
              />
            </div>
          </div>
        )}
      </div>

      {/* ប្រើ FormActions component ថ្មី */}
      <FormActions
        onClear={handleClear}
        onSave={handleSave}
        theme={theme}
        isSaving={isLoading}
        isFormValid={formData.branch_name_en.trim() !== '' && formData.branch_name_km.trim() !== ''}
        currentCategory="branch"
      />
    </div>
  )
}

export default CreateBranch