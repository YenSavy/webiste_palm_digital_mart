import React, { useState } from 'react'
import { Upload, X, FileText } from 'lucide-react'

interface FileUploadProps {
  file: File | null
  onFileChange: (file: File | null) => void
  theme: {
    text: string
    textSecondary: string
    accent: string
  }
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange, theme }) => {
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null
    onFileChange(selectedFile)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0])
    }
  }

  const handleRemoveFile = () => {
    onFileChange(null)
  }

  return (
    <div
      className={`relative border-2 border-dashed ${dragActive ? '' : 'border-gray-300'} rounded-xl p-8 transition-all`}
      style={
        dragActive
          ? {
              borderColor: theme.accent,
              backgroundColor: `${theme.accent}10`,
            }
          : { backgroundColor: `${theme.accent}05` }
      }
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />

      {!file ? (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${theme.accent}20` }}
          >
            <Upload size={32} style={{ color: theme.accent }} />
          </div>
          <p className={`text-lg font-medium ${theme.text} mb-2`}>
            Drop your file here or click to browse
          </p>
          <p className={`text-sm ${theme.textSecondary}`}>
            Supports: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
          </p>
        </label>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${theme.accent}20` }}
            >
              <FileText size={24} style={{ color: theme.accent }} />
            </div>
            <div>
              <p className={`font-medium ${theme.text}`}>{file.name}</p>
              <p className={`text-sm ${theme.textSecondary}`}>
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  )
}