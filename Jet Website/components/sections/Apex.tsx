'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEDIA } from '@/lib/media';

export default function Apex() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        if (bgRef.current) {
          bgRef.current.style.transform = `scale(${1 + p * 0.15})`;
          bgRef.current.style.opacity = String(Math.min(1, p * 2));
        }
        if (earthRef.current) earthRef.current.style.transform = `translateX(-50%) translateY(${30 - p * 10}%)`;
        if (sunRef.current) {
          sunRef.current.style.opacity = String(0.4 + p * 0.5);
          sunRef.current.style.transform = `translate(-50%,-50%) scale(${0.9 + p * 0.3})`;
        }
        if (dataRef.current) dataRef.current.style.opacity = String(Math.max(0, p - 0.25) * 1.5);
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="apex"
      className="relative h-[160vh] w-full overflow-hidden bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Space/earth backdrop */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${MEDIA.apex})`,
            filter: 'brightness(0.7) contrast(1.2) saturate(1.1)',
            opacity: 0,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(0,0,0,0.85) 80%)' }}
        />

        {/* Starfield overlay */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 180 }).map((_, i) => {
            const seed = i * 1.618;
            const top = (seed * 37) % 100;
            const left = (seed * 71) % 100;
            const size = ((seed * 13) % 2.5) + 0.3;
            const opacity = ((seed * 17) % 0.7) + 0.2;
            const delay = (seed * 3) % 4;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${top}%`, left: `${left}%`,
                  width: `${size}px`, height: `${size}px`,
                  opacity,
                  animation: `twinkle ${2 + (seed % 2)}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                  boxShadow: size > 1.5 ? '0 0 8px rgba(255,255,255,0.9)' : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Sun flare */}
        <div
          ref={sunRef}
          className="pointer-events-none absolute top-[28%] left-[68%]"
          style={{
            width: '70vh', height: '70vh',
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(circle, rgba(255,240,200,0.95) 0%, rgba(255,180,100,0.45) 15%, rgba(255,120,60,0.12) 40%, transparent 70%)',
            filter: 'blur(20px)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Sun lens flare streak */}
        <div
          className="pointer-events-none absolute top-[28%] left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 30%, rgba(255,220,150,0.4) 50%, transparent 70%)',
            boxShadow: '0 0 10px rgba(255,220,150,0.5)',
          }}
        />

        {/* Earth curve */}
        <div
          ref={earthRef}
          className="absolute bottom-0 left-1/2 rounded-full"
          style={{
            width: '280vw', height: '200vh',
            transform: 'translateX(-50%) translateY(30%)',
            background: 'radial-gradient(ellipse at 50% 10%, rgba(94,200,255,0.28) 0%, rgba(40,80,140,0.18) 20%, rgba(10,20,45,0.7) 50%, #020306 70%)',
            boxShadow: 'inset 0 40px 120px rgba(94,200,255,0.25), 0 -30px 100px rgba(94,200,255,0.2)',
          }}
        />

        {/* Atmospheric limb */}
        <div
          className="pointer-events-none absolute bottom-[26%] left-1/2 -translate-x-1/2"
          style={{
            width: '280vw', height: '10vh',
            background: 'radial-gradient(ellipse at 50% 100%, rgba(94,200,255,0.6) 0%, rgba(94,200,255,0.2) 40%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Distant jet silhouette */}
        <svg viewBox="0 0 200 200" className="pointer-events-none absolute top-[38%] left-[58%] z-10"
             style={{ width: '2.6vw', height: '2.6vw' }}>
          <path d="M 100 20 L 108 80 L 180 150 L 180 155 L 108 140 L 110 180 L 120 190 L 80 190 L 90 180 L 92 140 L 20 155 L 20 150 L 92 80 Z"
                fill="#05070a" stroke="#000" strokeWidth="1" />
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

        {/* Text */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8 z-10">
          <h2
            className="display text-center text-[var(--bone)] max-w-6xl"
            style={{
              fontSize: 'clamp(2rem, 6.5vw, 7rem)',
              lineHeight: 0.95,
              textShadow: '0 4px 80px rgba(0,0,0,0.85)',
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
