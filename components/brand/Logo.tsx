import React from 'react';

/**
 * Expressive Handwritten Script Logo
 * Exact visual match to the "Liam" gold signature logo in the reference template.
 */
export function SignatureLogo({
  className = 'h-9 w-auto',
  color = '#FACC15',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 140 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ali Signature Logo"
    >
      {/* Dynamic brush stroke "Ali" */}
      <path
        d="M12 42C18 35 24 20 28 12C29 10 32 9 33 11C33 13 32 17 31 22C29 28 27 34 26 40C30 38 36 34 42 28C40 33 37 38 33 42C30 45 23 46 18 45C14 44 11 41 12 42Z"
        fill={color}
      />
      <path
        d="M26 26C32 23 40 21 46 22C44 25 40 27 35 28C31 29 28 28 26 26Z"
        fill={color}
      />
      {/* Letter 'l' fluid stroke */}
      <path
        d="M50 8C52 6 56 7 57 10C57 15 54 26 52 35C51 40 52 43 56 42C60 41 64 36 67 30C66 34 63 41 58 44C52 47 46 45 47 38C48 29 52 14 50 8Z"
        fill={color}
      />
      {/* Letter 'i' + dot */}
      <path
        d="M72 22C74 20 78 21 78 24C77 28 75 35 74 40C76 39 80 35 83 31C81 35 78 40 75 43C71 45 68 44 69 39C70 33 72 25 72 22Z"
        fill={color}
      />
      <ellipse cx="78" cy="14" rx="3.5" ry="3" fill={color} />
      {/* Underline flourish brush dynamic sweep */}
      <path
        d="M10 46C35 48 70 47 110 38C120 36 130 33 136 30C132 33 118 38 105 41C68 50 32 50 10 46Z"
        fill={color}
        opacity="0.85"
      />
    </svg>
  );
}

/**
 * Brand Logo Component: Signature + Subtitle
 */
export function BrandLogo({
  showSubtitle = false,
  className = '',
}: {
  showSubtitle?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      <SignatureLogo className="h-8 sm:h-9 w-auto transition-transform duration-300 group-hover:scale-105" />
      {showSubtitle && (
        <span className="text-[11px] font-mono tracking-widest text-[#94A3B8] uppercase">
          Ali Husnain
        </span>
      )}
    </div>
  );
}

/**
 * Compact Monogram badge
 */
export function AHMonogram({
  className = 'w-9 h-9',
}: {
  className?: string;
}) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-[#0F1E1C] border border-[#FACC15]/30 ${className}`}>
      <span className="font-heading font-black text-sm text-[#FACC15]">AH</span>
    </div>
  );
}
