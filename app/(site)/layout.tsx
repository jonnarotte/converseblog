import "../../styles/globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { generateOrganizationStructuredData } from "./structured-data"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const organizationData = generateOrganizationStructuredData(siteUrl)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <div className="w-full overflow-x-hidden">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto px-6 py-12 relative z-10 w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
