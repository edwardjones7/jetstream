'use client';

import { useEffect, useState } from 'react';

export default function HUD() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const p = Math.max(0, Math.min(1, window.scrollY / max));
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!mounted) return null;

  const armed = progress > 0.06;
  const altitude = Math.floor(progress * 62000);
  const mach = (progress * 3.2).toFixed(2);
  const altStr = altitude.toString().padStart(6, '0');

  return (
    <>
      {/* Viewport hairline frame */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
        <div className="absolute inset-[14px] border border-white/[0.06]" />
        {/* Corner ticks */}
        <div className="absolute left-[14px] top-[14px] h-3 w-3 border-l border-t border-[var(--bone)]/40" />
        <div className="absolute right-[14px] top-[14px] h-3 w-3 border-r border-t border-[var(--bone)]/40" />
        <div className="absolute left-[14px] bottom-[14px] h-3 w-3 border-l border-b border-[var(--bone)]/40" />
        <div className="absolute right-[14px] bottom-[14px] h-3 w-3 border-r border-b border-[var(--bone)]/40" />
      </div>

      {/* Status: top-left */}
      <div className="pointer-events-none fixed top-7 left-7 z-50 flex items-center gap-2 mono text-[10px]">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: armed ? 'var(--afterburn)' : '#fbbf24',
            animation: 'hud-pulse 1.4s ease-in-out infinite',
            boxShadow: armed
              ? '0 0 12px var(--afterburn)'
              : '0 0 8px #fbbf24',
          }}
        />
        <span style={{ color: armed ? 'var(--afterburn)' : '#fbbf24' }}>
          STATUS · {armed ? 'ARMED' : 'STANDBY'}
        </span>
      </div>

      {/* Altimeter: top-right */}
      <div className="pointer-events-none fixed top-7 right-7 z-50 mono text-[10px] text-right">
        <div className="tabular-nums text-[var(--bone)]/70">
          ALT <span className="text-[var(--bone)]">{altStr}</span> FT
        </div>
        <div className="tabular-nums text-[var(--mach)]/70 mt-1">
          MACH <span className="text-[var(--mach)]">{mach}</span>
        </div>
      </div>

      {/* Wordmark: bottom-left */}
      <div className="pointer-events-none fixed bottom-7 left-7 z-50 mono text-[10px] text-[var(--bone)]/60">
        OWN·THE·SKY / V1.0
      </div>

      {/* Progress bar: bottom-right */}
      <div className="pointer-events-none fixed bottom-7 right-7 z-50 flex items-center gap-3 mono text-[9px] text-[var(--bone)]/50 w-[220px]">
        <span className="tabular-nums">{Math.floor(progress * 100).toString().padStart(2, '0')}</span>
        <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, var(--afterburn), var(--mach))`,
            }}
          />
        </div>
        <span>100</span>
      </div>
    </>
  );
}
