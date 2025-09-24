import Link from 'next/link'
import Image from 'next/image' // Import the Image component for the logo

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { name: 'Optimizer', href: '/#optimizer' },
      { name: 'Features', href: '/#features' },
    ],
    Company: [
      { name: 'Blog', href: '/blog' },
      { name: 'Contact Us', href: '/contact-us' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" legacyBehavior>
              <a className="flex items-center space-x-3 mb-4">
                {/* Your logo.png file must be in the /frontend/public/ folder */}
                <Image 
                  src="/logo.png" 
                  alt="TailorHire AI Logo"
                  width={36}
                  height={36}
                  className="rounded-md" // Optional: adds slightly rounded corners if your logo is square
                />
                <span className="text-xl font-bold">TailorHire AI</span>
              </a>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              AI-powered resume tailoring to help you beat ATS systems and land more interviews.
            </p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} legacyBehavior>
                      <a className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                        {link.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} TailorHire AI. All rights reserved. Made with ❤️ for job seekers worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
}