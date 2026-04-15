'use client';

import { useEffect, useState } from 'react';

function jitter(base: number, amp: number) {
  return base + (Math.random() - 0.5) * amp;
}

export default function TelemetryTicker() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setProgress(Math.max(0, Math.min(1, window.scrollY / max)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const i = window.setInterval(() => setTick((t) => t + 1), 180);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(i);
    };
  }, []);

  if (!mounted) return null;

  // Fade in after user scrolls past hero (hero has its own side panels)
  const vis = Math.max(0, Math.min(1, (progress - 0.05) * 10));

  const alt = Math.floor(progress * 62000);
  const speed = Math.floor(progress * 2200 + jitter(0, 10));
  const temp = Math.floor(612 - progress * 480 + jitter(0, 3));
  const fuel = Math.max(12, Math.floor(100 - progress * 72));
  const gforce = (1 + progress * 7 + jitter(0, 0.1)).toFixed(2);
  const heading = ((progress * 240 + 42 + jitter(0, 1)) % 360).toFixed(1);
  const pitch = (progress * 18 - 2 + jitter(0, 0.2)).toFixed(1);
  const roll = (jitter(0, 1.5)).toFixed(1);

  const items = [
    { l: 'SPD', v: `${speed} KN`, c: 'var(--mach)' },
    { l: 'ALT', v: `${alt.toLocaleString()} FT`, c: 'var(--bone)' },
    { l: 'HDG', v: `${heading}°`, c: 'var(--bone)' },
    { l: 'PTC', v: `${pitch}°`, c: 'var(--bone)' },
    { l: 'ROL', v: `${roll}°`, c: 'var(--bone)' },
    { l: 'G', v: `${gforce}`, c: 'var(--afterburn)' },
    { l: 'EGT', v: `${temp}°C`, c: 'var(--afterburn)' },
    { l: 'FUEL', v: `${fuel}%`, c: fuel < 25 ? 'var(--afterburn)' : 'var(--bone)' },
  ];

  // Suppress unused warning for tick
  void tick;

  return (
    <aside
      className="pointer-events-none fixed left-7 top-1/2 -translate-y-1/2 z-40 w-[180px] space-y-2 transition-opacity duration-500"
      style={{ opacity: vis }}
    >
      <div className="mono text-[9px] text-[var(--bone)]/40 flex items-center gap-2 mb-3">
        <span
          className="h-1 w-1 rounded-full bg-[var(--mach)]"
          style={{ animation: 'hud-pulse 1s ease-in-out infinite' }}
        />
        LIVE TELEMETRY
      </div>
      {items.map((it) => (
        <div
          key={it.l}
          className="flex items-baseline justify-between mono text-[10px] border-l-2 pl-3 py-1"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <span className="text-[var(--bone)]/40 text-[9px]">{it.l}</span>
          <span className="tabular-nums" style={{ color: it.c }}>
            {it.v}
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
