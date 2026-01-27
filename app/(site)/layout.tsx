import "../../styles/globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BackToTop from "@/components/BackToTop"
import NewsletterModal from "@/components/NewsletterModal"
import ReadingProgress from "@/components/ReadingProgress"
import { generateOrganizationStructuredData, generateWebSiteStructuredData } from "./structured-data"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const organizationData = generateOrganizationStructuredData(siteUrl)
  const websiteData = generateWebSiteStructuredData(siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <div className="w-full overflow-x-hidden overflow-y-visible">
        <ReadingProgress />
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto px-6 py-12 relative z-10 w-full overflow-x-hidden overflow-y-visible">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <NewsletterModal />
      </div>
    </>
  )
}
