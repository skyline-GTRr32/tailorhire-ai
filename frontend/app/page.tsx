'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import ErrorBoundary from './components/ErrorBoundary'
import { PageLoader } from './components/LoadingComponents'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import OptimizerSection from './components/OptimizerSection'
import FeaturesSection from './components/FeaturesSection'
import AnalyticsSection from './components/AnalyticsSection'
import Footer from './components/Footer'
import AdUnit from './components/AdUnit'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-white">
        <Navbar />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Suspense fallback={<PageLoader />}>
            <HeroSection />
            <OptimizerSection />
            <FeaturesSection />
            <AnalyticsSection />
            <Footer />
          </Suspense>
        </motion.div>
      </main>
    </ErrorBoundary>
  )
}