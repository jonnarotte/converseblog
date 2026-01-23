import "../styles/globals.css"
import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteName = 'Converze'
const siteDescription = 'Visualize your voice. Shape how you\'re heard. A self-reflection app designed to help people understand how they sound and transform their communication through daily practice.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Visualize Your Voice`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: ['voice analysis', 'communication', 'speech patterns', 'voice visualization', 'self-reflection', 'speech improvement', 'voice training'],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - Visualize Your Voice`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Visualize Your Voice`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: '@converze',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors overflow-x-hidden w-full">
        <div className="w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}

