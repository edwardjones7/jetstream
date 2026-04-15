'use client';

import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Legacy() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 85%',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        path.style.strokeDashoffset = String(length * (1 - p));
        if (wordmarkRef.current) {
          wordmarkRef.current.style.opacity = String(Math.max(0, (p - 0.5) * 2));
          wordmarkRef.current.style.transform = `translateY(${(1 - p) * 30}px)`;
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="legacy"
      className="relative h-[150vh] w-full overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Contrail path drawing */}
        <svg
          viewBox="0 0 1200 700"
          className="pointer-events-none absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,91,20,0)" />
              <stop offset="20%" stopColor="rgba(255,91,20,0.8)" />
              <stop offset="60%" stopColor="rgba(238,240,243,0.9)" />
              <stop offset="100%" stopColor="rgba(94,200,255,1)" />
            </linearGradient>
            <filter id="trailGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            ref={pathRef}
            d="M 50 600 Q 300 580 450 450 T 800 250 Q 950 180 1150 120"
            fill="none"
            stroke="url(#trail)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#trailGlow)"
          />
        </svg>

        {/* Wordmark + CTA */}
        <div
          ref={wordmarkRef}
          className="relative z-10 flex flex-col items-center gap-10 px-8"
          style={{ opacity: 0 }}
        >
          <h2
            className="display text-center text-[var(--bone)]"
            style={{
              fontSize: 'clamp(3rem, 11vw, 12rem)',
              lineHeight: 0.85,
              textShadow: '0 4px 80px rgba(0,0,0,0.6)',
            }}
          >
            OWN THE SKY.
          </h2>

          <div className="mono text-[10px] text-[var(--bone)]/60 text-center max-w-md">
            NOT A PRODUCT. A POSTURE.<br />
            FOR THE ONES WHO REFUSE THE GROUND.
          </div>

          <button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="group relative mono text-[11px] px-10 py-5 overflow-hidden transition-all duration-300"
            style={{
              border: '1px solid rgba(238,240,243,0.3)',
              color: hover ? 'var(--void)' : 'var(--bone)',
              background: hover ? 'var(--afterburn)' : 'transparent',
              boxShadow: hover
                ? '0 0 40px var(--afterburn), inset 0 0 20px rgba(255,255,255,0.2)'
                : 'none',
            }}
          >
            <span className="relative z-10 flex items-center gap-4">
              REQUEST A BRIEFING
              <span
                className="inline-block transition-transform duration-300"
                style={{ transform: hover ? 'translateX(6px)' : 'translateX(0)' }}
              >
                →
              </span>
            </span>
          </button>

          <div className="mono text-[9px] text-[var(--bone)]/30 mt-12">
            END OF TRANSMISSION · SCROLL COMPLETE
          </div>
        </div>
      </div>
    </section>
  );
}
