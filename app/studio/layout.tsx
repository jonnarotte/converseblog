// Studio layout - SSR is handled by the page component
export const dynamic = 'force-dynamic'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
