// Studio layout - Completely isolated from main site
export const dynamic = 'force-dynamic'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* CRITICAL: Completely isolate Studio from global CSS */
        /* Reset body/html when Studio is active */
        body:has([data-sanity="studio-layout"]) {
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
          position: fixed !important;
          width: 100vw !important;
          height: 100vh !important;
          background: transparent !important;
        }
        
        html:has([data-sanity="studio-layout"]) {
          overflow: hidden !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Studio container - full viewport */
        [data-sanity="studio-layout"] {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: visible !important;
          z-index: 99999 !important;
          background: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Override ALL global CSS rules for Studio - extremely aggressive */
        [data-sanity="studio-layout"] *,
        [data-sanity="studio-layout"] *::before,
        [data-sanity="studio-layout"] *::after {
          overflow: visible !important;
          max-width: none !important;
          max-height: none !important;
          width: auto !important;
          height: auto !important;
          font-weight: normal !important;
          letter-spacing: normal !important;
        }
        
        /* Remove any wrapper divs that might constrain Studio */
        body > div:has([data-sanity="studio-layout"]) {
          width: 100vw !important;
          height: 100vh !important;
          overflow: visible !important;
          margin: 0 !important;
          padding: 0 !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
        }
      `}} />
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
          zIndex: 99999,
          margin: 0,
          padding: 0
        }}
      >
        {children}
      </div>
    </>
  )
}
