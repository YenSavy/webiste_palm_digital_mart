import React from 'react'
import { FileText } from 'lucide-react'
import { FileUpload } from '../../../../FileUpload'

interface FileUploadSectionProps {
  file: File | null
  onFileChange: (file: File | null) => void
  theme: {
    cardBg: string
    border: string
    text: string
    textSecondary: string
    accent: string
  }
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  onFileChange,
  theme,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6 sm:p-8`}
    >
      <h2 className={`text-xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
        <FileText size={20} style={{ color: theme.accent }} />
        Company Documents
      </h2>

      <FileUpload file={file} onFileChange={onFileChange} theme={theme} />
    </div>
  )
}