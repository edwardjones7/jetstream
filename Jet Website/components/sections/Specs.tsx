'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const SPECS: { k: string; v: string; unit?: string }[] = [
  { k: 'TOP SPEED', v: '2,193.2', unit: 'MPH' },
  { k: 'CRUISE', v: 'MACH 3.2', unit: '' },
  { k: 'SERVICE CEILING', v: '85,069', unit: 'FT' },
  { k: 'RANGE', v: '2,900', unit: 'NM' },
  { k: 'LENGTH', v: '107', unit: 'FT 5 IN' },
  { k: 'WINGSPAN', v: '55', unit: 'FT 7 IN' },
  { k: 'EMPTY WEIGHT', v: '67,500', unit: 'LB' },
  { k: 'CREW', v: '02', unit: 'PILOT · RSO' },
  { k: 'FIRST FLIGHT', v: '1964.12.22', unit: '' },
  { k: 'RETIRED', v: '1999', unit: '' },
];

export default function Specs() {
  const root = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const heading = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heading.current, {
        scrollTrigger: {
          trigger: heading.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 0.6,
        },
        opacity: 0,
        y: 40,
      });

      rows.current.forEach((row, i) => {
        if (!row) return;
        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
            end: 'top 55%',
            scrub: 0.6,
          },
          opacity: 0,
          x: i % 2 === 0 ? -60 : 60,
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-[var(--void)] py-[22vh]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(94,200,255,0.08) 0%, transparent 60%), linear-gradient(180deg, #060a14 0%, #050608 100%)',
        }}
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ opacity: 0.05 }}>
        <defs>
          <pattern id="specs-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(94,200,255,0.5)" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#specs-grid)" />
      </svg>

      <div ref={heading} className="relative mx-auto max-w-5xl px-6 text-center mb-16">
        <div className="mono text-[10px] text-[var(--afterburn)] tracking-[0.38em] mb-4">
          · TECHNICAL READOUT ·
        </div>
        <h2 className="display text-white text-[clamp(2.5rem,6vw,5.5rem)]">
          SPECIFICATIONS
        </h2>
        <div className="mx-auto mt-6 h-px w-24 bg-[var(--mach)]/50" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 space-y-0">
        {SPECS.map((s, i) => (
          <div
            key={s.k}
            ref={(el) => {
              rows.current[i] = el;
            }}
            className="flex items-baseline justify-between gap-6 border-b border-white/5 py-5"
          >
            <div className="mono text-[10px] text-white/45 tracking-[0.25em]">
              {String(i + 1).padStart(2, '0')} · {s.k}
            </div>
            <div className="flex items-baseline gap-3">
              <div className="display tabular-nums text-[var(--mach)] text-[clamp(1.5rem,3vw,2.5rem)]">
                {s.v}
              </div>
              {s.unit && (
                <div className="mono text-[10px] text-white/40 tracking-[0.2em]">
                  {s.unit}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
