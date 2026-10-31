import React from 'react';

/**
 * Authentic Dynamic Yellow Paint Brush Splatter SVG
 * Exactly replicates the energetic diagonal golden paint splash behind the developer
 * from the reference Liam template image.
 */
export function YellowBrushSplash({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brushGradMain" x1="10%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stopColor="#CA8A04" />
          <stop offset="25%" stopColor="#EAB308" />
          <stop offset="70%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>

        <linearGradient id="brushGradSecondary" x1="20%" y1="80%" x2="80%" y2="20%">
          <stop offset="0%" stopColor="#EAB308" />
          <stop offset="60%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#FDE047" />
        </linearGradient>

        <filter id="brushGlowFilter" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#brushGlowFilter)">
        {/* Deep ambient back-glow for rich color vibrancy */}
        <path
          d="M100 480 C180 380 250 260 420 100 C470 60 520 80 530 130 C540 180 480 280 380 390 C290 490 190 530 110 510 C80 500 70 490 100 480 Z"
          fill="#CA8A04"
          opacity="0.35"
        />

        {/* Primary Dense Brush Stroke with feathered edges */}
        <path
          d="M120 460
             C150 430 190 390 230 330
             C270 270 320 200 400 120
             C440 80 490 60 520 85
             C540 105 530 145 490 200
             C440 270 380 340 310 420
             C240 500 170 525 125 500
             C105 490 100 475 120 460 Z"
          fill="url(#brushGradMain)"
        />

        {/* Secondary Expressive Bristle Pass */}
        <path
          d="M160 430
             C210 350 280 250 390 140
             C430 100 480 85 510 105
             C530 120 510 160 460 225
             C400 300 320 400 220 470
             C180 490 145 470 160 430 Z"
          fill="url(#brushGradSecondary)"
          opacity="0.9"
        />

        {/* Top-Right Trailing Bristle Marks (Iconic Liam Template Detail) */}
        <path
          d="M380 130 C430 80 490 45 550 55 C530 90 480 125 430 160 Z"
          fill="#FACC15"
          opacity="0.95"
        />
        <path
          d="M420 95 C460 60 515 35 565 45 C550 75 505 105 465 130 Z"
          fill="#FEF08A"
        />
        <path
          d="M350 170 C410 110 470 80 535 90 C510 125 455 165 400 200 Z"
          fill="#EAB308"
          opacity="0.85"
        />
        <path
          d="M460 70 C490 45 530 35 560 40 C545 60 515 75 485 90 Z"
          fill="#FDE047"
        />

        {/* Bottom-Left Bristle Tail Strokes */}
        <path
          d="M80 510 C120 460 170 410 220 370 C190 420 140 480 90 525 Z"
          fill="#EAB308"
          opacity="0.8"
        />
        <path
          d="M110 490 C150 430 200 380 250 340 C220 390 170 460 120 510 Z"
          fill="#FACC15"
          opacity="0.85"
        />

        {/* Dynamic Flying Paint Splatters & Droplets (Top Right) */}
        <circle cx="560" cy="35" r="7" fill="#FACC15" />
        <circle cx="585" cy="65" r="5" fill="#EAB308" />
        <circle cx="540" cy="20" r="4" fill="#FEF08A" />
        <circle cx="575" cy="100" r="4" fill="#FACC15" />
        <circle cx="590" cy="130" r="3" fill="#EAB308" />
        <circle cx="510" cy="30" r="5" fill="#FDE047" />
        <circle cx="480" cy="15" r="3" fill="#FACC15" />

        {/* Dynamic Flying Paint Splatters (Bottom Left) */}
        <circle cx="95" cy="540" r="7" fill="#FACC15" />
        <circle cx="65" cy="510" r="5" fill="#EAB308" />
        <circle cx="130" cy="555" r="4" fill="#FEF08A" />
        <circle cx="50" cy="480" r="4" fill="#FACC15" />
        <circle cx="80" cy="460" r="3" fill="#FDE047" />
        <circle cx="115" cy="520" r="5" fill="#EAB308" />
        <circle cx="40" cy="520" r="3" fill="#CA8A04" />

        {/* Textured Mid-Sweep Highlights */}
        <path
          d="M260 330 C300 270 360 200 440 130 C425 155 375 220 320 290 C290 325 260 340 260 330 Z"
          fill="#FEF08A"
          opacity="0.85"
        />
        <path
          d="M220 375 C270 300 330 230 410 165 C390 195 340 260 280 335 C250 370 220 385 220 375 Z"
          fill="#CA8A04"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}
