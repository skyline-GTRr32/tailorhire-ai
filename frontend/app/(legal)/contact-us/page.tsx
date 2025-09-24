import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { Metadata } from 'next'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Contact Us - TailorHire Resume',
  description: 'Get in touch with the TailorHire Resume team. We welcome your feedback, questions, and partnership inquiries.',
}

export default function ContactUsPage() {
  const contactEmail = 'support@tailorhireresume.com'; // Use your real support email

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you! Whether you have feedback, a question, or a partnership idea, please don't hesitate to reach out.
            </p>
        </div>
        
        <div className="mt-12 max-w-lg mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center justify-center">
                  <EnvelopeIcon className="w-8 h-8 mr-3 text-blue-600"/>
                  Contact via Email
              </h2>
              <p className="text-gray-700 text-center mb-6">
                For the fastest response, please send us an email. We typically reply within one business day.
              </p>
              <a 
                href={`mailto:${contactEmail}`}
                className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200"
              >
                {contactEmail}
              </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}