// Studio layout - SSR is handled by the page component
export const dynamic = 'force-dynamic'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div 
      data-sanity="studio-layout"
      style={{ 
        overflow: 'visible', 
        maxWidth: 'none', 
        width: '100vw', 
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999
      }}
    >
      {children}
    </div>
  )
}
