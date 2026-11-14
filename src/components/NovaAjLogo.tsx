import React, { useId } from 'react';

interface NovaAjLogoProps {
  variant?: 'full' | 'horizontal' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NovaAjLogo: React.FC<NovaAjLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
}) => {
  const uid = useId().replace(/:/g, '');
  const silverGradId = `nova-silver-${uid}`;
  const silverDarkGradId = `nova-silver-dark-${uid}`;
  const orangeGradId = `nova-orange-${uid}`;
  const orangeBowlGradId = `nova-orange-bowl-${uid}`;
  const textSilverGradId = `nova-text-silver-${uid}`;
  const textOrangeGradId = `nova-text-orange-${uid}`;
  const flareGradId = `nova-flare-${uid}`;
  const shadowId = `nova-shadow-${uid}`;

  const renderDefs = () => (
    <defs>
      {/* Brushed Metallic Silver for Left N */}
      <linearGradient id={silverGradId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#949BA4" />
        <stop offset="28%" stopColor="#FFFFFF" />
        <stop offset="52%" stopColor="#CBD2D9" />
        <stop offset="76%" stopColor="#7B828C" />
        <stop offset="100%" stopColor="#E4E7EB" />
      </linearGradient>

      <linearGradient id={silverDarkGradId} x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="35%" stopColor="#D6DBE0" />
        <stop offset="70%" stopColor="#828993" />
        <stop offset="100%" stopColor="#EAECEF" />
      </linearGradient>

      {/* Vibrant Orange-Gold Gradient for Swoosh */}
      <linearGradient id={orangeGradId} x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF4D00" />
        <stop offset="45%" stopColor="#FF7B00" />
        <stop offset="80%" stopColor="#FFA800" />
        <stop offset="100%" stopColor="#FFCE00" />
      </linearGradient>

      {/* Glossy J Bowl Highlight Gradient */}
      <linearGradient id={orangeBowlGradId} x1="20%" y1="90%" x2="80%" y2="10%">
        <stop offset="0%" stopColor="#FF5400" />
        <stop offset="48%" stopColor="#FFCE00" />
        <stop offset="72%" stopColor="#FF8800" />
        <stop offset="100%" stopColor="#FF4D00" />
      </linearGradient>

      {/* Text Metallic Silver */}
      <linearGradient id={textSilverGradId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="55%" stopColor="#F3F4F6" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>

      {/* Text Glowing Orange */}
      <linearGradient id={textOrangeGradId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF9E00" />
        <stop offset="50%" stopColor="#FF6A00" />
        <stop offset="100%" stopColor="#E84500" />
      </linearGradient>

      {/* Cyan Horizontal Flare */}
      <linearGradient id={flareGradId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
        <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.45" />
        <stop offset="50%" stopColor="#E0F2FE" stopOpacity="1" />
        <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
      </linearGradient>

      <filter id={shadowId} x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.7" />
      </filter>
    </defs>
  );

  // Shared NJ Monogram SVG paths in coordinate space 0..240 x 0..145
  const renderMonogramPaths = () => (
    <g filter={`url(#${shadowId})`}>
      {/* Left Metallic Silver N - Main Left Pillar & Lower Inner Diagonal */}
      <path
        d="M 41 42 C 33 73, 25 103, 19 131 C 32 130, 41 124, 46 112 L 56 71 L 82 103 L 91 94 L 46 39 Z"
        fill={`url(#${silverGradId})`}
      />
      {/* Left Metallic Silver N - Upper Diagonal Shoulder */}
      <path
        d="M 38 19 L 65 19 L 113 76 L 97 90 L 38 19 Z"
        fill={`url(#${silverDarkGradId})`}
      />

      {/* Glossy Orange-Gold Sweeping Swoosh / Right Stem of N & J */}
      <path
        d="M 45 133 C 77 118, 108 86, 128 36 C 132 25, 128 22, 125 19 L 172 19 C 168 35, 160 51, 148 68 C 127 98, 95 121, 45 133 Z"
        fill={`url(#${orangeGradId})`}
      />

      {/* Glossy Orange-Gold J Hook / Teardrop Bowl */}
      <path
        d="M 164 52 C 161 75, 155 96, 146 111 C 136 127, 113 130, 99 119 C 93 114, 96 106, 104 101 C 126 86, 146 69, 164 52 Z"
        fill={`url(#${orangeBowlGradId})`}
      />

      {/* 5 Digital Floating Pixel Squares at Top-Right */}
      <rect x="169" y="34" width="11" height="11" rx="1.5" fill="#FF9800" />
      <rect x="176" y="19" width="8.5" height="8.5" rx="1.2" fill="#FFAE00" />
      <rect x="188" y="16" width="15" height="15" rx="2" fill="#FFCB05" />
      <rect x="193" y="3" width="9" height="9" rx="1.2" fill="#FFA600" />
      <rect x="206" y="10" width="11" height="11" rx="1.5" fill="#FF8000" />
    </g>
  );

  if (variant === 'icon') {
    const dim = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
    return (
      <div
        className={`${dim} rounded-xl bg-[#040507] border border-white/15 flex items-center justify-center shadow-lg shrink-0 overflow-hidden p-1 ${className}`}
      >
        <svg viewBox="10 0 212 140" className="w-full h-full">
          {renderDefs()}
          {renderMonogramPaths()}
        </svg>
      </div>
    );
  }

  if (variant === 'horizontal') {
    const heightClass = size === 'sm' ? 'h-10 px-2.5' : size === 'lg' ? 'h-14 px-3.5' : 'h-12 px-3';
    return (
      <div
        className={`inline-flex items-center gap-2.5 rounded-xl bg-[#050608] border border-white/10 shadow-md select-none shrink-0 ${heightClass} ${className}`}
      >
        <svg viewBox="10 0 212 140" className={size === 'sm' ? 'h-7 w-auto' : size === 'lg' ? 'h-10 w-auto' : 'h-8 w-auto'}>
          {renderDefs()}
          {renderMonogramPaths()}
        </svg>
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-1 tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <span className={`font-extrabold text-white ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'}`}>
              Nova
            </span>
            <span
              className={`font-extrabold bg-gradient-to-b from-[#FFA600] via-[#FF6A00] to-[#E84500] bg-clip-text text-transparent ${
                size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
              }`}
            >
              AJ
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-[1px] w-2.5 bg-gradient-to-r from-transparent to-white/60" />
            <span className="text-[7px] sm:text-[8px] font-semibold tracking-[0.26em] text-neutral-200 uppercase">
              SISTEMA DIGITAL
            </span>
            <span className="h-[1px] w-2.5 bg-gradient-to-l from-transparent to-white/60" />
          </div>
        </div>
      </div>
    );
  }

  // variant === 'full' -> Exact square/rectangular dark lockup matching "logo ja nova.png"
  const containerWidth = size === 'sm' ? 'w-44' : size === 'lg' ? 'w-72 sm:w-80' : 'w-60';
  return (
    <div
      className={`bg-[#020305] rounded-2xl border border-white/10 shadow-2xl overflow-hidden select-none inline-flex items-center justify-center p-3 ${containerWidth} ${className}`}
    >
      <svg viewBox="0 0 360 255" className="w-full h-auto block">
        {renderDefs()}

        {/* Subtle Dark Blue Ambient Glow Behind Center Line */}
        <radialGradient id={`bg-glow-${uid}`} cx="50%" cy="54%" r="48%">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#020305" stopOpacity="0" />
        </radialGradient>
        <rect x="0" y="0" width="360" height="255" fill={`url(#bg-glow-${uid})`} />

        {/* Centered NJ Monogram */}
        <g transform="translate(76, 18) scale(0.95)">
          {renderMonogramPaths()}
        </g>

        {/* Horizontal Cyan Lens Flare Line */}
        <rect x="38" y="153" width="284" height="1.8" fill={`url(#${flareGradId})`} />
        <ellipse cx="176" cy="154" rx="18" ry="3.5" fill="#7DD3FC" opacity="0.45" />
        <circle cx="176" cy="154" r="2.2" fill="#FFFFFF" opacity="0.95" />

        {/* Wordmark: Nova AJ */}
        <g transform="translate(180, 198)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fontFamily="'Orbitron', 'Arial Black', sans-serif"
            fontWeight="800"
            fontSize="36"
            letterSpacing="2"
          >
            <tspan fill={`url(#${textSilverGradId})`}>Nova </tspan>
            <tspan fill={`url(#${textOrangeGradId})`}>AJ</tspan>
          </text>
        </g>

        {/* Tagline: ——— SISTEMA DIGITAL ——— */}
        <g transform="translate(180, 224)">
          <line x1="-132" y1="-4" x2="-88" y2="-4" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="#E5E7EB"
            fontFamily="Inter, system-ui, sans-serif"
            fontWeight="600"
            fontSize="11.5"
            letterSpacing="4.5"
          >
            SISTEMA DIGITAL
          </text>
          <line x1="88" y1="-4" x2="132" y2="-4" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
};
