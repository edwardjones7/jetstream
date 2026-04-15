'use client';

import { forwardRef, SVGProps } from 'react';

const Blackbird = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function Blackbird(props, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 300 620"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient id="bb-body" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#14171d" />
            <stop offset="45%" stopColor="#0a0d12" />
            <stop offset="100%" stopColor="#04060a" />
          </linearGradient>
          <linearGradient id="bb-chine" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="bb-ember" cx="50%" cy="95%" r="20%">
            <stop offset="0%" stopColor="#ff6a1c" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff3a00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff3a00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Afterburn ember — peeks from exhausts */}
        <ellipse cx="105" cy="580" rx="16" ry="22" fill="url(#bb-ember)" />
        <ellipse cx="195" cy="580" rx="16" ry="22" fill="url(#bb-ember)" />

        {/* Shock diamonds — small glowing knots just past the exhaust cones */}
        <g>
          <ellipse cx="105" cy="595" rx="4" ry="2" fill="#ffd38a" opacity="0.95">
            <animate attributeName="opacity" values="0.95;0.35;0.95" dur="0.55s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="105" cy="608" rx="3" ry="1.6" fill="#ffd38a" opacity="0.75">
            <animate attributeName="opacity" values="0.75;0.25;0.75" dur="0.65s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="195" cy="595" rx="4" ry="2" fill="#ffd38a" opacity="0.95">
            <animate attributeName="opacity" values="0.95;0.35;0.95" dur="0.6s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="195" cy="608" rx="3" ry="1.6" fill="#ffd38a" opacity="0.75">
            <animate attributeName="opacity" values="0.75;0.25;0.75" dur="0.7s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Main silhouette: nose → chines → wing → nacelles → tail, mirrored */}
        <path
          d="M 150 12
             Q 154 70 160 170
             L 172 260
             L 210 335
             L 288 430
             L 282 470
             L 232 474
             L 222 572
             L 198 580
             L 190 480
             L 162 478
             L 160 586
             L 140 586
             L 138 478
             L 110 480
             L 102 580
             L 78 572
             L 68 474
             L 18 470
             L 12 430
             L 90 335
             L 128 260
             L 140 170
             Q 146 70 150 12 Z"
          fill="url(#bb-body)"
          stroke="rgba(230,235,245,0.12)"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />

        {/* Chine highlight running down body */}
        <path
          d="M 150 18
             Q 152 80 158 170
             L 168 258
             L 195 320
             L 150 300
             L 105 320
             L 132 258
             L 142 170
             Q 148 80 150 18 Z"
          fill="url(#bb-chine)"
          opacity="0.55"
        />

        {/* Cockpit canopy */}
        <ellipse cx="150" cy="105" rx="5.5" ry="18" fill="rgba(94,200,255,0.22)" />
        <ellipse cx="150" cy="108" rx="2" ry="8" fill="rgba(230,245,255,0.55)" />

        {/* Inward-canted vertical stabilizers (visible as slim triangles atop nacelles) */}
        <path d="M 110 460 L 122 492 L 114 494 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
        <path d="M 190 460 L 178 492 L 186 494 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />

        {/* Intake spike shadows at nacelle fronts */}
        <ellipse cx="105" cy="400" rx="6" ry="9" fill="#000" opacity="0.85" />
        <ellipse cx="195" cy="400" rx="6" ry="9" fill="#000" opacity="0.85" />

        {/* Exhaust cones */}
        <ellipse cx="105" cy="576" rx="7" ry="4" fill="#000" />
        <ellipse cx="195" cy="576" rx="7" ry="4" fill="#000" />
        <ellipse cx="150" cy="582" rx="4" ry="2.5" fill="#000" opacity="0.8" />
      </svg>
    );
  }
);

export default Blackbird;
