'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollVelocityRef } from '@/hooks/useScrollVelocity';
import { MEDIA } from '@/lib/media';

export default function Ignition() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const coneRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const streakHostRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const leftDataRef = useRef<HTMLDivElement>(null);
  const rightDataRef = useRef<HTMLDivElement>(null);
  const velocityRef = useScrollVelocityRef();

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
        const eased = Math.min(1, Math.max(0, (p - 0.15) / 0.55));
        if (coneRef.current) {
          coneRef.current.style.transform = `translate(-50%,-50%) scale(${0.4 + eased * 2.2})`;
          coneRef.current.style.opacity = String(eased);
        }
        if (coreRef.current) {
          coreRef.current.style.opacity = String(eased);
          coreRef.current.style.transform = `translate(-50%,-50%) scale(${0.8 + eased * 1.2})`;
        }
        if (streakHostRef.current) streakHostRef.current.style.opacity = String(eased);
        if (bgRef.current) {
          bgRef.current.style.transform = `scale(${1 + p * 0.3})`;
          bgRef.current.style.filter = `brightness(${0.5 + eased * 0.5}) saturate(${1 + eased * 0.4})`;
        }
        if (leftDataRef.current) leftDataRef.current.style.opacity = String(Math.max(0, 1 - Math.abs(p - 0.5) * 2.5));
        if (rightDataRef.current) rightDataRef.current.style.opacity = String(Math.max(0, 1 - Math.abs(p - 0.5) * 2.5));
      },
    });

    // Velocity shake — only run RAF while section is in viewport
    let raf = 0;
    let visible = false;
    const shake = () => {
      const v = velocityRef.current;
      const amp = v * 8;
      if (stickyRef.current && amp > 0.05) {
        const x = (Math.random() - 0.5) * amp;
        const y = (Math.random() - 0.5) * amp;
        stickyRef.current.style.transform = `translate(${x}px,${y}px)`;
      } else if (stickyRef.current) {
        stickyRef.current.style.transform = '';
      }
      raf = requestAnimationFrame(shake);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible) raf = requestAnimationFrame(shake);
        else if (!visible && wasVisible) cancelAnimationFrame(raf);
      },
      { threshold: 0 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    return () => {
      st.kill();
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [velocityRef]);

  return (
    <section
      ref={sectionRef}
      id="ignition"
      className="relative h-[200vh] w-full overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Backdrop */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${MEDIA.afterburn})`,
            filter: 'brightness(0.5) saturate(1.2)',
          }}
        />
        {/* Orange tonal overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,91,20,0.32) 0%, rgba(100,30,10,0.18) 40%, transparent 75%)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* Streaks */}
        <div ref={streakHostRef} className="absolute inset-0 opacity-0">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px"
              style={{
                top: `${3 + i * 4.4}%`,
                left: 0,
                right: 0,
                background: `linear-gradient(90deg, transparent 0%, rgba(255,${140 + i * 4},${40 + i * 2},0.85) 50%, transparent 100%)`,
                animation: `ignition-streak ${0.3 + (i % 5) * 0.08}s linear infinite`,
                animationDelay: `${i * 0.035}s`,
                filter: 'blur(0.4px)',
              }}
            />
          ))}
        </div>

        {/* Afterburner bloom */}
        <div
          ref={coneRef}
          className="pointer-events-none absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: '95vh',
            height: '95vh',
            transform: 'translate(-50%,-50%) scale(0.4)',
            background:
              'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,220,120,0.75) 10%, rgba(255,120,40,0.55) 25%, rgba(200,50,20,0.3) 45%, rgba(100,20,10,0.1) 65%, transparent 80%)',
            filter: 'blur(8px)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          ref={coreRef}
          className="pointer-events-none absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: '22vh',
            height: '22vh',
            transform: 'translate(-50%,-50%)',
            background:
              'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(150,220,255,0.7) 25%, rgba(80,180,255,0.3) 55%, transparent 75%)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Left: engine stats */}
        <div
          ref={leftDataRef}
          className="absolute left-[90px] top-[18%] z-10 mono text-[10px] w-[230px] space-y-5"
        >
          <div className="flex items-center gap-2 text-[var(--afterburn)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--afterburn)]" style={{ animation: 'hud-pulse 0.9s ease-in-out infinite' }} />
            ENGINE / AFTERBURNER
          </div>
          <div>
            <div className="text-[var(--bone)]/40 text-[9px] mb-1">PRATT & WHITNEY F119-PW-100</div>
            <div className="text-[var(--bone)]">35,000 LBF · WITH A/B</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[var(--bone)]/40 text-[9px]">RPM</div>
              <div className="text-[var(--afterburn)] text-sm tabular-nums">104.2%</div>
            </div>
            <div>
              <div className="text-[var(--bone)]/40 text-[9px]">EGT</div>
              <div className="text-[var(--afterburn)] text-sm tabular-nums">1,710°C</div>
            </div>
            <div>
              <div className="text-[var(--bone)]/40 text-[9px]">FUEL FLOW</div>
              <div className="text-[var(--bone)] text-sm tabular-nums">82,400 PPH</div>
            </div>
            <div>
              <div className="text-[var(--bone)]/40 text-[9px]">NOZZLE</div>
              <div className="text-[var(--bone)] text-sm tabular-nums">OPEN / VECT</div>
            </div>
          </div>
        </div>

        {/* Right: thrust curve */}
        <div
          ref={rightDataRef}
          className="absolute right-[90px] top-[18%] z-10 mono text-[10px] w-[240px]"
        >
          <div className="flex items-center gap-2 text-[var(--bone)]/50 mb-3 justify-end">
            THRUST CURVE / T+00:00:04
            <span className="h-1 w-1 rounded-full bg-[var(--mach)]" />
          </div>
          <svg viewBox="0 0 240 120" className="w-full h-auto">
            {/* Grid */}
            {[0, 1, 2, 3].map((i) => (
              <line key={`h${i}`} x1="0" x2="240" y1={30 * i + 5} y2={30 * i + 5} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            ))}
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={`v${i}`} y1="0" y2="120" x1={48 * i + 0.5} x2={48 * i + 0.5} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            ))}
            {/* Curve */}
            <path
              d="M 0 110 Q 40 108 70 80 T 140 28 T 240 12"
              fill="none"
              stroke="var(--afterburn)"
              strokeWidth="1.5"
            />
            <path
              d="M 0 110 Q 40 108 70 80 T 140 28 T 240 12 L 240 120 L 0 120 Z"
              fill="rgba(255,91,20,0.15)"
            />
            {/* Live marker */}
            <circle cx="140" cy="28" r="3" fill="var(--afterburn)">
              <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </svg>
          <div className="mt-3 text-right text-[var(--bone)]/50 text-[9px] space-y-1">
            <div>T0 · MIL POWER</div>
            <div>T+2 · A/B LIGHT</div>
            <div className="text-[var(--afterburn)]">T+4 · ZONE 5 · NOMINAL</div>
          </div>
        </div>

        {/* Text */}
        <div
          ref={stickyRef}
          className="relative z-10 flex h-full items-center justify-center"
        >
          <h2
            className="display text-center text-[var(--bone)] select-none"
            style={{
              fontSize: 'clamp(3rem, 11vw, 12rem)',
              lineHeight: 0.88,
              textShadow: '0 4px 60px rgba(255,91,20,0.35), 0 0 120px rgba(0,0,0,0.6)',
            }}
          >
            MACH ONE
            <br />
            <span style={{ color: 'var(--afterburn)' }}>BEGINS</span>
            <br />
            AT ZERO
          </h2>
        </div>

        {/* Bottom chapter tag */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 mono text-[10px] text-[var(--afterburn)]/70 flex items-center gap-4">
          <span className="h-px w-8 bg-[var(--afterburn)]/40" />
          <span>II — ROLLOUT</span>
          <span className="h-px w-8 bg-[var(--afterburn)]/40" />
        </div>
      </div>
    </section>
  );
}
