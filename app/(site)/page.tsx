import AppDownloadCTA from '@/components/AppDownloadCTA'
import Newsletter from '@/components/Newsletter'
import FeaturedPosts from '@/components/FeaturedPosts'
import Testimonials from '@/components/Testimonials'
import InteractiveBackground from '@/components/InteractiveBackground'
import InteractiveCard from '@/components/InteractiveCard'
import ScrollReveal from '@/components/ScrollReveal'
import MagneticButton from '@/components/MagneticButton'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60 // Revalidate every 60 seconds
export const dynamic = 'force-dynamic' // Allow dynamic content for featured posts

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Converze helps you visualize how you sound, discover your communication style, and intentionally transform it through daily practice. Understand your voice and shape how you\'re heard.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Converze - Visualize Your Voice',
    description: 'Converze helps you visualize how you sound, discover your communication style, and intentionally transform it through daily practice.',
    url: siteUrl,
  },
}

export default function Home() {
  return (
    <section className="space-y-24 relative w-full overflow-x-hidden">
      {/* Interactive particle background */}
      <InteractiveBackground />
      
      {/* Immersive background with depth */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none w-screen max-w-full">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] max-w-[90vw] bg-blue-100 dark:bg-blue-950/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] max-w-[90vw] bg-gray-200 dark:bg-gray-800/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] max-w-[80vw] bg-blue-50 dark:bg-blue-950/10 rounded-full blur-3xl opacity-10"></div>
      </div>
      <ScrollReveal direction="up" delay={0}>
        <div className="text-center space-y-6 relative z-10">
          <h1 className="text-5xl font-medium">
            Understand Your Voice.<br />Shape How You're Heard.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Transform your communication through voice visualization and daily practice.
          </p>
          <div className="flex justify-center">
            <MagneticButton>
              <AppDownloadCTA />
            </MagneticButton>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-4 gap-6 relative z-10 w-full max-w-full">
        <ScrollReveal direction="up" delay={100}>
          <InteractiveCard className="group border border-gray-300 dark:border-gray-700 p-6 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm h-full flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-4 flex items-center justify-center group-hover:bg-blue-500 dark:group-hover:bg-blue-500 transition-colors flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Record</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">Capture your natural speech patterns and vocal characteristics</p>
          </InteractiveCard>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={200}>
          <InteractiveCard className="group border border-gray-300 dark:border-gray-700 p-6 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm h-full flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-4 flex items-center justify-center group-hover:bg-blue-500 dark:group-hover:bg-blue-500 transition-colors flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Visualize</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">See your voice transformed into visual shapes and patterns</p>
          </InteractiveCard>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={300}>
          <InteractiveCard className="group border border-gray-300 dark:border-gray-700 p-6 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm h-full flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-4 flex items-center justify-center group-hover:bg-blue-500 dark:group-hover:bg-blue-500 transition-colors flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Discover</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">Find your unique voice cluster and communication style</p>
          </InteractiveCard>
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={400}>
          <InteractiveCard className="group border border-gray-300 dark:border-gray-700 p-6 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg bg-white/50 dark:bg-black/50 backdrop-blur-sm h-full flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-4 flex items-center justify-center group-hover:bg-blue-500 dark:group-hover:bg-blue-500 transition-colors flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-medium mb-2">Transform</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">Practice daily to intentionally shape your communication</p>
          </InteractiveCard>
        </ScrollReveal>
      </div>

      {/* Featured Blog Posts */}
      <ScrollReveal direction="up" delay={200}>
        <div className="relative z-10">
          <FeaturedPosts />
        </div>
      </ScrollReveal>

      {/* Testimonials */}
      <ScrollReveal direction="up" delay={300}>
        <div className="relative z-10">
          <Testimonials />
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={400}>
        <div className="max-w-2xl mx-auto relative z-10">
          <Newsletter source="home" />
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={500}>
        <div className="text-center relative z-10">
          <MagneticButton>
            <Link 
              href="/blog"
              className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors px-6 py-3 rounded-lg border border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              prefetch={true}
            >
              Read our blog →
            </Link>
          </MagneticButton>
        </div>
      </ScrollReveal>
    </section>
  )
}
