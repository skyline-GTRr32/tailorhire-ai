'use client'

import { motion } from 'framer-motion'
import { TrophyIcon, UsersIcon, ClockIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'

export default function AnalyticsSection() {
  const stats = [
    {
      icon: UsersIcon,
      number: '25,847',
      label: 'Resumes Optimized',
      description: 'Job seekers who have improved their resumes with our AI technology',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: TrophyIcon,
      number: '89.3%',
      label: 'ATS Pass Rate',
      description: 'Success rate of our optimized resumes passing ATS screening',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: CheckBadgeIcon,
      number: '3.2x',
      label: 'More Interview Calls',
      description: 'Average increase in interview callbacks after resume optimization',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: ClockIcon,
      number: '47%',
      label: 'Faster Job Placement',
      description: 'Reduction in time to land a job compared to unoptimized resumes',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ]

  return (
    <section id="analytics" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real Results, Backed by Data
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our AI has transformed job searches and careers across the globe.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="card p-8 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className={`inline-flex p-4 rounded-2xl ${stat.bg} mb-6`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              >
                {stat.number}
              </motion.div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {stat.label}
              </h3>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Process Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload Resume',
                description: 'Upload your current resume or paste the text content',
                icon: '📄'
              },
              {
                step: '2',
                title: 'Add Job Description',
                description: 'Paste the job description you want to apply for',
                icon: '📋'
              },
              {
                step: '3',
                title: 'Get Optimized Resume',
                description: 'Download your ATS-optimized resume in seconds',
                icon: '✨'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h4>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}