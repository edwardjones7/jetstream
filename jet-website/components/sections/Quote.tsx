'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function Quote() {
  const root = useRef<HTMLDivElement>(null);
  const line1 = useRef<HTMLDivElement>(null);
  const line2 = useRef<HTMLDivElement>(null);
  const attrib = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top 95%',
          end: 'center 55%',
          scrub: 0.6,
        },
      });

      tl.from(bar.current, { scaleX: 0, duration: 0.3, transformOrigin: 'left' })
        .from(line1.current, { opacity: 0, y: 30, duration: 0.5 }, '-=0.15')
        .from(line2.current, { opacity: 0, y: 30, duration: 0.5 }, '-=0.3')
        .from(attrib.current, { opacity: 0, y: 20, duration: 0.35 }, '-=0.15');
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative py-[22vh] overflow-hidden"
    >
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div
          ref={bar}
          className="mx-auto mb-10 h-px w-32 bg-[var(--afterburn)]"
        />
        <div className="mono text-[10px] text-[var(--afterburn)] tracking-[0.4em] mb-8">
          COCKPIT TRANSMISSION · 1986
        </div>

        <blockquote>
          <div
            ref={line1}
            className="display text-white text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.1]"
          >
            &ldquo;THE ONLY THING I KNEW FOR SURE
          </div>
          <div
            ref={line2}
            className="display text-[var(--mach)] text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.1] mt-3"
          >
            WAS THAT I WAS NEVER, EVER
            <br />
            GOING TO FLY THAT FAST AGAIN.&rdquo;
          </div>
        </blockquote>

        <div ref={attrib} className="mt-12 mono text-[10px] text-white/55 tracking-[0.32em]">
          — MAJ. BRIAN SHUL · SR-71 PILOT
        </div>
      </div>
    </section>
  );
}
