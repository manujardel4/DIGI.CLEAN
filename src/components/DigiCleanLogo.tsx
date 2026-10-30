import React from 'react';

interface DigiCleanLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export const DigiCleanLogo: React.FC<DigiCleanLogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 'md',
  onClick,
}) => {
  // Size calculations
  const iconSize = size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 44 : 56;
  const textSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-4xl';

  // 4 circular icons as exactly depicted in the brand artwork
  const renderCircles = (customClass = '') => (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${customClass}`}>
      {/* Circle 1: Orange - Washing Machine */}
      <div 
        style={{ width: iconSize, height: iconSize, backgroundColor: '#ffa45b' }} 
        className="rounded-full flex items-center justify-center shrink-0 shadow-sm"
        title="Lavage expert"
      >
        <svg 
          viewBox="0 0 36 36" 
          style={{ width: iconSize * 0.58, height: iconSize * 0.58 }}
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="30" height="30" rx="4" />
          <circle cx="18" cy="19" r="8" />
          <circle cx="18" cy="19" r="4.5" />
          <circle cx="9" cy="8" r="1.5" fill="#FFFFFF" />
          <line x1="16" y1="8" x2="27" y2="8" />
        </svg>
      </div>

      {/* Circle 2: Turquoise - T-Shirt */}
      <div 
        style={{ width: iconSize, height: iconSize, backgroundColor: '#40e0d0' }} 
        className="rounded-full flex items-center justify-center shrink-0 shadow-sm"
        title="Pressing & Blanchisserie"
      >
        <svg 
          viewBox="0 0 36 36" 
          style={{ width: iconSize * 0.6, height: iconSize * 0.6 }}
          fill="#FFFFFF"
        >
          <path d="M 9 10 L 14 7 C 15.5 10 20.5 10 22 7 L 27 10 L 25 16 L 22 15 L 22 29 L 14 29 L 14 15 L 11 16 Z" />
        </svg>
      </div>

      {/* Circle 3: Turquoise - Iron */}
      <div 
        style={{ width: iconSize, height: iconSize, backgroundColor: '#40e0d0' }} 
        className="rounded-full flex items-center justify-center shrink-0 shadow-sm"
        title="Repassage soigné"
      >
        <svg 
          viewBox="0 0 36 36" 
          style={{ width: iconSize * 0.62, height: iconSize * 0.62 }}
          fill="#FFFFFF"
        >
          {/* Iron base */}
          <path d="M 6 25 C 6 23 8 16 14 13 C 20 10 31 10 32 17 L 32 25 Z" />
          {/* Iron handle */}
          <path d="M 14 11 C 14 8 17 6 22 6 L 30 6 C 31.5 6 32 7 32 8.5 C 32 10 31.5 11 30 11 L 22 11 C 19 11 16 12 14 14 Z" />
          {/* Steam vents */}
          <circle cx="15" cy="20" r="1.2" fill="#40e0d0" />
          <circle cx="20" cy="20" r="1.2" fill="#40e0d0" />
          <circle cx="25" cy="20" r="1.2" fill="#40e0d0" />
        </svg>
      </div>

      {/* Circle 4: Orange - Clothes Hanger */}
      <div 
        style={{ width: iconSize, height: iconSize, backgroundColor: '#ffa45b' }} 
        className="rounded-full flex items-center justify-center shrink-0 shadow-sm"
        title="Mise sous cintre"
      >
        <svg 
          viewBox="0 0 36 36" 
          style={{ width: iconSize * 0.6, height: iconSize * 0.6 }}
          fill="none" 
          stroke="#FFFFFF" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Hook */}
          <path d="M 18 14 C 18 10 20.5 7 23.5 7.5 C 25.5 8 27 9.5 26.5 12 C 26 14 23.5 15.5 20.5 16 L 18 17" />
          {/* Triangle hanger frame */}
          <path d="M 18 17 L 6 27 L 30 27 Z" />
        </svg>
      </div>
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <div onClick={onClick} className={`inline-flex items-center cursor-pointer select-none ${className}`}>
        {renderCircles()}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex flex-col items-center justify-center gap-2 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {renderCircles()}
        <span 
          style={{ color: '#40e0d0' }} 
          className={`font-baloo font-extrabold tracking-[0.22em] ${textSize} leading-none select-none drop-shadow-xs`}
        >
          DIGICLEAN
        </span>
      </div>
    );
  }

  // Default: horizontal variant (suitable for app bar header, top-left)
  return (
    <div 
      onClick={onClick} 
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:opacity-95' : ''} ${className}`}
    >
      {renderCircles()}
      <div className="flex flex-col">
        <span 
          style={{ color: '#40e0d0' }} 
          className={`font-baloo font-extrabold tracking-[0.2em] ${textSize} leading-none select-none`}
        >
          DIGICLEAN
        </span>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-tight mt-0.5 hidden sm:inline-block">
          Pressing &amp; Blanchisserie
        </span>
      </div>
    </div>
  );
};
