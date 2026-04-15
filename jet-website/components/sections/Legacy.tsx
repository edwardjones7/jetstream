'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const RECORDS: { y: string; t: string }[] = [
  { y: '1976', t: 'ABSOLUTE SPEED RECORD · 2,193.2 MPH' },
  { y: '1976', t: 'ABSOLUTE ALTITUDE RECORD · 85,069 FT' },
  { y: '1974', t: 'NEW YORK → LONDON · 1H 54M' },
  { y: '1990', t: 'COAST TO COAST · 67M 54S' },
];

export default function Legacy() {
  const root = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const subtitle = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const cta = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(title.current, {
        scrollTrigger: {
          trigger: title.current,
          start: 'top 80%',
          end: 'top 45%',
          scrub: 0.6,
        },
        opacity: 0,
        y: 50,
      });
      gsap.from(subtitle.current, {
        scrollTrigger: {
          trigger: subtitle.current,
          start: 'top 85%',
          end: 'top 55%',
          scrub: 0.6,
        },
        opacity: 0,
      });
      cards.current.forEach((c, i) => {
        if (!c) return;
        gsap.from(c, {
          scrollTrigger: {
            trigger: c,
            start: 'top 90%',
            end: 'top 55%',
            scrub: 0.6,
          },
          opacity: 0,
          y: 40,
          delay: i * 0.05,
        });
      });
      gsap.from(cta.current, {
        scrollTrigger: {
          trigger: cta.current,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 0.6,
        },
        opacity: 0,
        y: 30,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative bg-[var(--void)] py-[25vh] overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 10%, rgba(94,200,255,0.08) 0%, transparent 55%), radial-gradient(ellipse at 50% 110%, rgba(255,91,20,0.12) 0%, transparent 55%), #050608',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div ref={title} className="text-center mb-6">
          <div className="mono text-[10px] text-[var(--afterburn)] tracking-[0.4em] mb-4">
            · THE LEGACY ·
          </div>
          <h2 className="display text-white text-[clamp(3rem,8vw,7rem)] leading-[0.9]">
            RECORD
            <br />
            <span className="text-[var(--mach)]">UNBROKEN</span>
          </h2>
        </div>

        <div
          ref={subtitle}
          className="mono text-[11px] text-white/50 tracking-[0.28em] text-center mb-20 max-w-2xl mx-auto leading-[1.8]"
        >
          RETIRED 1999 · 3,551 FLIGHTS · 53,490 HOURS
          <br />
          NONE LOST TO ENEMY FIRE · NONE SURPASSED
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          {RECORDS.map((r, i) => (
            <div
              key={r.t}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className="relative border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm hover:border-[var(--mach)]/40 transition-colors duration-500 group"
            >
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[var(--mach)]/50" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[var(--mach)]/50" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[var(--mach)]/50" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[var(--mach)]/50" />

              <div className="mono text-[10px] text-[var(--afterburn)] tracking-[0.3em] mb-3">
                {r.y}
              </div>
              <div className="mono text-sm text-white/85 tracking-[0.18em] leading-[1.6]">
                {r.t}
              </div>
            </div>
          ))}
        </div>

        <div ref={cta} className="text-center">
          <div className="mono text-[10px] text-white/40 tracking-[0.4em] mb-6">
            MACH 3.3 · CLASSIFIED · 1964 — 1999
          </div>
          <div className="display text-white/90 text-[clamp(1.25rem,2.4vw,2rem)] leading-[1.1]">
            NOTHING HAS FLOWN FASTER SINCE.
          </div>
          <div className="mt-12 flex justify-center items-center gap-3 mono text-[9px] text-white/30 tracking-[0.4em]">
            <span className="h-px w-12 bg-white/20" />
            END OF TRANSMISSION
            <span className="h-px w-12 bg-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
