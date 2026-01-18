import "../../styles/globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12">
        {children}
      </main>
      <Footer />
    </>
  )
}
