'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export interface AdUnitProps {
  position: 'left' | 'right'
  className?: string
}

export default function AdUnit({ position, className = '' }: AdUnitProps) {
  const [adContent, setAdContent] = useState<string>('')

  useEffect(() => {
    // For now, show placeholder content
    // In production, this will be replaced with Google AdSense
    const placeholders = {
      left: [
        {
          title: "💼 Job Boards",
          description: "Find your next opportunity",
          items: ["LinkedIn Jobs", "Indeed", "Glassdoor", "AngelList"]
        },
        {
          title: "📚 Career Resources",
          description: "Boost your career",
          items: ["Resume Templates", "Interview Prep", "Salary Guide", "Career Coaching"]
        }
      ],
      right: [
        {
          title: "🎯 Premium Tools",
          description: "Coming Soon!",
          items: ["LinkedIn Optimizer", "Cover Letters", "Interview Prep", "Salary Negotiation"]
        },
        {
          title: "📈 Success Stories",
          description: "Join 25K+ users",
          items: ["89% ATS Pass Rate", "3.2x More Interviews", "$15K Avg Salary Boost", "24/7 Support"]
        }
      ]
    }

    // Rotate content every 10 seconds
    let currentIndex = 0
    const interval = setInterval(() => {
      setAdContent(JSON.stringify(placeholders[position][currentIndex]))
      currentIndex = (currentIndex + 1) % placeholders[position].length
    }, 10000)

    // Set initial content
    setAdContent(JSON.stringify(placeholders[position][0]))

    return () => clearInterval(interval)
  }, [position])

  if (!adContent) return null

  const content = JSON.parse(adContent)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed ${position === 'left' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 z-10 ${className}`}
      style={{ 
        width: '280px',
        maxHeight: '400px'
      }}
    >
      {/* Ad Container */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-200 p-6 space-y-4">
        {/* Ad Header */}
        <div className="text-center border-b border-gray-200 pb-3">
          <p className="text-xs text-gray-500 mb-1">📢 Advertisement</p>
          <h3 className="text-lg font-bold text-gray-800">{content.title}</h3>
          <p className="text-sm text-gray-600">{content.description}</p>
        </div>

        {/* Ad Content */}
        <div className="space-y-3">
          {content.items.map((item: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: position === 'left' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm text-gray-700 font-medium">{item}</span>
            </motion.div>
          ))}
        </div>

        {/* Ad CTA */}
        <div className="pt-3 border-t border-gray-200">
          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-xl text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
            Learn More →
          </button>
        </div>

        {/* Close Button */}
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          onClick={() => document.querySelector(`[data-ad="${position}"]`)?.setAttribute('style', 'display: none')}
          data-ad={position}
        >
          ×
        </button>
      </div>
    </motion.div>
  )
}

// Google AdSense component for production
export function GoogleAdSenseUnit({ 
  adClient, 
  adSlot, 
  adFormat = 'auto',
  fullWidthResponsive = true 
}: {
  adClient: string
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
}) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive}
    ></ins>
  )
}