'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image' // Import the Image component
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isSolid = isScrolled || !isHomePage

  const navLinks = [
    { name: 'Optimizer', href: '/#optimizer' },
    { name: 'Features', href: '/#features' },
    { name: 'Blog', href: '/blog' },
  ]
  
  const aboutLinks = [
      { name: 'Contact Us', href: '/contact-us' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isSolid 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" legacyBehavior>
            <a className="flex items-center space-x-3 cursor-pointer">
              {/* --- LOGO IS HERE --- */}
              <Image 
                src="/logo.png"
                alt="TailorHire AI Logo"
                width={36}
                height={36}
                priority // Ensures the logo loads quickly
              />
              <span className={`text-xl font-bold ${isSolid ? 'text-gray-900' : 'text-white'}`}>
                TailorHire AI
              </span>
            </a>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <Link key={item.name} href={item.href} legacyBehavior>
                 <a className={`font-medium transition-colors duration-200 hover:text-blue-600 ${isSolid ? 'text-gray-700' : 'text-white/90'}`}>
                  {item.name}
                </a>
              </Link>
            ))}

            <div className="relative group">
                <button className={`font-medium flex items-center transition-colors duration-200 hover:text-blue-600 ${isSolid ? 'text-gray-700' : 'text-white/90'}`}>
                    <span>About</span>
                    <ChevronDownIcon className="w-4 h-4 ml-1"/>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="py-2">
                        {aboutLinks.map(link => (
                            <Link key={link.name} href={link.href} legacyBehavior>
                                <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100">{link.name}</a>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <Link href="/#optimizer" legacyBehavior>
              <a className="btn-primary">Try for Free</a>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${isSolid ? 'text-gray-700' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white rounded-lg shadow-lg mt-2 py-4"
          >
            {[...navLinks, ...aboutLinks].map((item) => (
               <Link key={item.name} href={item.href} legacyBehavior>
                <a onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                  {item.name}
                </a>
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Link href="/#optimizer" legacyBehavior>
                <a onClick={() => setIsMobileMenuOpen(false)} className="w-full btn-primary text-center block">Try for Free</a>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}