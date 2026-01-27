import "../styles/globals.css"
import type { Metadata } from "next"
import GoogleAnalytics from "@/components/GoogleAnalytics"

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
  keywords: ['voice analysis', 'communication', 'speech patterns', 'voice visualization', 'self-reflection', 'speech improvement', 'voice training', 'communication skills', 'voice coaching', 'speech analysis'],
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
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
    // google: process.env.GOOGLE_SITE_VERIFICATION,
    // yandex: process.env.YANDEX_VERIFICATION,
    // yahoo: process.env.YAHOO_VERIFICATION,
    // bing: process.env.BING_VERIFICATION,
  },
  alternates: {
    types: {
      'application/rss+xml': [
        { url: `${siteUrl}/feed.xml`, title: 'Converze Blog RSS Feed' },
      ],
    },
  },
  category: 'Technology',
  classification: 'Blog',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Converze Blog RSS Feed" href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/feed.xml`} />
        {/* Enhanced SEO */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors overflow-x-hidden w-full">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check cookie first (session-based), then localStorage (persistent)
                  function getCookie(name) {
                    var value = "; " + document.cookie;
                    var parts = value.split("; " + name + "=");
                    if (parts.length === 2) return parts.pop().split(";").shift();
                    return null;
                  }
                  
                  var theme = getCookie('theme') || localStorage.getItem('theme');
                  if (!theme) {
                    theme = 'light';
                    localStorage.setItem('theme', 'light');
                    // Set cookie for session tracking
                    var expires = new Date();
                    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
                    document.cookie = 'theme=light;expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
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
        <GoogleAnalytics />
        <div className="w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}

