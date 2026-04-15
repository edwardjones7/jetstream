'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Blackbird from './Blackbird';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const STARS = Array.from({ length: 180 }, (_, i) => ({
  top: (i * 37.113) % 100,
  left: (i * 53.71) % 100,
  size: (i % 4 === 0 ? 2 : 1) + (i % 7 === 0 ? 1 : 0),
  opacity: 0.35 + ((i * 17) % 65) / 100,
  delay: (i * 0.19) % 4,
  dur: 2.5 + (i % 5) * 0.6,
}));

const PITCH_LINES = [-30, -20, -10, 0, 10, 20, 30];
const CORNER_BRACKETS = [
  { top: 24, left: 24, rot: 0 },
  { top: 24, right: 24, rot: 90 },
  { bottom: 24, right: 24, rot: 180 },
  { bottom: 24, left: 24, rot: 270 },
];

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const jet = useRef<SVGSVGElement>(null);
  const jetWrap = useRef<HTMLDivElement>(null);
  const streak = useRef<HTMLDivElement>(null);
  const stars = useRef<HTMLDivElement>(null);
  const beat1 = useRef<HTMLDivElement>(null);
  const beat2 = useRef<HTMLDivElement>(null);
  const beat3 = useRef<HTMLDivElement>(null);
  const beat4 = useRef<HTMLDivElement>(null);
  const beat5 = useRef<HTMLDivElement>(null);
  const scrollHint = useRef<HTMLDivElement>(null);
  const horizon = useRef<HTMLDivElement>(null);
  const clouds = useRef<HTMLDivElement>(null);
  const nebula = useRef<HTMLDivElement>(null);
  const reticle = useRef<HTMLDivElement>(null);
  const flare = useRef<HTMLDivElement>(null);
  const parallaxStars = useRef<HTMLDivElement>(null);
  const parallaxNebula = useRef<HTMLDivElement>(null);
  const contrailL = useRef<HTMLDivElement>(null);
  const contrailR = useRef<HTMLDivElement>(null);

  const [alt, setAlt] = useState(0);
  const [mach, setMach] = useState(0);
  const [hdg, setHdg] = useState(0);
  const [pitch, setPitch] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const beats = [beat2.current, beat3.current, beat4.current, beat5.current];

      gsap.set(jetWrap.current, { scale: 0.52, x: 0, y: 0, rotate: 0 });
      gsap.set(jet.current, { opacity: 0.95 });
      gsap.set(beat1.current, { opacity: 1, y: 0 });
      gsap.set(beats, { opacity: 0, y: 28 });
      gsap.set(streak.current, { opacity: 0, scaleX: 0 });
      gsap.set(stars.current, { opacity: 0.35 });
      gsap.set(horizon.current, { opacity: 0.9 });
      gsap.set(clouds.current, { opacity: 0.6 });
      gsap.set(nebula.current, { opacity: 0.25 });
      gsap.set(flare.current, { opacity: 0.5 });

      gsap.from(jetWrap.current, { scale: 0.28, y: 50, duration: 1.5, delay: 0.2, ease: 'power2.out' });
      gsap.from(jet.current, { opacity: 0, duration: 1.5, delay: 0.2, ease: 'power2.out' });
      gsap.from(beat1.current, { opacity: 0, y: 22, duration: 1.1, delay: 0.45, ease: 'power2.out' });
      gsap.from(scrollHint.current, { opacity: 0, duration: 1.2, delay: 1.1 });
      gsap.from([horizon.current, clouds.current], { opacity: 0, duration: 1.8, delay: 0.1, ease: 'power2.out' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            const climb = gsap.utils.clamp(0, 1, (p - 0.18) / 0.38);
            setAlt(Math.floor(climb * 85000));
            setMach(climb * 3.3);
            setHdg(Math.floor(27 + p * 312) % 360);
            setPitch(Math.floor(climb * 24 - p * 6));
            if (scrollHint.current) {
              scrollHint.current.style.opacity = String(Math.max(0, 1 - p * 6));
            }
          },
        },
      });

      tl.to(beat1.current, { opacity: 0, y: -22, duration: 0.4 });
      tl.to(jetWrap.current, { scale: 0.72, rotate: -3, duration: 1, ease: 'power1.inOut' }, '<');
      tl.to(horizon.current, { opacity: 0.5, duration: 1 }, '<');
      tl.to(clouds.current, { opacity: 0.3, y: 40, duration: 1 }, '<');
      tl.to(beat2.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');

      tl.to(beat2.current, { opacity: 0, y: -22, duration: 0.4 }, '+=0.35');
      tl.to(stars.current, { opacity: 0.95, duration: 1 }, '<');
      tl.to(horizon.current, { opacity: 0.15, duration: 1 }, '<');
      tl.to(clouds.current, { opacity: 0, y: 120, duration: 1 }, '<');
      tl.to(nebula.current, { opacity: 0.8, duration: 1 }, '<');
      tl.to(jetWrap.current, { scale: 0.9, rotate: -11, y: -60, duration: 1, ease: 'power1.inOut' }, '<');
      tl.to(beat3.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');

      tl.to(beat3.current, { opacity: 0, y: -22, duration: 0.4 }, '+=0.35');
      tl.to(streak.current, { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power2.out' }, '<');
      tl.to(flare.current, { opacity: 1, duration: 0.6 }, '<');
      tl.to(jetWrap.current, { scale: 1.08, rotate: -20, x: 200, y: -30, duration: 1, ease: 'power2.inOut' }, '<');
      tl.to(beat4.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');

      tl.to(beat4.current, { opacity: 0, y: -22, duration: 0.45 }, '+=0.4');
      tl.to(streak.current, { opacity: 0, duration: 0.5 }, '<');
      tl.to(jetWrap.current, { scale: 0.7, rotate: -10, x: 320, y: -140, duration: 1, ease: 'power1.out' }, '<');
      tl.to(jet.current, { opacity: 0.12, duration: 1, ease: 'power1.out' }, '<');
      tl.to(stars.current, { opacity: 0.2, duration: 1 }, '<');
      tl.to(beat5.current, { opacity: 1, y: 0, duration: 0.45 }, '-=0.25');

      ScrollTrigger.refresh();
    }, root);

    let rx = 0, ry = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      rx = (e.clientX / window.innerWidth - 0.5) * 2;
      ry = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    let raf = 0;
    const tick = () => {
      tx += (rx - tx) * 0.05;
      ty += (ry - ty) * 0.05;
      if (parallaxStars.current) {
        parallaxStars.current.style.transform = `translate3d(${tx * -18}px, ${ty * -12}px, 0)`;
      }
      if (parallaxNebula.current) {
        parallaxNebula.current.style.transform = `translate3d(${tx * -36}px, ${ty * -22}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={root} className="relative h-[620vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--void)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(94,200,255,0.12) 0%, rgba(5,6,8,0) 55%), radial-gradient(ellipse at 50% 105%, rgba(255,91,20,0.18) 0%, rgba(5,6,8,0) 55%), linear-gradient(180deg, #0a1424 0%, #050608 55%, #060a14 100%)',
          }}
        />

        <div ref={nebula} className="pointer-events-none absolute inset-0">
          <div
            ref={parallaxNebula}
            className="absolute inset-0 will-change-transform"
            style={{
              background:
                'radial-gradient(ellipse at 18% 28%, rgba(140,90,255,0.18) 0%, transparent 42%), radial-gradient(ellipse at 82% 22%, rgba(94,200,255,0.14) 0%, transparent 40%), radial-gradient(ellipse at 70% 78%, rgba(255,91,120,0.09) 0%, transparent 45%)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        <div
          ref={horizon}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55vh]"
          style={{
            background:
              'radial-gradient(ellipse 140% 100% at 50% 100%, rgba(94,200,255,0.35) 0%, rgba(94,200,255,0.12) 30%, rgba(255,91,20,0.08) 55%, rgba(5,6,8,0) 80%)',
          }}
        >
          <div
            className="absolute left-1/2 bottom-[22vh] -translate-x-1/2 h-px w-[180vw]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(94,200,255,0.55) 20%, rgba(230,245,255,0.85) 50%, rgba(94,200,255,0.55) 80%, transparent 100%)',
              boxShadow: '0 0 24px rgba(94,200,255,0.45)',
              animation: 'horizon-breathe 5s ease-in-out infinite',
            }}
          />
          <div
            className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[220vw] h-[40vh] rounded-[50%]"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgba(10,40,80,0.9) 0%, rgba(5,10,20,0.8) 40%, rgba(5,6,8,0) 75%)',
              border: '1px solid rgba(94,200,255,0.12)',
            }}
          />
        </div>

        <div ref={clouds} className="pointer-events-none absolute inset-x-0 bottom-[10vh] h-[35vh]">
          {[12, 34, 58, 78, 22, 66].map((l, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${l}%`,
                bottom: `${(i * 7) % 28}%`,
                width: `${140 + (i % 3) * 60}px`,
                height: `${30 + (i % 2) * 18}px`,
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(230,240,255,0.22) 0%, rgba(180,210,255,0.08) 50%, transparent 80%)',
                filter: 'blur(12px)',
              }}
            />
          ))}
        </div>

        <div ref={stars} className="absolute inset-0" style={{ opacity: 0 }}>
          <div ref={parallaxStars} className="absolute inset-0 will-change-transform">
            {STARS.map((s, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  width: s.size,
                  height: s.size,
                  opacity: s.opacity,
                  animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <div
          ref={streak}
          className="pointer-events-none absolute top-1/2 left-[-10%] right-[-10%] h-[2px] origin-left"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,91,20,0.6) 40%, rgba(255,200,120,0.95) 55%, rgba(255,91,20,0.6) 70%, transparent 100%)',
            boxShadow: '0 0 28px rgba(255,91,20,0.55), 0 0 60px rgba(255,91,20,0.35)',
            opacity: 0,
            transform: 'scaleX(0)',
          }}
        />

        <div
          ref={flare}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '70vh',
            height: '70vh',
            background:
              'radial-gradient(circle at 50% 50%, rgba(255,200,120,0.18) 0%, rgba(255,120,40,0.08) 30%, transparent 65%)',
            filter: 'blur(6px)',
            mixBlendMode: 'screen',
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={jetWrap} className="relative">
            <div
              ref={contrailL}
              className="pointer-events-none absolute"
              style={{
                left: '32%',
                top: '94%',
                width: '10px',
                height: `${40 + mach * 90}vh`,
                transform: 'translateX(-50%)',
                transformOrigin: 'top center',
                background:
                  'linear-gradient(180deg, rgba(255,220,160,0.85) 0%, rgba(255,160,90,0.55) 8%, rgba(230,240,255,0.4) 30%, rgba(180,210,255,0.15) 70%, transparent 100%)',
                filter: 'blur(4px)',
                opacity: Math.min(1, mach * 0.6 + 0.25),
                transition: 'opacity 0.4s, height 0.4s',
              }}
            />
            <div
              ref={contrailR}
              className="pointer-events-none absolute"
              style={{
                left: '68%',
                top: '94%',
                width: '10px',
                height: `${40 + mach * 90}vh`,
                transform: 'translateX(-50%)',
                transformOrigin: 'top center',
                background:
                  'linear-gradient(180deg, rgba(255,220,160,0.85) 0%, rgba(255,160,90,0.55) 8%, rgba(230,240,255,0.4) 30%, rgba(180,210,255,0.15) 70%, transparent 100%)',
                filter: 'blur(4px)',
                opacity: Math.min(1, mach * 0.6 + 0.25),
                transition: 'opacity 0.4s, height 0.4s',
              }}
            />
            <Blackbird
              ref={jet}
              className="relative h-[min(82vh,680px)] w-auto drop-shadow-[0_40px_70px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>

        <div
          ref={reticle}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 520, height: 520 }}
        >
          <svg viewBox="0 0 520 520" className="h-full w-full" style={{ opacity: 0.25 }}>
            <circle cx="260" cy="260" r="180" fill="none" stroke="rgba(94,200,255,0.35)" strokeWidth="0.6" strokeDasharray="2 6" />
            <circle cx="260" cy="260" r="250" fill="none" stroke="rgba(94,200,255,0.2)" strokeWidth="0.6" />
            <line x1="60" y1="260" x2="200" y2="260" stroke="rgba(94,200,255,0.45)" strokeWidth="0.8" />
            <line x1="320" y1="260" x2="460" y2="260" stroke="rgba(94,200,255,0.45)" strokeWidth="0.8" />
            <line x1="260" y1="60" x2="260" y2="180" stroke="rgba(94,200,255,0.35)" strokeWidth="0.8" />
            <line x1="260" y1="340" x2="260" y2="460" stroke="rgba(94,200,255,0.35)" strokeWidth="0.8" />
            {PITCH_LINES.map((p) => {
              const y = 260 + p * 4.5;
              const w = p === 0 ? 140 : p % 20 === 0 ? 70 : 40;
              return (
                <g key={p}>
                  <line x1={260 - w} y1={y} x2={260 - 20} y2={y} stroke="rgba(230,245,255,0.35)" strokeWidth="0.6" />
                  <line x1={260 + 20} y1={y} x2={260 + w} y2={y} stroke="rgba(230,245,255,0.35)" strokeWidth="0.6" />
                  {p !== 0 && (
                    <text x={260 - w - 10} y={y + 2} fontSize="7" fill="rgba(230,245,255,0.45)" fontFamily="monospace">
                      {Math.abs(p)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0.08 }}>
          <defs>
            <pattern id="hud-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(94,200,255,0.5)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hud-grid)" />
        </svg>

        {CORNER_BRACKETS.map((b, i) => (
          <svg
            key={i}
            className="pointer-events-none absolute"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            style={{ ...b, transform: `rotate(${b.rot}deg)`, opacity: 0.5 }}
          >
            <path d="M 2 14 L 2 2 L 14 2" fill="none" stroke="rgba(94,200,255,0.7)" strokeWidth="1" />
          </svg>
        ))}

        <div className="pointer-events-none absolute inset-0 p-6 sm:p-10">
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 mono text-[10px] text-white/65 flex items-center gap-3">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[var(--afterburn)]"
              style={{ animation: 'hud-pulse 1.6s ease-in-out infinite' }}
            />
            SR-71A · BLACKBIRD
          </div>
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 mono text-[10px] text-white/45 text-right">
            LOCKHEED · SKUNK WORKS
          </div>
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 mono text-[10px]">
            <div className="text-white/40 mb-1">ALT / FT</div>
            <div className="tabular-nums text-[var(--mach)] text-base tracking-[0.2em]">
              {alt.toLocaleString('en-US').padStart(6, '0')}
            </div>
          </div>
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 mono text-[10px] text-right">
            <div className="text-white/40 mb-1">MACH</div>
            <div className="tabular-nums text-[var(--mach)] text-base tracking-[0.2em]">
              {mach.toFixed(2)}
            </div>
          </div>

          <div className="absolute top-1/2 left-6 sm:left-10 -translate-y-1/2 mono text-[9px] text-white/45 space-y-3">
            <div>
              <div className="text-white/30">HDG</div>
              <div className="tabular-nums text-[var(--mach)] text-sm tracking-[0.18em]">
                {hdg.toString().padStart(3, '0')}°
              </div>
            </div>
            <div>
              <div className="text-white/30">PITCH</div>
              <div className="tabular-nums text-[var(--mach)] text-sm tracking-[0.18em]">
                {pitch >= 0 ? '+' : ''}
                {pitch}°
              </div>
            </div>
            <div>
              <div className="text-white/30">STATUS</div>
              <div className="text-[var(--afterburn)] text-sm tracking-[0.18em]" style={{ animation: 'hud-pulse 1.6s ease-in-out infinite' }}>
                LIVE
              </div>
            </div>
          </div>

          <div className="absolute top-1/2 right-6 sm:right-10 -translate-y-1/2 mono text-[9px] text-white/45 text-right space-y-3">
            <div>
              <div className="text-white/30">FUEL</div>
              <div className="tabular-nums text-[var(--mach)] text-sm tracking-[0.18em]">
                {Math.max(0, 100 - Math.floor(mach * 22))}%
              </div>
            </div>
            <div>
              <div className="text-white/30">G-FORCE</div>
              <div className="tabular-nums text-[var(--mach)] text-sm tracking-[0.18em]">
                {(1 + mach * 0.4).toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-white/30">SYS</div>
              <div className="text-[var(--mach)] text-sm tracking-[0.18em]">NOMINAL</div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 3px)',
            mixBlendMode: 'overlay',
          }}
        />

        <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0.18, mixBlendMode: 'overlay' }}>
          <filter id="film-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.5 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#film-noise)" />
        </svg>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 160px 40px rgba(0,0,0,0.8)',
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-[12vh] px-6">
          <div className="relative mx-auto max-w-4xl text-center h-[40vh]">
            <div ref={beat1} className="absolute inset-x-0 top-0">
              <div className="mono text-[10px] text-[var(--afterburn)] mb-4 tracking-[0.32em]">
                1964 · SKUNK WORKS
              </div>
              <h1 className="display text-white text-[clamp(2.75rem,7.2vw,6.5rem)]">
                A BLACK PROJECT
              </h1>
              <p className="mono text-[11px] text-white/55 mt-5 tracking-[0.22em]">
                BUILT IN SECRECY · GROOM LAKE
              </p>
            </div>

            <div ref={beat2} className="absolute inset-x-0 top-0" style={{ opacity: 0 }}>
              <div className="mono text-[10px] text-[var(--afterburn)] mb-4 tracking-[0.32em]">
                AIRFRAME
              </div>
              <h1 className="display text-white text-[clamp(2.75rem,7.2vw,6.5rem)]">
                92% TITANIUM
              </h1>
              <p className="mono text-[11px] text-white/55 mt-5 tracking-[0.22em]">
                SOURCED COVERTLY · FROM THE USSR
              </p>
            </div>

            <div ref={beat3} className="absolute inset-x-0 top-0" style={{ opacity: 0 }}>
              <div className="mono text-[10px] text-[var(--afterburn)] mb-4 tracking-[0.32em]">
                CEILING · VELOCITY
              </div>
              <h1 className="display text-white text-[clamp(2.75rem,7.2vw,6.5rem)]">
                EDGE OF SPACE
              </h1>
              <p className="mono text-[11px] text-white/55 mt-5 tracking-[0.22em]">
                85,000 FT · MACH 3.3
              </p>
            </div>

            <div ref={beat4} className="absolute inset-x-0 top-0" style={{ opacity: 0 }}>
              <div className="mono text-[10px] text-[var(--afterburn)] mb-4 tracking-[0.32em]">
                DOCTRINE
              </div>
              <h1 className="display text-white text-[clamp(2.75rem,7.2vw,6.5rem)]">
                OUTRUN THE MISSILE
              </h1>
              <p className="mono text-[11px] text-white/55 mt-5 tracking-[0.22em]">
                NONE EVER LOST TO ENEMY FIRE
              </p>
            </div>

            <div ref={beat5} className="absolute inset-x-0 top-0" style={{ opacity: 0 }}>
              <div className="mono text-[10px] text-white/40 mb-4 tracking-[0.32em]">
                1966 — 1999
              </div>
              <h1 className="display text-white text-[clamp(2.75rem,7.2vw,6.5rem)]">
                HER RECORD STANDS
              </h1>
              <p className="mono text-[11px] text-white/55 mt-5 tracking-[0.22em]">
                3,551 FLIGHTS · NEVER SURPASSED
              </p>
            </div>
          </div>
        </div>

        <div
          ref={scrollHint}
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 mono text-[9px] text-white/35 tracking-[0.35em] flex flex-col items-center gap-2"
        >
          <span>SCROLL</span>
          <span
            className="h-6 w-px bg-white/30"
            style={{ animation: 'hud-pulse 1.8s ease-in-out infinite' }}
          />
        </div>
      </div>
    </section>
  );
}
