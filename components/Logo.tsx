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
        {/* Icon */}
        <g transform="translate(20, 20)">
          <circle cx="0" cy="0" r="18" fill="url(#logoGrad)"/>
          <circle cx="0" cy="0" r="2" fill="white" opacity="0.9"/>
          <path d="M 0,-10 Q -5,-10 -5,-5 Q -5,0 0,0 Q 5,0 5,-5 Q 5,-10 0,-10 Z" fill="white" opacity="0.8"/>
          <path d="M 0,-14 Q -7,-14 -7,-7 Q -7,0 0,0 Q 7,0 7,-7 Q 7,-14 0,-14 Z" fill="white" opacity="0.6"/>
          <path d="M -7,0 Q -11,0 -11,4 Q -11,8 -7,8 Q -3,8 -3,4 Q -3,0 -7,0 Z" fill="white" opacity="0.7"/>
          <path d="M 7,0 Q 11,0 11,4 Q 11,8 7,8 Q 3,8 3,4 Q 3,0 7,0 Z" fill="white" opacity="0.7"/>
        </g>
        {/* Text */}
        <text x="50" y="28" fontSize="20" fontWeight="600" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif">
          Converze
        </text>
      </svg>
    )
  }

  // Icon only (for navbar, favicon)
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
      <circle cx="32" cy="32" r="30" fill="url(#iconGrad)"/>
      
      {/* Voice wave visualization - iconic design */}
      <g transform="translate(32, 32)">
        {/* Center dot */}
        <circle cx="0" cy="0" r="2" fill="white" opacity="0.9"/>
        
        {/* Sound waves radiating outward - creates iconic voice visualization */}
        <path d="M 0,-8 Q -4,-8 -4,-4 Q -4,0 0,0 Q 4,0 4,-4 Q 4,-8 0,-8 Z" fill="white" opacity="0.8"/>
        <path d="M 0,-12 Q -6,-12 -6,-6 Q -6,0 0,0 Q 6,0 6,-6 Q 6,-12 0,-12 Z" fill="white" opacity="0.6"/>
        <path d="M 0,-16 Q -8,-16 -8,-8 Q -8,0 0,0 Q 8,0 8,-8 Q 8,-16 0,-16 Z" fill="white" opacity="0.4"/>
        
        {/* Side waves for depth and recognition */}
        <path d="M -6,0 Q -10,0 -10,4 Q -10,8 -6,8 Q -2,8 -2,4 Q -2,0 -6,0 Z" fill="white" opacity="0.7"/>
        <path d="M 6,0 Q 10,0 10,4 Q 10,8 6,8 Q 2,8 2,4 Q 2,0 6,0 Z" fill="white" opacity="0.7"/>
        
        {/* Bottom accent */}
        <path d="M 0,4 Q -3,4 -3,7 Q -3,10 0,10 Q 3,10 3,7 Q 3,4 0,4 Z" fill="white" opacity="0.5"/>
      </g>
    </svg>
  )
}
