'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Mach() {
  const sectionRef = useRef<HTMLElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const barTopRef = useRef<HTMLDivElement>(null);
  const barBottomRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const slateRef = useRef<HTMLDivElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const footLeftRef = useRef<HTMLDivElement>(null);
  const footRightRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const formatTC = (p: number) => {
      const totalFrames = Math.floor(p * 2400) + 122400;
      const fps = 24;
      const f = totalFrames % fps;
      const s = Math.floor(totalFrames / fps) % 60;
      const m = Math.floor(totalFrames / (fps * 60)) % 60;
      const hh = Math.floor(totalFrames / (fps * 3600));
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${pad(hh)}:${pad(m)}:${pad(s)}:${pad(f)}`;
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;

        // Letterbox bars: slide in 0 → 0.16, hold, slide out 0.90 → 1
        const barIn = Math.min(1, p / 0.16);
        const barOut = p > 0.90 ? 1 - Math.min(1, (p - 0.90) / 0.10) : 1;
        const barH = `${Math.min(barIn, barOut) * 11}vh`;
        if (barTopRef.current) barTopRef.current.style.height = barH;
        if (barBottomRef.current) barBottomRef.current.style.height = barH;

        // Slight darken under the title card (helps text legibility against bright sky)
        if (dimRef.current) {
          const dim = Math.min(barIn, barOut);
          dimRef.current.style.opacity = String(dim * 0.45);
        }

        // Cinema metadata (slate + timecode visible while in cinema mode)
        const meta = barIn * barOut;
        if (slateRef.current) slateRef.current.style.opacity = String(meta * 0.85);
        if (footLeftRef.current) footLeftRef.current.style.opacity = String(meta * 0.75);
        if (footRightRef.current) footRightRef.current.style.opacity = String(meta * 0.75);
        if (timecodeRef.current) timecodeRef.current.textContent = formatTC(p);

        // Anamorphic lens streak — blooms mid-section
        if (streakRef.current) {
          const streak = Math.max(0, 1 - Math.abs(p - 0.5) * 2.4);
          streakRef.current.style.opacity = String(streak * 0.9);
          streakRef.current.style.transform = `translate(-50%,-50%) scaleX(${0.4 + streak * 1.8})`;
        }

        // Horizon line — soft cloud-haze breath at frame bottom (anchors the cinema in the sky)
        if (horizonRef.current) {
          const h = Math.max(0, Math.min(1, (p - 0.05) / 0.25)) * (p > 0.85 ? 1 - (p - 0.85) / 0.15 : 1);
          horizonRef.current.style.opacity = String(Math.max(0, h) * 0.7);
        }

        // Title card — fade up between 0.20 and 0.45, hold, lift out after 0.78
        const cardIn = Math.min(1, Math.max(0, (p - 0.20) / 0.25));
        const cardOut = p > 0.78 ? Math.max(0, 1 - (p - 0.78) / 0.14) : 1;
        const cardEased = cardIn * cardOut;
        if (cardRef.current) cardRef.current.style.opacity = String(cardEased);
        if (titleRef.current) {
          titleRef.current.style.letterSpacing = `${-0.04 + (1 - cardIn) * 0.32}em`;
          titleRef.current.style.transform = `translateY(${(1 - cardIn) * 18}px)`;
        }
        if (subtitleRef.current) {
          const subT = Math.min(1, Math.max(0, (p - 0.34) / 0.18));
          subtitleRef.current.style.opacity = String(subT * cardOut);
          subtitleRef.current.style.transform = `translateY(${(1 - subT) * 12}px)`;
        }

        // Sonic boom flash near end
        if (flashRef.current) {
          if (p > 0.93) flashRef.current.style.opacity = String(((p - 0.93) / 0.07) * 0.6);
          else flashRef.current.style.opacity = '0';
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="mach"
      className="relative h-[180vh] w-full overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Soft horizon haze — cloud breath at frame bottom */}
        <div
          ref={horizonRef}
          className="pointer-events-none absolute left-[-10%] right-[-10%] bottom-[18%] h-[28vh]"
          style={{
            opacity: 0,
            background:
              'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(220,235,255,0.55) 0%, rgba(180,210,240,0.18) 35%, transparent 70%)',
            mixBlendMode: 'screen',
            filter: 'blur(14px)',
            willChange: 'opacity',
          }}
        />

        {/* Subtle dim under the title card — only inside the letterbox */}
        <div
          ref={dimRef}
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0,
            background:
              'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 50%, transparent 80%)',
            willChange: 'opacity',
          }}
        />

        {/* Anamorphic lens streak */}
        <div
          ref={streakRef}
          className="pointer-events-none absolute top-1/2 left-1/2 z-[11]"
          style={{
            width: '120vw',
            height: '2px',
            transform: 'translate(-50%,-50%)',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(94,200,255,0.08) 20%, rgba(160,220,255,0.95) 50%, rgba(94,200,255,0.08) 80%, transparent 100%)',
            filter: 'blur(2.5px)',
            mixBlendMode: 'screen',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />

        {/* Cinematic title card */}
        <div
          ref={cardRef}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center"
          style={{ opacity: 0, willChange: 'opacity' }}
        >
          <h2
            ref={titleRef}
            className="display text-center text-[var(--bone)] whitespace-nowrap"
            style={{
              fontSize: 'clamp(2.5rem, 8.5vw, 8.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              textShadow: '0 4px 60px rgba(0,0,0,0.55)',
              willChange: 'transform, letter-spacing',
            }}
          >
            ABOVE THE WEATHER
          </h2>
          <div
            ref={subtitleRef}
            className="mt-6 mono text-[11px] text-[var(--bone)]/80 flex items-center gap-4"
            style={{ opacity: 0, letterSpacing: '0.42em', willChange: 'transform, opacity' }}
          >
            <span className="h-px w-10 bg-[var(--bone)]/40" />
            A JET FILM
            <span className="h-px w-10 bg-[var(--bone)]/40" />
          </div>
        </div>

        {/* Letterbox bars */}
        <div
          ref={barTopRef}
          className="pointer-events-none absolute top-0 left-0 right-0 z-30 bg-black"
          style={{ height: 0, willChange: 'height' }}
        />
        <div
          ref={barBottomRef}
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 bg-black"
          style={{ height: 0, willChange: 'height' }}
        />

        {/* Slate — top-left film metadata */}
        <div
          ref={slateRef}
          className="absolute z-40 mono text-[9px] text-[var(--bone)]/85 flex flex-col gap-1"
          style={{ top: 'calc(11vh + 18px)', left: '28px', opacity: 0, letterSpacing: '0.32em' }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-[6px] w-[6px] bg-[var(--afterburn)]" />
            REEL 03 · SC 114
          </div>
          <div className="text-[var(--bone)]/55">ABOVE THE WEATHER</div>
          <div className="text-[var(--bone)]/45">DIR. CAPT. M. HARRIS</div>
        </div>

        {/* Timecode — top-right, advances with scroll */}
        <div
          className="absolute z-40 mono text-[9px] text-[var(--bone)]/85"
          style={{ top: 'calc(11vh + 18px)', right: '28px', letterSpacing: '0.22em' }}
        >
          <div className="text-right text-[var(--bone)]/55 mb-1">TC · 24 FPS</div>
          <div className="tabular-nums text-[11px] text-[var(--mach)]">
            <span ref={timecodeRef}>01:25:00:00</span>
          </div>
        </div>

        {/* Bottom-left — coordinates */}
        <div
          ref={footLeftRef}
          className="absolute z-40 mono text-[9px] text-[var(--bone)]/75"
          style={{ bottom: 'calc(11vh + 18px)', left: '28px', opacity: 0, letterSpacing: '0.28em' }}
        >
          <div className="text-[var(--bone)]/45 mb-1">COORDS</div>
          <div className="tabular-nums text-[var(--bone)]/85">47.46°N · 008.55°E</div>
          <div className="tabular-nums text-[var(--bone)]/55">FL 580 · OAT −56°C</div>
        </div>

        {/* Bottom-right — format stamp */}
        <div
          ref={footRightRef}
          className="absolute z-40 mono text-[9px] text-[var(--bone)]/75 text-right"
          style={{ bottom: 'calc(11vh + 18px)', right: '28px', opacity: 0, letterSpacing: '0.32em' }}
        >
          <div className="text-[var(--bone)]/45 mb-1">FORMAT</div>
          <div>65MM · 2.39:1</div>
          <div className="text-[var(--bone)]/55">DOLBY ATMOS</div>
        </div>

        {/* Sonic boom flash */}
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 z-[50] bg-white"
          style={{ opacity: 0, mixBlendMode: 'screen', willChange: 'opacity' }}
        />
      </div>
    </section>
  );
}
