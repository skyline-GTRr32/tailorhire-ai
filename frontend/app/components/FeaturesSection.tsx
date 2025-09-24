'use client'

import { motion } from 'framer-motion'
import { 
  SparklesIcon, 
  BoltIcon as LightningBoltIcon, 
  ShieldCheckIcon, 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

export default function FeaturesSection() {
  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Optimization',
      description: 'Advanced machine learning algorithms analyze job descriptions and optimize your resume for maximum relevance and keyword matching.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: LightningBoltIcon,
      title: 'Lightning Fast Results',
      description: 'Get your optimized resume in under 60 seconds. No manual editing or guesswork required.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: ShieldCheckIcon,
      title: 'ATS-Friendly Format',
      description: 'Ensures your resume passes through Applicant Tracking Systems with optimal formatting and structure.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: ChartBarIcon,
      title: 'Match Score Analytics',
      description: 'Get detailed scoring on how well your optimized resume matches the job requirements with actionable insights.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: ClockIcon,
      title: 'Real-time Processing',
      description: 'Watch your resume get optimized in real-time with progress indicators and detailed logs.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: CheckCircleIcon,
      title: 'Quality Guaranteed',
      description: 'Our AI maintains your original experience while enhancing presentation and keyword optimization.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why ResumeAI Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with industry expertise 
            to deliver results that get you noticed by recruiters and ATS systems.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="card p-8 h-full hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                {/* Icon */}
                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Resume?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of job seekers who have successfully optimized their resumes 
              and landed their dream jobs with ResumeAI.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById('optimizer')
                if (element) element.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Your Optimization Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}