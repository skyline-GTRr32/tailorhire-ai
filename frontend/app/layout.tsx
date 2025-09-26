// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] });

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export const viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tailoredhireresume.com'),
  
  title: 'TailorHire AI | Free AI Resume Optimizer for Job Seekers',
  description: 'Instantly tailor your resume for any job description with TailorHire AI. Beat ATS systems, highlight your key skills, and land more interviews. Free to use.',
  keywords: 'ai resume builder, resume tailor, ats resume checker, cv optimizer, tailor resume to job description, free resume tool',
  authors: [{ name: 'The TailorHire AI Team' }],
  openGraph: {
    title: 'TailorHire AI: Free AI Resume Tailoring Tool',
    description: 'Stop getting rejected by ATS. TailorHire AI rewrites your resume to perfectly match the job you want, for free.',
    type: 'website',
    url: 'https://www.tailoredhireresume.com',
    siteName: 'TailorHire AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TailorHire AI: Free AI Resume Tailoring Tool',
    description: 'Stop getting rejected by ATS. TailorHire AI rewrites your resume to perfectly match the job you want, for free.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
       <head>
        {/* Google Analytics Script */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}

        {/* Safe AEO Schema Markup Script */}
        <Script id="web-app-schema" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TailorHire AI",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "A free AI-powered resume optimizer that tailors your resume to any job description to help you beat ATS systems and land more interviews.",
              "url": "https://www.tailoredhireresume.com"
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#363636', color: '#fff' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Analytics /> {/* Vercel Analytics Component */}
      </body>
    </html>
  );
}