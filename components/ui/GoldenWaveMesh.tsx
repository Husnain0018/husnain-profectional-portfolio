import React from 'react';

/**
 * Organic Golden Wave Mesh lines matching the bottom ambient graphic
 * from the Liam reference image.
 */
export function GoldenWaveMesh({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="goldWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FACC15" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#EAB308" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FACC15" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Undulating mesh line sweeps */}
      <path
        d="M0 320 C300 240 600 380 1200 220"
        stroke="url(#goldWaveGrad)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <path
        d="M0 340 C320 260 620 400 1200 240"
        stroke="url(#goldWaveGrad)"
        strokeWidth="1.2"
        strokeDasharray="2 3"
      />
      <path
        d="M0 360 C340 280 640 420 1200 260"
        stroke="url(#goldWaveGrad)"
        strokeWidth="1"
      />
      <path
        d="M0 300 C280 220 580 360 1200 200"
        stroke="url(#goldWaveGrad)"
        strokeWidth="1.2"
        strokeDasharray="3 5"
      />
      <path
        d="M0 280 C260 200 560 340 1200 180"
        stroke="url(#goldWaveGrad)"
        strokeWidth="0.8"
      />
    </svg>
  );
}
