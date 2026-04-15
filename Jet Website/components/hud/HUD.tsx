'use client';

import { useEffect, useRef, useState } from 'react';
import { subscribeScrollProgress } from '@/lib/scrollProgress';

export default function HUD() {
  const [mounted, setMounted] = useState(false);
  const statusDotRef = useRef<HTMLSpanElement>(null);
  const statusLabelRef = useRef<HTMLSpanElement>(null);
  const altStrRef = useRef<HTMLSpanElement>(null);
  const machRef = useRef<HTMLSpanElement>(null);
  const progressNumRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    let lastArmed: boolean | null = null;
    const unsub = subscribeScrollProgress((p) => {
      const armed = p > 0.06;
      if (armed !== lastArmed) {
        lastArmed = armed;
        if (statusDotRef.current) {
          statusDotRef.current.style.background = armed ? 'var(--afterburn)' : '#fbbf24';
          statusDotRef.current.style.boxShadow = armed
            ? '0 0 12px var(--afterburn)'
            : '0 0 8px #fbbf24';
        }
        if (statusLabelRef.current) {
          statusLabelRef.current.style.color = armed ? 'var(--afterburn)' : '#fbbf24';
          statusLabelRef.current.textContent = `STATUS · ${armed ? 'ARMED' : 'STANDBY'}`;
        }
      }
      if (altStrRef.current) {
        altStrRef.current.textContent = Math.floor(p * 62000).toString().padStart(6, '0');
      }
      if (machRef.current) {
        machRef.current.textContent = (p * 3.2).toFixed(2);
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${p * 100}%`;
      }
      if (progressNumRef.current) {
        progressNumRef.current.textContent = Math.floor(p * 100).toString().padStart(2, '0');
      }
    });
    return unsub;
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Viewport hairline frame */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
        <div className="absolute inset-[14px] border border-white/[0.06]" />
        <div className="absolute left-[14px] top-[14px] h-3 w-3 border-l border-t border-[var(--bone)]/40" />
        <div className="absolute right-[14px] top-[14px] h-3 w-3 border-r border-t border-[var(--bone)]/40" />
        <div className="absolute left-[14px] bottom-[14px] h-3 w-3 border-l border-b border-[var(--bone)]/40" />
        <div className="absolute right-[14px] bottom-[14px] h-3 w-3 border-r border-b border-[var(--bone)]/40" />
      </div>

      {/* Status: top-left */}
      <div className="pointer-events-none fixed top-7 left-7 z-50 flex items-center gap-2 mono text-[10px]">
        <span
          ref={statusDotRef}
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: '#fbbf24',
            animation: 'hud-pulse 1.4s ease-in-out infinite',
            boxShadow: '0 0 8px #fbbf24',
          }}
        />
        <span ref={statusLabelRef} style={{ color: '#fbbf24' }}>
          STATUS · STANDBY
        </span>
      </div>

      {/* Altimeter: top-right */}
      <div className="pointer-events-none fixed top-7 right-7 z-50 mono text-[10px] text-right">
        <div className="tabular-nums text-[var(--bone)]/70">
          ALT <span ref={altStrRef} className="text-[var(--bone)]">000000</span> FT
        </div>
        <div className="tabular-nums text-[var(--mach)]/70 mt-1">
          MACH <span ref={machRef} className="text-[var(--mach)]">0.00</span>
        </div>
      </div>

      {/* Wordmark: bottom-left */}
      <div className="pointer-events-none fixed bottom-7 left-7 z-50 mono text-[10px] text-[var(--bone)]/60">
        OWN·THE·SKY / V1.0
      </div>

      {/* Progress bar: bottom-right */}
      <div className="pointer-events-none fixed bottom-7 right-7 z-50 flex items-center gap-3 mono text-[9px] text-[var(--bone)]/50 w-[220px]">
        <span ref={progressNumRef} className="tabular-nums">00</span>
        <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
          <div
            ref={progressBarRef}
            className="absolute inset-y-0 left-0"
            style={{
              width: '0%',
              background: 'linear-gradient(90deg, var(--afterburn), var(--mach))',
            }}
          />
        </div>
        <span>100</span>
      </div>
    </>
  );
}
