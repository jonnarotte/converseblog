interface LogoProps {
  className?: string
  size?: number
  variant?: 'full' | 'icon'
}

export default function Logo({ className = "", size = 28, variant = 'icon' }: LogoProps) {
  if (variant === 'full') {
    // Full logo with text (for larger displays)
    return (
      <svg
        width={size * 3}
        height={size}
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ 
          display: 'block', 
          flexShrink: 0, 
          width: `${size * 3}px`, 
          height: `${size}px`,
        }}
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#6366f1', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        {/* Simplified icon - clean voice wave */}
        <g transform="translate(20, 20)">
          <circle cx="0" cy="0" r="16" fill="url(#logoGrad)"/>
          {/* Simple voice wave - 3 clean arcs */}
          <path d="M -8,0 Q -8,-6 0,-6 Q 8,-6 8,0" stroke="white" strokeWidth="2" fill="none" opacity="0.9"/>
          <path d="M -10,0 Q -10,-8 0,-8 Q 10,-8 10,0" stroke="white" strokeWidth="1.5" fill="none" opacity="0.7"/>
          <path d="M -6,0 Q -6,-4 0,-4 Q 6,-4 6,0" stroke="white" strokeWidth="2.5" fill="none" opacity="1"/>
        </g>
        {/* Text */}
        <text x="50" y="28" fontSize="20" fontWeight="600" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif">
          Converze
        </text>
      </svg>
    )
  }

  // Icon only (for navbar, favicon) - simplified and cleaner
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ 
        display: 'block', 
        flexShrink: 0, 
        width: `${size}px`, 
        height: `${size}px`,
        maxWidth: `${size}px`, 
        maxHeight: `${size}px`,
      }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#6366f1', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      {/* Background circle with gradient */}
      <circle cx="32" cy="32" r="28" fill="url(#iconGrad)"/>
      
      {/* Simplified voice wave - clean and minimal */}
      <g transform="translate(32, 32)">
        {/* Three clean arcs representing voice waves */}
        <path d="M -12,0 Q -12,-10 0,-10 Q 12,-10 12,0" stroke="white" strokeWidth="3" fill="none" opacity="1"/>
        <path d="M -16,0 Q -16,-14 0,-14 Q 16,-14 16,0" stroke="white" strokeWidth="2" fill="none" opacity="0.8"/>
        <path d="M -8,0 Q -8,-6 0,-6 Q 8,-6 8,0" stroke="white" strokeWidth="3.5" fill="none" opacity="1"/>
      </g>
    </svg>
  )
}
