// Disable SSR for entire Studio route
export const dynamic = 'force-dynamic'
export const ssr = false

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
