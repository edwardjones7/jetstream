'use client';

import { useEffect, useState } from 'react';

const CHAPTERS = [
  { id: 'hero', label: 'IGNITION' },
  { id: 'ignition', label: 'ROLLOUT' },
  { id: 'ascent', label: 'ASCENT' },
  { id: 'fleet', label: 'FLEET' },
  { id: 'anatomy', label: 'ANATOMY' },
  { id: 'mach', label: 'MACH' },
  { id: 'apex', label: 'APEX' },
  { id: 'legacy', label: 'LEGACY' },
];

export default function ChapterNav() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      const center = window.scrollY + vh / 2;
      let found = 0;
      CHAPTERS.forEach((c, i) => {
        const el = document.getElementById(c.id);
        if (!el) return;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (center >= top && center < bottom) found = i;
      });
      setActive(found);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) setProgress(Math.max(0, Math.min(1, window.scrollY / max)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el.offsetTop);
    else window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  // Fade to very dim on hero (where the right info panel lives)
  const vis = progress < 0.05 ? 0.25 : 1;

  return (
    <nav
      className="pointer-events-auto fixed right-7 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 transition-opacity duration-500"
      style={{ opacity: vis }}
    >
      {CHAPTERS.map((c, i) => {
        const isActive = i === active;
        return (
          <button
            key={c.id}
            onClick={() => jump(c.id)}
            className="group flex items-center gap-3 mono text-[9px] transition-all"
            style={{ color: isActive ? 'var(--afterburn)' : 'rgba(238,240,243,0.35)' }}
          >
            <span className="tabular-nums w-4 text-right">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="transition-all"
              style={{
                width: isActive ? '48px' : '16px',
                height: '1px',
                background: isActive ? 'var(--afterburn)' : 'rgba(238,240,243,0.4)',
              }}
            />
            <span
              className="overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300"
              style={{
                maxWidth: isActive ? '120px' : '0px',
                opacity: isActive ? 1 : 0,
              }}
            >
              {c.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
