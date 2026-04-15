'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Apex() {
  const sectionRef = useRef<HTMLElement>(null);
  const limbRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        if (limbRef.current) {
          limbRef.current.style.opacity = String(Math.min(1, p * 1.6));
          limbRef.current.style.transform = `translateX(-50%) translateY(${(1 - p) * 12}vh)`;
        }
        if (dataRef.current) dataRef.current.style.opacity = String(Math.max(0, p - 0.25) * 1.5);
        if (headlineRef.current) {
          const h = Math.min(1, p * 2.2);
          headlineRef.current.style.opacity = String(h);
          headlineRef.current.style.transform = `translateY(${(1 - h) * 18}px)`;
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="apex"
      className="relative h-[160vh] w-full overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Atmospheric limb — bright cyan glow above the earth's curve */}
        <div
          ref={limbRef}
          className="pointer-events-none absolute bottom-[18%] left-1/2"
          style={{
            width: '320vw',
            height: '14vh',
            transform: 'translateX(-50%) translateY(0)',
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(94,200,255,0.7) 0%, rgba(94,200,255,0.22) 35%, transparent 70%)',
            filter: 'blur(14px)',
            mixBlendMode: 'screen',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />

        {/* Distant jet silhouette */}
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none absolute top-[38%] left-[58%] z-10"
          style={{ width: '2.6vw', height: '2.6vw' }}
        >
          <path
            d="M 100 20 L 108 80 L 180 150 L 180 155 L 108 140 L 110 180 L 120 190 L 80 190 L 90 180 L 92 140 L 20 155 L 20 150 L 92 80 Z"
            fill="rgba(5,7,10,0.9)"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="1"
          />
        </svg>

        {/* Bottom data strip */}
        <div
          ref={dataRef}
          className="absolute bottom-[12%] left-[90px] right-[90px] z-20 flex justify-between mono text-[10px] text-[var(--bone)]/70"
          style={{ opacity: 0 }}
        >
          <div>
            <div className="text-[var(--bone)]/40 text-[9px]">ALTITUDE</div>
            <div className="text-lg tabular-nums text-[var(--mach)]">62,840 FT</div>
            <div className="text-[9px] text-[var(--bone)]/50 mt-1">STRATOSPHERE · LAYER 2</div>
          </div>
          <div className="text-center">
            <div className="text-[var(--bone)]/40 text-[9px]">POSITION</div>
            <div className="text-sm tabular-nums">N 34° 42′ 07″</div>
            <div className="text-sm tabular-nums">W 118° 11′ 44″</div>
          </div>
          <div className="text-right">
            <div className="text-[var(--bone)]/40 text-[9px]">AIRFRAME LOAD</div>
            <div className="text-lg tabular-nums text-[var(--afterburn)]">0.4 G</div>
            <div className="text-[9px] text-[var(--bone)]/50 mt-1">BALLISTIC · QUIET</div>
          </div>
        </div>

        {/* Headline */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8 z-10">
          <h2
            ref={headlineRef}
            className="display text-center text-[var(--bone)] max-w-6xl"
            style={{
              fontSize: 'clamp(2rem, 6.5vw, 7rem)',
              lineHeight: 0.95,
              textShadow: '0 4px 80px rgba(0,0,0,0.8)',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            YOU WERE NEVER<br />
            <span style={{ color: 'var(--mach)' }}>GROUND-BOUND.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
