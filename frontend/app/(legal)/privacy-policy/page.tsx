import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - TailorHire Resume',
  description: 'Learn how TailorHire Resume handles your data. We are committed to protecting your privacy and ensuring the security of your information.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose lg:prose-xl mx-auto">
            <h1>Privacy Policy for TailorHire Resume</h1>
            <p className="text-gray-500"><em>Last Updated: September 23, 2025</em></p>
            
            <p>Welcome to TailorHire Resume. We respect your privacy and are committed to protecting it. This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it.</p>

            <h2>1. Information We Collect</h2>
            <p>We collect the following types of information when you use our service:</p>
            <ul>
              <li><strong>Resume and Job Description Data:</strong> The resume text and job description text you voluntarily provide for the purpose of optimization.</li>
              <li><strong>Usage Data:</strong> We may collect non-personal information about how you interact with our service, such as features used and time spent on the site, for analytics purposes.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>Your data is used solely for the following purposes:</p>
            <ul>
              <li>To provide, operate, and maintain our resume optimization service.</li>
              <li>To process your input (resume and job description) and generate an optimized PDF.</li>
              <li>To improve our AI models and the overall quality of our service. All data used for improvement is anonymized.</li>
            </ul>

            <h2>3. Data Retention and Security</h2>
            <p><strong>We do not store your resume or job description text on our servers after your session is complete.</strong> The information you provide is processed in real-time and discarded immediately after the optimized PDF is generated. We are committed to ensuring your data is secure during processing.</p>

            <h2>4. Third-Party Services</h2>
            <p>We use Google AdSense to display advertisements on our site. Google may use cookies to serve ads based on a user's prior visits to this website or other websites. You can opt out of personalized advertising by visiting Google's Ad Settings.</p>
            
            <h2>5. Your Rights</h2>
            <p>You have the right to not use our service if you do not agree with this policy. Since we do not store your personal resume data, there is no data to access, correct, or delete.</p>

            <h2>6. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

            <h2>7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through our contact page.</p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}