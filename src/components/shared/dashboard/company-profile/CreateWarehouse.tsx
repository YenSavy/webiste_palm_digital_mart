import React, { useState } from 'react'
import {
  Warehouse,
  Building2,
  MapPin,
  FileText,
  GitBranch,
} from 'lucide-react'
import { useThemeStore } from '../../../../store/themeStore'
import { useCreateWarehouseMutation } from '../../../../lib/mutations'
import type { TCreateWarehouseInput } from '../../../../lib/apis/dashboard/companyApi'
import useDashboardStore from '../../../../store/dashboardStore' 
import { FormActions } from './FormActions' 

interface CreateWarehouseProps {
  onComplete?: () => void;
  companyId?: number;
  branchId?: number;
}

const CreateWarehouse: React.FC<CreateWarehouseProps> = ({ 
  onComplete, 
  companyId = 1,
  branchId = 1 
}) => {
  const theme = useThemeStore((state) => state.getTheme());
  const addSavedCategory = useDashboardStore((state) => state.addSavedCategory);

  const [formData, setFormData] = useState<TCreateWarehouseInput>({
    company: companyId,
    branch: branchId,
    warehouse_km: '',
    warehouse_en: '',
    address: '',
    description: '',
  });

  const [error, setError] = useState<string | null>(null);
  const { mutate: saveWarehouse, isPending: isLoading } = useCreateWarehouseMutation();
  
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
      company: companyId,
      branch: branchId,
      warehouse_km: '',
      warehouse_en: '',
      address: '',
      description: '',
    });
    setError(null);
  };

  // Validation function
  const validateForm = (): { isValid: boolean; errorMessage?: string } => {
    if (!formData.warehouse_en.trim()) {
      return { isValid: false, errorMessage: 'Warehouse name (English) is required' };
    }
    if (!formData.warehouse_km.trim()) {
      return { isValid: false, errorMessage: 'Warehouse name (Khmer) is required' };
    }
    if (!formData.address.trim()) {
      return { isValid: false, errorMessage: 'Address is required' };
    }
    return { isValid: true };
  };

  const handleSave = () => {
    const validation = validateForm();
    if (!validation.isValid) {
      setError(validation.errorMessage || 'Invalid form data');
      return;
    }

    saveWarehouse(formData, {
      onSuccess: () => {
        setError(null);
        addSavedCategory('warehouse');
        if (onComplete) onComplete();
      },
      onError: (err) => {
        setError(err.message || 'មានបញ្ហាក្នុងការបង្កើតឃ្លាំង');
      }
    });
  };

  return (
    <div className="space-y-6">
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

      <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: `${theme.accent}08` }}>
        <div className="flex items-center gap-2">
          <Building2 size={16} style={{ color: theme.accent }} />
          <span className={`text-sm ${theme.textSecondary}`}>
            Company: <span className={`font-medium ${theme.text}`}>#{companyId}</span>
          </span>
        </div>
        <div className="h-4 w-px bg-gray-600" />
        <div className="flex items-center gap-2">
          <GitBranch size={16} style={{ color: theme.accent }} />
          <span className={`text-sm ${theme.textSecondary}`}>
            Branch: <span className={`font-medium ${theme.text}`}>#{branchId}</span>
          </span>
        </div>
      </div>

      <div>
        <h3 className={`text-xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
          <Warehouse size={20} style={{ color: theme.accent }} />
          Warehouse Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Warehouse Name (Khmer) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Warehouse
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="warehouse_km"
                value={formData.warehouse_km}
                onChange={handleInputChange}
                placeholder="ឃ្លាំងថ្មី"
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

          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Warehouse Name (English) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Warehouse
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.textSecondary}`}
              />
              <input
                type="text"
                name="warehouse_en"
                value={formData.warehouse_en}
                onChange={handleInputChange}
                placeholder="New Warehouse"
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

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className={`absolute left-3 top-3 ${theme.textSecondary}`}
              />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Phnom Penh"
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

         
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              Description
            </label>
            <div className="relative">
              <FileText
                size={18}
                className={`absolute left-3 top-3 ${theme.textSecondary}`}
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter warehouse description..."
                rows={4}
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

     
      <FormActions
        onClear={handleClear}
        onSave={handleSave}
        theme={theme}
        isSaving={isLoading}
        isFormValid={formData.warehouse_en.trim() !== '' && formData.warehouse_km.trim() !== '' && formData.address.trim() !== ''}
        currentCategory="warehouse"
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default CreateWarehouse