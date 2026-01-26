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
  alternates: {
    types: {
      'application/rss+xml': [
        { url: `${siteUrl}/feed.xml`, title: 'Converze Blog RSS Feed' },
      ],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Converze Blog RSS Feed" href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/feed.xml`} />
      </head>
      <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors overflow-x-hidden w-full">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = 'light';
                    localStorage.setItem('theme', 'light');
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <div className="w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}

