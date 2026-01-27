import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Converze',
}

export default function TermsPage() {
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
      
      <h1 className="text-3xl font-medium">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Last updated: January 27, 2026
        </p>
        
        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Agreement to Terms</h2>
          <p>
            By accessing or using Converze (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), you agree to be bound by these 
            Terms of Service. If you disagree with any part of these terms, you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Use License</h2>
          <p>
            Permission is granted to temporarily use Converze for personal, non-commercial use. This is the grant 
            of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to reverse engineer any software</li>
            <li>Remove any copyright or proprietary notations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate and complete information. You are responsible 
            for safeguarding your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the service for any unlawful purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Transmit any viruses or malicious code</li>
            <li>Interfere with or disrupt the service</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Content</h2>
          <p>
            You retain ownership of any content you submit through our service. By submitting content, you grant us 
            a license to use, modify, and display that content as necessary to provide our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Disclaimer</h2>
          <p>
            The materials on Converze are provided on an &apos;as is&apos; basis. We make no warranties, expressed or implied, 
            and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of 
            merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Limitations</h2>
          <p>
            In no event shall Converze or its suppliers be liable for any damages (including, without limitation, damages 
            for loss of data or profit, or due to business interruption) arising out of the use or inability to use the 
            materials on Converze, even if Converze or a Converze authorized representative has been notified orally or in 
            writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Termination</h2>
          <p>
            We may terminate or suspend your account and access to the service immediately, without prior notice or liability, 
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any changes by updating the 
            &quot;Last updated&quot; date of these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mt-6 mb-3">Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us through our website.
          </p>
        </section>
      </div>
    </div>
  )
}
