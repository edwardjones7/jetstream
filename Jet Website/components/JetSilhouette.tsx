'use client';

import { forwardRef, SVGProps } from 'react';

/**
 * Top-down stealth fighter silhouette. Scales to any size via viewBox.
 */
const JetSilhouette = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function JetSilhouette(props, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 200 300"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id="jet-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1d222b" />
            <stop offset="50%" stopColor="#0d1015" />
            <stop offset="100%" stopColor="#05070a" />
          </linearGradient>
          <linearGradient id="jet-spec" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Main airframe */}
        <path
          d="M 100 4
             L 108 38
             L 115 70
             L 135 130
             L 190 235
             L 190 248
             L 125 220
             L 128 272
             L 142 288
             L 142 294
             L 100 278
             L 58 294
             L 58 288
             L 72 272
             L 75 220
             L 10 248
             L 10 235
             L 65 130
             L 85 70
             L 92 38
             Z"
          fill="url(#jet-body)"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.4"
        />
        {/* Cockpit */}
        <path
          d="M 100 32 L 105 56 L 100 78 L 95 56 Z"
          fill="rgba(94,200,255,0.18)"
        />
        {/* Centerline highlight */}
        <path
          d="M 100 4 L 105 130 L 100 278 L 95 130 Z"
          fill="url(#jet-spec)"
          opacity="0.5"
        />
        {/* Twin exhaust */}
        <ellipse cx="85" cy="282" rx="6" ry="3" fill="#000" />
        <ellipse cx="115" cy="282" rx="6" ry="3" fill="#000" />
      </svg>
    );
  }
);

export default JetSilhouette;
