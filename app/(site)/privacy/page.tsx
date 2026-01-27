import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Converze',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link 
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to home
        </Link>
      </div>
      
      <h1 className="text-3xl font-medium">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Last updated: January 27, 2026
        </p>
        
        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Introduction</h2>
          <p>
            Converze (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
            our website and services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Information We Collect</h2>
          <p>We may collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email address (for newsletter subscriptions)</li>
            <li>Voice recordings and audio data (when using our app)</li>
            <li>Usage data and analytics</li>
            <li>Device information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and improve our services</li>
            <li>Send you newsletters and updates (with your consent)</li>
            <li>Analyze usage patterns and improve user experience</li>
            <li>Process voice data for visualization and analysis</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Data Storage and Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information. 
            However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Request data portability</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain 
            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Third-Party Services</h2>
          <p>
            We may use third-party services (such as analytics providers) that collect, monitor, and analyze 
            information. These services have their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our website.
          </p>
        </section>
      </div>
    </div>
  )
}
