import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - TailorHire Resume',
  description: 'Read the Terms of Service for using TailorHire Resume. Understand your rights and responsibilities when using our AI resume optimization tool.',
}

export default function TermsOfServicePage() {
  return (
    <div className="bg-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose lg:prose-xl mx-auto">
            <h1>Terms of Service</h1>
            <p className="text-gray-500"><em>Last Updated: September 23, 2025</em></p>
            
            <p>Please read these Terms of Service carefully before using the TailorHire Resume website (the "Service"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.</p>
            
            <h2>1. Use of Service</h2>
            <p>TailorHire Resume provides an AI-powered tool to help users optimize their resumes for specific job descriptions. You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service.</p>
            
            <h2>2. No Guarantees</h2>
            <p>While our tool is designed to improve your resume's chances of passing through Applicant Tracking Systems (ATS), we do not guarantee job interviews or employment. The Service is an informational tool, and career success depends on many factors beyond the scope of this tool.</p>

            <h2>3. Intellectual Property</h2>
            <p>You retain all rights to the content you submit. We claim no ownership over your resume or job description text. We are granted a temporary license to use, modify, and process your content solely for the purpose of providing the optimization service to you during your session.</p>

            <h2>4. Limitation of Liability</h2>
            <p>In no event shall TailorHire Resume, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            
            <h2>5. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.</p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}