// API utilities for backend communication
import axios from 'axios'

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // Use relative path for production to leverage Next.js proxy
  : 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface OptimizeRequest {
  resume_text: string
  job_description: string
  user_id?: string
}

export interface OptimizeResponse {
  optimized_resume_pdf_base64: string;
  original_resume_text: string;
  optimized_resume_json: Record<string, any>;
  match_score: number
  key_changes: string[]
  suggestions: string[]
  processing_time: number
}

export interface UploadResponse {
  text: string
  filename: string
  length: number
}

// API functions
export const optimizeResume = async (data: OptimizeRequest): Promise<OptimizeResponse> => {
  try {
    const response = await api.post('/optimize', data)
    return response.data
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error('Failed to optimize resume. The AI model may be overloaded. Please try again.')
  }
}

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    
    return response.data
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error('Failed to upload file. Please try again.')
  }
}

// Utility functions
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  return allowedTypes.includes(file.type)
}

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}