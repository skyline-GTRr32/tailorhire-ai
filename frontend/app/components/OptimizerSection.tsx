'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  SparklesIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { optimizeResume, uploadFile, formatFileSize } from '../lib/api'
import type { OptimizeResponse } from '../lib/api'
import FileUploadCard from './FileUploadCard'
import ReactDiffViewer from 'react-diff-viewer-continued'

export default function OptimizerSection() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [result, setResult] = useState<OptimizeResponse | null>(null)
  const [showDiff, setShowDiff] = useState(false)

  const handleOptimize = async () => {
    if (!uploadedFile && !resumeText.trim()) {
      toast.error('Please upload your resume or paste the text')
      return
    }
    if (!jobDescription.trim()) {
      toast.error('Please provide the job description')
      return
    }

    setIsOptimizing(true)
    setResult(null); // Clear previous results
    toast.loading('AI is optimizing your resume...', { id: 'optimize', duration: Infinity })

    try {
      const data = await optimizeResume({ resume_text: resumeText, job_description: jobDescription })
      setResult(data)
      toast.success('Your resume has been optimized!', { id: 'optimize' })
      
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } catch (error: any) {
      console.error('Optimization error:', error)
      toast.error(error.message || 'Failed to optimize resume', { id: 'optimize' })
    } finally {
      setIsOptimizing(false)
    }
  }

  const resetOptimizer = () => {
    setResumeText('')
    setJobDescription('')
    setUploadedFile(null)
    setResult(null)
    setShowDiff(false)
    toast.success('Optimizer reset. Ready for a new resume!')
  }

  const downloadResume = () => {
    if (!result) return;
    try {
      const byteCharacters = atob(result.optimized_resume_pdf_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Optimized-Resume-${result.optimized_resume_json.name.replace(' ', '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF download started!');
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download PDF.");
    }
  }

  return (
    <section id="optimizer" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
             AI Resume Optimizer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your resume and job description to get an AI-optimized version 
            that beats ATS systems and gets you more interviews.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
             <div className="card p-6">
                <FileUploadCard
                    resumeText={resumeText}
                    setResumeText={setResumeText}
                    uploadedFile={uploadedFile}
                    setUploadedFile={setUploadedFile}
                    onFileUpload={async (file) => {
                      toast.loading('Extracting text...', { id: 'upload' })
                      try {
                        const response = await uploadFile(file)
                        setResumeText(response.text)
                        toast.success(`Text extracted successfully!`, { id: 'upload' })
                      } catch (error) {
                        console.error('Upload error:', error)
                        toast.error('Failed to extract text. Please paste it manually.', { id: 'upload' })
                        setUploadedFile(null)
                      }
                    }}
                  />
            </div>
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                <DocumentTextIcon className="w-6 h-6 mr-2 text-purple-600" />
                Step 2: Job Description
              </h3>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="textarea-field h-40"
                placeholder="Paste the complete job description here..."
                required
              />
            </div>
            <motion.button
              onClick={handleOptimize}
              disabled={isOptimizing || (!uploadedFile && !resumeText.trim()) || !jobDescription.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize My Resume'}
            </motion.button>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-8 min-h-[600px]"
          >
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <DocumentTextIcon className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800">Your Optimized Resume Will Appear Here</h3>
                <p className="text-gray-500 mt-2">Complete steps 1 & 2 to see the magic happen.</p>
              </div>
            ) : (
              <div id="results" className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 text-center">
                  <div className="text-sm font-medium">ATS Match Score</div>
                  <div className="text-3xl font-bold">{result.match_score}%</div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Improvements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {result.key_changes.map((change, index) => <li key={index}>{change}</li>)}
                  </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Preview Your New PDF:</h4>
                    <iframe 
                        src={`data:application/pdf;base64,${result.optimized_resume_pdf_base64}`}
                        className="w-full h-80 border rounded-lg"
                        title="Optimized Resume Preview"
                    />
                </div>
                <div className="mt-6">
                  <button onClick={() => setShowDiff(!showDiff)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {showDiff ? 'Hide Content Changes' : 'Show Detailed Content Changes'}
                  </button>
                  {showDiff && (
                    <div className="mt-2 border rounded-lg overflow-hidden text-xs">
                      <ReactDiffViewer
                        oldValue={result.original_resume_text}
                        newValue={JSON.stringify(result.optimized_resume_json, null, 2)}
                        splitView={true}
                        leftTitle="Original Text"
                        rightTitle="Optimized JSON Content"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={resetOptimizer} className="flex-1 btn-secondary">
                    Start Over
                  </button>
                  <button onClick={downloadResume} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl">
                    <ArrowDownTrayIcon className="w-5 h-5 inline mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}