'use client';

import { useEffect, useRef, useState } from 'react';
import { subscribeScrollProgress } from '@/lib/scrollProgress';

const CHAPTERS = [
  { id: 'takeoff', label: 'TAKEOFF' },
  { id: 'fleet', label: 'FLEET' },
  { id: 'anatomy', label: 'ANATOMY' },
  { id: 'mach', label: 'MACH' },
  { id: 'apex', label: 'APEX' },
  { id: 'legacy', label: 'LEGACY' },
];

export default function ChapterNav() {
  const [active, setActive] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let bounds: { top: number; bottom: number }[] = [];
    const measure = () => {
      bounds = CHAPTERS.map((c) => {
        const el = document.getElementById(c.id);
        if (!el) return { top: 0, bottom: 0 };
        const top = el.offsetTop;
        return { top, bottom: top + el.offsetHeight };
      });
    };
    measure();
    window.addEventListener('resize', measure);
    // Re-measure once after fonts/images settle
    const settleTimer = window.setTimeout(measure, 800);

    let lastActive = -1;
    let lastDim: boolean | null = null;
    const unsub = subscribeScrollProgress((p, y) => {
      if (navRef.current) {
        const dim = p < 0.05;
        if (dim !== lastDim) {
          lastDim = dim;
          navRef.current.style.opacity = dim ? '0.25' : '1';
        }
      }
      const center = y + window.innerHeight / 2;
      let found = 0;
      for (let i = 0; i < bounds.length; i++) {
        if (center >= bounds[i].top && center < bounds[i].bottom) {
          found = i;
          break;
        }
      }
      if (found !== lastActive) {
        lastActive = found;
        setActive(found);
      }
    });

    return () => {
      window.removeEventListener('resize', measure);
      window.clearTimeout(settleTimer);
      unsub();
    };
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el.offsetTop);
    else window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      className="pointer-events-auto fixed right-7 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 transition-opacity duration-500"
      style={{ opacity: 0.25 }}
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
            <span className="tabular-nums w-4 text-right">{String(i + 1).padStart(2, '0')}</span>
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
              style={{ maxWidth: isActive ? '120px' : '0px', opacity: isActive ? 1 : 0 }}
            >
              {c.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
