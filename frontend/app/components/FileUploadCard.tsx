import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { 
  CloudArrowUpIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { 
  validateFileType, 
  validateFileSize, 
  formatFileSize 
} from '../lib/api'

export interface FileUploadCardProps {
  resumeText: string
  setResumeText: (text: string) => void
  uploadedFile: File | null
  setUploadedFile: (file: File | null) => void
  onFileUpload: (file: File) => Promise<void>
}

export default function FileUploadCard({
  resumeText,
  setResumeText,
  uploadedFile,
  setUploadedFile,
  onFileUpload
}: FileUploadCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!validateFileType(file)) {
      toast.error('Please upload a PDF or DOCX file')
      return
    }

    if (!validateFileSize(file)) {
      toast.error('File size must be less than 10MB')
      return
    }

    // Create preview URL
    setPreviewUrl(URL.createObjectURL(file))
    setUploadedFile(file)
    toast.loading('Extracting text from file...', { id: 'upload' })
    
    try {
      await onFileUpload(file)
    } catch (error) {
      setPreviewUrl(null)
      throw error
    }
  }, [onFileUpload, setUploadedFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false
  })

  const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setUploadedFile(null)
    setPreviewUrl(null)
    setResumeText('')
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <CloudArrowUpIcon className="w-6 h-6 mr-2 text-blue-600" />
          Step 1: Upload Your Resume
        </h3>
        {uploadedFile && (
          <button 
            onClick={clearFile}
            className="text-red-500 hover:text-red-700"
            aria-label="Clear file"
          >
            <XCircleIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : uploadedFile
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploadedFile ? (
          <div>
            <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-green-700 font-medium">✅ {uploadedFile.name}</p>
            <p className="text-green-600 text-sm mt-1">
              {formatFileSize(uploadedFile.size)} - Click to replace
            </p>
          </div>
        ) : (
          <div>
            <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium">
              {isDragActive ? 'Drop your resume here' : 'Drop your resume here or click to browse'}
            </p>
            <p className="text-gray-500 text-sm mt-2">Supports PDF and DOCX files (max 10MB)</p>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {previewUrl && uploadedFile?.type === 'application/pdf' && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
          <iframe 
            src={previewUrl} 
            className="w-full h-64 border rounded-lg"
            title="Resume preview"
          />
        </div>
      )}

      {/* Text Input */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or paste your resume text:
        </label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="textarea-field h-32"
          placeholder="Paste your resume content here..."
        />
        {resumeText && (
          <p className="text-sm text-gray-500 mt-1">
            {resumeText.length} characters
          </p>
        )}
      </div>
    </div>
  )
}
