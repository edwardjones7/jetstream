'use client';

import { useEffect, useRef, useState } from 'react';
import { subscribeScrollProgress } from '@/lib/scrollProgress';

const ITEMS: { k: string; color: string }[] = [
  { k: 'SPD', color: 'var(--mach)' },
  { k: 'ALT', color: 'var(--bone)' },
  { k: 'HDG', color: 'var(--bone)' },
  { k: 'PTC', color: 'var(--bone)' },
  { k: 'ROL', color: 'var(--bone)' },
  { k: 'G', color: 'var(--afterburn)' },
  { k: 'EGT', color: 'var(--afterburn)' },
  { k: 'FUEL', color: 'var(--bone)' },
];

const j = (amp: number) => (Math.random() - 0.5) * amp;

export default function TelemetryTicker() {
  const [mounted, setMounted] = useState(false);
  const asideRef = useRef<HTMLElement>(null);
  const refs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    setMounted(true);
    const unsub = subscribeScrollProgress((p) => {
      if (asideRef.current) {
        asideRef.current.style.opacity = String(Math.max(0, Math.min(1, (p - 0.05) * 10)));
      }
      const alt = Math.floor(p * 62000);
      const speed = Math.floor(p * 2200 + j(10));
      const temp = Math.floor(612 - p * 480 + j(3));
      const fuel = Math.max(12, Math.floor(100 - p * 72));
      const set = (k: string, v: string, color?: string) => {
        const el = refs.current[k];
        if (!el) return;
        el.textContent = v;
        if (color) el.style.color = color;
      };
      set('SPD', `${speed} KN`);
      set('ALT', `${alt.toLocaleString()} FT`);
      set('HDG', `${((p * 240 + 42 + j(1)) % 360).toFixed(1)}°`);
      set('PTC', `${(p * 18 - 2 + j(0.2)).toFixed(1)}°`);
      set('ROL', `${j(1.5).toFixed(1)}°`);
      set('G', `${(1 + p * 7 + j(0.1)).toFixed(2)}`);
      set('EGT', `${temp}°C`);
      set('FUEL', `${fuel}%`, fuel < 25 ? 'var(--afterburn)' : 'var(--bone)');
    });
    return unsub;
  }, []);

  if (!mounted) return null;

  return (
    <aside
      ref={asideRef}
      className="pointer-events-none fixed left-7 top-1/2 -translate-y-1/2 z-40 w-[180px] space-y-2 transition-opacity duration-500"
      style={{ opacity: 0 }}
    >
      <div className="mono text-[9px] text-[var(--bone)]/40 flex items-center gap-2 mb-3">
        <span
          className="h-1 w-1 rounded-full bg-[var(--mach)]"
          style={{ animation: 'hud-pulse 1s ease-in-out infinite' }}
        />
        LIVE TELEMETRY
      </div>
      {ITEMS.map((it) => (
        <div
          key={it.k}
          className="flex items-baseline justify-between mono text-[10px] border-l-2 pl-3 py-1"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <span className="text-[var(--bone)]/40 text-[9px]">{it.k}</span>
          <span
            ref={(el) => {
              refs.current[it.k] = el;
            }}
            className="tabular-nums"
            style={{ color: it.color }}
          >
            —
          </span>
        </div>
      ))}
      <div className="pt-3 mono text-[8px] text-[var(--bone)]/30 leading-relaxed">
        TX 1120.34MHZ · SQK 2357<br />
        IFF MODE-4 ACTIVE<br />
        NAV: WAYPT 07 / 12
      </div>
    </aside>
  );
}
