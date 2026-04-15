'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Mach() {
  const sectionRef = useRef<HTMLElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  const warnRef = useRef<HTMLDivElement>(null);
  const calmRef = useRef<HTMLDivElement>(null);
  const compressionRef = useRef<HTMLDivElement>(null);
  const vaporRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const phaseRef = useRef<HTMLDivElement>(null);
  const machRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const taglineTextRef = useRef<HTMLSpanElement>(null);

  const pressureRef = useRef<HTMLSpanElement>(null);
  const tempRef = useRef<HTMLSpanElement>(null);
  const gRef = useRef<HTMLSpanElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const regimeRef = useRef<HTMLSpanElement>(null);

  const progressRef = useRef(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;

        const mach = p < 0.5 ? 0.78 + p * 0.44 : 1.0 + (p - 0.5) * 2.4;
        const preBreak = p < 0.47;
        const inBreak = p >= 0.47 && p <= 0.55;

        if (machRef.current) machRef.current.textContent = mach.toFixed(2);

        if (phaseRef.current) {
          phaseRef.current.textContent = preBreak
            ? 'TRANSONIC · APPROACH'
            : inBreak
              ? 'SONIC · BREAK'
              : 'SUPERSONIC · BEYOND';
        }

        if (taglineTextRef.current) {
          taglineTextRef.current.textContent = preBreak
            ? 'THE WALL'
            : inBreak
              ? 'IMPACT'
              : 'SILENCE';
        }

        // Letter-spacing compresses as we approach, snaps open after break
        if (taglineRef.current) {
          const ls = preBreak ? 0.5 - (p / 0.47) * 0.45 : inBreak ? 0.04 : 0.36;
          taglineRef.current.style.letterSpacing = `${ls}em`;
        }

        // Warning wash — red-orange pressure field pre-break
        if (warnRef.current) {
          const w = preBreak ? Math.pow(p / 0.47, 1.6) : Math.max(0, 1 - (p - 0.47) / 0.05);
          warnRef.current.style.opacity = String(w);
        }

        // Calm wash — cold cyan post-break
        if (calmRef.current) {
          const c = p > 0.55 ? Math.min(1, (p - 0.55) / 0.12) : 0;
          calmRef.current.style.opacity = String(c * 0.9);
        }

        // Compression rails — shear increasing pre-break
        if (compressionRef.current) {
          const c = preBreak ? Math.pow(p / 0.47, 2) : Math.max(0, 1 - (p - 0.47) / 0.03);
          compressionRef.current.style.opacity = String(c);
        }

        // Post-break vapor drift
        if (vaporRef.current) {
          const v = p > 0.55 ? Math.min(1, (p - 0.55) / 0.18) : 0;
          vaporRef.current.style.opacity = String(v * 0.7);
          vaporRef.current.style.transform = `translateX(${(p - 0.55) * 220}px)`;
        }

        // Shockwave rings — expand outward at the break
        if (ringsRef.current) {
          const t = (p - 0.47) / 0.24;
          if (t > 0 && t < 1.15) {
            ringsRef.current.style.opacity = String(Math.max(0, 1 - t * 0.95));
            ringsRef.current.style.transform = `translate(-50%,-50%) scale(${0.18 + t * 4.2})`;
          } else {
            ringsRef.current.style.opacity = '0';
          }
        }

        // Sonic boom flash — sharp spike at break
        if (flashRef.current) {
          const d = Math.abs(p - 0.50);
          flashRef.current.style.opacity = String(Math.max(0, 1 - d / 0.055));
        }

        // Telemetry
        if (pressureRef.current) pressureRef.current.textContent = (14.7 + mach * mach * 2.8).toFixed(1);
        if (tempRef.current) tempRef.current.textContent = (-56 + Math.pow(mach, 2) * 170).toFixed(0);
        if (altRef.current) altRef.current.textContent = (58000 + p * 4200).toFixed(0);
        if (regimeRef.current) {
          regimeRef.current.textContent = mach < 1 ? 'SUBSONIC' : mach < 1.2 ? 'SONIC' : 'SUPERSONIC';
        }
        if (gRef.current) {
          const g = preBreak ? 1 + Math.pow(p / 0.47, 2) * 6.2 : Math.max(1, 7.2 - (p - 0.47) * 12);
          gRef.current.textContent = g.toFixed(1);
        }
      },
    });

    // Turbulence — ticker-driven so tremor persists while scroll is paused.
    // Only run while section is visible — was running forever otherwise.
    const tick = () => {
      const el = shakeRef.current;
      if (!el) return;
      const p = progressRef.current;
      const amp = p < 0.5 ? Math.pow(p / 0.5, 2.4) * 9 : Math.max(0, 1 - (p - 0.5) / 0.08) * 6;
      if (amp < 0.05) {
        el.style.transform = '';
        return;
      }
      const t = performance.now() * 0.013;
      const x = (Math.sin(t * 7.3) + Math.sin(t * 11.7) * 0.7) * amp * 0.5;
      const y = (Math.sin(t * 5.9) + Math.sin(t * 9.4) * 0.7) * amp * 0.5;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };
    let tickerActive = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = entry.isIntersecting;
        if (v && !tickerActive) {
          gsap.ticker.add(tick);
          tickerActive = true;
        } else if (!v && tickerActive) {
          gsap.ticker.remove(tick);
          tickerActive = false;
          if (shakeRef.current) shakeRef.current.style.transform = '';
        }
      },
      { threshold: 0 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    return () => {
      if (tickerActive) gsap.ticker.remove(tick);
      io.disconnect();
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="mach"
      className="relative h-[220vh] w-full overflow-hidden bg-[var(--void)]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Pre-break warning wash — red-orange pressure field */}
        <div
          ref={warnRef}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 60% at 50% 100%, rgba(255,100,50,0.32) 0%, transparent 65%), radial-gradient(ellipse 90% 60% at 50% 0%, rgba(255,90,40,0.22) 0%, transparent 65%)',
            opacity: 0,
            willChange: 'opacity',
          }}
        />

        {/* Post-break calm wash — cold mach cyan */}
        <div
          ref={calmRef}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 110% 80% at 50% 50%, rgba(120,210,255,0.10) 0%, rgba(80,160,220,0.04) 50%, transparent 80%)',
            opacity: 0,
            willChange: 'opacity',
          }}
        />

        {/* Compression rails — horizontal shear lines that intensify before the break */}
        <div
          ref={compressionRef}
          className="pointer-events-none absolute inset-0"
          style={{ opacity: 0, willChange: 'opacity' }}
        >
          {[9, 18, 27, 36, 64, 73, 82, 91].map((top, i) => (
            <div
              key={i}
              className="absolute left-[-5%] right-[-5%]"
              style={{
                top: `${top}%`,
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,150,100,0.5) 18%, rgba(255,210,170,0.95) 50%, rgba(255,150,100,0.5) 82%, transparent 100%)',
                animation: `flicker ${0.9 + (i % 3) * 0.3}s ease-in-out infinite`,
                opacity: 0.4 + (i % 4) * 0.15,
              }}
            />
          ))}
          {/* Vertical strain accents */}
          {[22, 78].map((left, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-[-5%] bottom-[-5%]"
              style={{
                left: `${left}%`,
                width: '1px',
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(255,140,90,0.6) 30%, rgba(255,200,160,0.3) 70%, transparent 100%)',
                animation: `flicker ${1.4 + i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* Post-break condensation vapor drift */}
        <div
          ref={vaporRef}
          className="pointer-events-none absolute inset-0"
          style={{ opacity: 0, willChange: 'transform, opacity' }}
        >
          <div
            className="absolute left-[-25%] right-[-25%] top-[38%] h-[24vh]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(180,225,255,0.28) 20%, rgba(230,245,255,0.55) 50%, rgba(180,225,255,0.28) 80%, transparent 100%)',
              filter: 'blur(24px)',
              mixBlendMode: 'screen',
            }}
          />
          <div
            className="absolute left-[-25%] right-[-25%] top-[52%] h-[14vh]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(200,235,255,0.2) 30%, rgba(240,250,255,0.4) 50%, rgba(200,235,255,0.2) 70%, transparent 100%)',
              filter: 'blur(18px)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* Shockwave rings — expand from center at Mach 1.0 */}
        <div
          ref={ringsRef}
          className="pointer-events-none absolute top-1/2 left-1/2 z-[22]"
          style={{
            width: '55vmin',
            height: '55vmin',
            transform: 'translate(-50%,-50%) scale(0.2)',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          {[1, 0.78, 0.58, 0.4, 0.25].map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                transform: `scale(${s})`,
                border: `1px solid rgba(${i === 0 ? '255,255,255' : '180,220,255'}, ${0.9 - i * 0.12})`,
                boxShadow: `0 0 ${60 * s}px rgba(160,220,255,${0.4 - i * 0.06}), inset 0 0 ${40 * s}px rgba(200,230,255,${0.25 - i * 0.04})`,
              }}
            />
          ))}
        </div>

        {/* Center stage — shake wrapper */}
        <div
          ref={shakeRef}
          className="absolute inset-0 z-[18] flex flex-col items-center justify-center"
          style={{ willChange: 'transform' }}
        >
          <div
            ref={phaseRef}
            className="mono text-[10px] text-[var(--bone)]/65 mb-8"
            style={{ letterSpacing: '0.5em' }}
          >
            TRANSONIC · APPROACH
          </div>

          <div
            className="display text-[var(--bone)] leading-none flex items-baseline"
            style={{
              fontSize: 'clamp(7rem, 24vw, 24rem)',
              letterSpacing: '-0.055em',
              textShadow: '0 8px 80px rgba(0,0,0,0.5)',
            }}
          >
            <span
              className="mono text-[var(--bone)]/45 self-start"
              style={{
                fontSize: '0.16em',
                letterSpacing: '0.35em',
                marginRight: '0.35em',
                marginTop: '0.5em',
              }}
            >
              MACH
            </span>
            <span ref={machRef} className="tabular-nums">0.78</span>
          </div>

          <div
            ref={taglineRef}
            className="display text-[var(--bone)] mt-10"
            style={{
              fontSize: 'clamp(1.25rem, 3.5vw, 3rem)',
              letterSpacing: '0.08em',
              willChange: 'letter-spacing',
            }}
          >
            <span ref={taglineTextRef}>THE WALL</span>
          </div>
        </div>

        {/* Top-left — velocity regime */}
        <div
          className="absolute top-8 left-8 z-30 mono text-[10px] text-[var(--bone)]/70"
          style={{ letterSpacing: '0.32em' }}
        >
          <div className="text-[var(--bone)]/40 mb-1">REGIME</div>
          <div className="text-[var(--mach)] text-[12px]">
            <span ref={regimeRef}>SUBSONIC</span>
          </div>
          <div className="mt-3 h-px w-14 bg-[var(--bone)]/20" />
          <div className="text-[var(--bone)]/40 mt-3 mb-1">ALT · FT</div>
          <div className="tabular-nums text-[var(--bone)]/85 text-[12px]">
            <span ref={altRef}>58000</span>
          </div>
        </div>

        {/* Top-right — dynamic pressure */}
        <div
          className="absolute top-8 right-8 z-30 mono text-[10px] text-[var(--bone)]/70 text-right"
          style={{ letterSpacing: '0.32em' }}
        >
          <div className="text-[var(--bone)]/40 mb-1">Q · PSI</div>
          <div className="tabular-nums text-[var(--afterburn)] text-[12px]">
            <span ref={pressureRef}>14.7</span>
          </div>
          <div className="mt-3 h-px w-14 bg-[var(--bone)]/20 ml-auto" />
          <div className="text-[var(--bone)]/40 mt-3 mb-1">SAT · °C</div>
          <div className="tabular-nums text-[var(--bone)]/85 text-[12px]">
            <span ref={tempRef}>-56</span>
          </div>
        </div>

        {/* Bottom-left — G-load */}
        <div
          className="absolute bottom-8 left-8 z-30 mono text-[10px] text-[var(--bone)]/70"
          style={{ letterSpacing: '0.32em' }}
        >
          <div className="text-[var(--bone)]/40 mb-1">LOAD · G</div>
          <div className="tabular-nums text-[var(--bone)]/90 text-[12px]">
            <span ref={gRef}>1.0</span>
          </div>
        </div>

        {/* Bottom-right — signature */}
        <div
          className="absolute bottom-8 right-8 z-30 mono text-[10px] text-[var(--bone)]/55 text-right"
          style={{ letterSpacing: '0.42em' }}
        >
          <div className="flex items-center gap-2 justify-end">
            <span className="inline-block h-[6px] w-[6px] bg-[var(--afterburn)]" />
            MACH · 1.00
          </div>
          <div className="text-[var(--bone)]/35 mt-1">1,225 KM/H · SEA LEVEL</div>
        </div>

        {/* Sonic boom flash — pure white spike at the break */}
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 z-[60] bg-white"
          style={{ opacity: 0, mixBlendMode: 'screen', willChange: 'opacity' }}
        />
      </div>
    </section>
  );
}
