'use client';

import { useEffect, useRef } from 'react';

/**
 * Returns a ref whose .current is the latest smoothed scroll velocity in [0,1].
 * Using a ref avoids re-rendering on every animation frame.
 */
export function useScrollVelocityRef() {
  const ref = useRef(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const lenis = (window as unknown as { __lenis?: { velocity: number } }).__lenis;
      if (lenis) {
        const v = Math.min(1, Math.abs(lenis.velocity) / 80);
        ref.current = ref.current + (v - ref.current) * 0.25;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return ref;
}
