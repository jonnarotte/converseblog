// Studio layout - SSR is handled by the page component
export const dynamic = 'force-dynamic'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ overflow: 'visible', maxWidth: 'none', width: '100%', height: '100vh' }}>
      {children}
    </div>
  )
}
