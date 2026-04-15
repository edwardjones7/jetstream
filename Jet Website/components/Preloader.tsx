'use client';

import { useEffect, useState } from 'react';

const LINES = [
  { t: 'BOOTING AVIONICS...', d: 420 },
  { t: 'FUEL 100%   HYDRAULICS NOMINAL   IFF ACTIVE', d: 420 },
  { t: 'NAV UPLINK · SATCOM HANDSHAKE OK', d: 380 },
  { t: 'ENGINE TEMP 612°C · THRUST VECTOR ARMED', d: 380 },
  { t: 'CLEARED FOR SCROLL.', d: 560 },
];

export default function Preloader() {
  const [lineIdx, setLineIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let totalDelay = 0;
    const timers: number[] = [];
    LINES.forEach((l, i) => {
      totalDelay += l.d;
      timers.push(
        window.setTimeout(() => {
          setLineIdx(i + 1);
        }, totalDelay)
      );
    });
    timers.push(
      window.setTimeout(() => setExiting(true), totalDelay + 300)
    );
    timers.push(
      window.setTimeout(() => {
        setDone(true);
        document.body.style.overflow = '';
      }, totalDelay + 900)
    );
    document.body.style.overflow = 'hidden';

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / totalDelay);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, []);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-700"
      style={{ opacity: exiting ? 0 : 1, pointerEvents: exiting ? 'none' : 'auto' }}
    >
      {/* Scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)',
        }}
      />
      {/* CRT glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      <div className="relative z-10 w-[min(640px,90vw)] text-[var(--bone)]">
        <div className="mono text-[10px] text-[var(--afterburn)] mb-6 flex items-center gap-3">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--afterburn)]"
            style={{ animation: 'hud-pulse 0.9s ease-in-out infinite' }}
          />
          PRE-FLIGHT SEQUENCE // OWN-THE-SKY / V1.0
        </div>
        <div className="mono text-[11px] leading-relaxed space-y-1 min-h-[140px]">
          {LINES.slice(0, lineIdx).map((l, i) => (
            <div key={i} className="text-[var(--bone)]/80 flex gap-3">
              <span className="text-[var(--mach)]">[OK]</span>
              <span>{l.t}</span>
            </div>
          ))}
          {mounted && lineIdx < LINES.length && (
            <div className="text-[var(--bone)]/60 flex gap-3">
              <span className="text-amber-400">[...]</span>
              <span suppressHydrationWarning>
                {LINES[lineIdx].t.slice(0, Math.floor(((Date.now() % 400) / 400) * LINES[lineIdx].t.length))}
                <span
                  className="inline-block h-3 w-[2px] bg-[var(--afterburn)] ml-1 align-middle"
                  style={{ animation: 'hud-pulse 0.7s steps(2) infinite' }}
                />
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 mono text-[9px] text-[var(--bone)]/50 flex justify-between mb-2">
          <span>BOOT PROGRESS</span>
          <span className="tabular-nums">{Math.floor(progress * 100).toString().padStart(3, '0')}%</span>
        </div>
        <div className="h-px bg-white/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-100"
            style={{
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, var(--afterburn), var(--mach))',
            }}
          />
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 mono text-[9px] text-[var(--bone)]/40">
          <div>
            <div className="text-[var(--bone)]/70">T+00:00:02</div>
            <div className="mt-1">LOCAL TIME</div>
          </div>
          <div>
            <div className="text-[var(--bone)]/70">34.7°N / 118.2°W</div>
            <div className="mt-1">DEPARTURE</div>
          </div>
          <div>
            <div className="text-[var(--bone)]/70">CLEAR / 0KT</div>
            <div className="mt-1">WEATHER</div>
          </div>
        </div>
      </div>

      {/* Bottom brand */}
      <div className="absolute bottom-10 left-0 right-0 text-center mono text-[9px] text-[var(--bone)]/30">
        A CINEMATIC FLIGHT — PRESS ANY KEY TO CONTINUE
      </div>
    </div>
  );
}
