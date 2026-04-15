'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEDIA } from '@/lib/media';

const TICKER = [
  'ELEMENT 07 AIRBORNE · ORBIT ALPHA · FUEL STATE 96%',
  'WEATHER: CAVOK · WIND 270/08 · TEMP −56°C AT ANGELS 45',
  'IFF MODE-4 SET · RADIO DISCIPLINE ACTIVE',
  'COMMIT AUTHORITY: ON-STATION COMMANDER',
  'NEXT TANKER: TK-41 · BEARING 042 · 180 NM',
  'TARGET DECK: UPDATED T-00:14:22 · PRIORITY ALPHA',
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ownRef = useRef<HTMLSpanElement>(null);
  const skyRef = useRef<HTMLSpanElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState('');
  const [clockTime, setClockTime] = useState('00:00:00Z');

  useEffect(() => {
    // Force play (autoplay is browser-discretion even when muted)
    videoRef.current?.play().catch(() => {});

    // Clock
    const tick = () => {
      const d = new Date();
      const h = d.getUTCHours().toString().padStart(2, '0');
      const m = d.getUTCMinutes().toString().padStart(2, '0');
      const s = d.getUTCSeconds().toString().padStart(2, '0');
      setClockTime(`${h}:${m}:${s}Z`);
    };
    tick();
    const clockI = window.setInterval(tick, 1000);

    // Typewriter subtitle
    const msg = '// MISSION 42-ALPHA · ELEMENT LEAD · CLEARED FOR ENGAGEMENT';
    let i = 0;
    const typeI = window.setInterval(() => {
      i++;
      setTyped(msg.slice(0, i));
      if (i >= msg.length) clearInterval(typeI);
    }, 28);

    // Entrance timeline — runs IMMEDIATELY on mount
    const ownChars = ownRef.current?.querySelectorAll('span') ?? [];
    const skyChars = skyRef.current?.querySelectorAll('span') ?? [];

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(bgRef.current, { scale: 1.15, opacity: 0, duration: 2.4, ease: 'power2.out' }, 0)
      .from(ownChars, { y: 100, opacity: 0, stagger: 0.04, duration: 0.9 }, 0.4)
      .from(skyChars, { y: 100, opacity: 0, stagger: 0.04, duration: 0.9 }, 0.7)
      .from(leftPanelRef.current, { x: -40, opacity: 0, duration: 1 }, 1.0)
      .from(rightPanelRef.current, { x: 40, opacity: 0, duration: 1 }, 1.0)
      .from(bottomPanelRef.current, { y: 40, opacity: 0, duration: 1 }, 1.2)
      .from(reticleRef.current, { scale: 1.4, opacity: 0, duration: 1.4, ease: 'power4.out' }, 1.1)
      .from(subtitleRef.current, { opacity: 0, duration: 0.8 }, 1.3);

    // Infinite Ken Burns on backdrop
    gsap.to(bgRef.current, {
      scale: 1.08,
      duration: 18,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Scroll dolly-zoom — backdrop pushes in further, panels slide out
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        if (bgRef.current) {
          bgRef.current.style.filter = `blur(${p * 4}px) brightness(${1 - p * 0.3})`;
        }
        if (leftPanelRef.current) leftPanelRef.current.style.transform = `translateX(${-p * 80}px)`;
        if (rightPanelRef.current) rightPanelRef.current.style.transform = `translateX(${p * 80}px)`;
        if (bottomPanelRef.current) bottomPanelRef.current.style.transform = `translateY(${p * 60}px)`;
        if (leftPanelRef.current) leftPanelRef.current.style.opacity = String(1 - p * 1.5);
        if (rightPanelRef.current) rightPanelRef.current.style.opacity = String(1 - p * 1.5);
        if (bottomPanelRef.current) bottomPanelRef.current.style.opacity = String(1 - p * 1.5);
      },
    });

    return () => {
      clearInterval(clockI);
      clearInterval(typeI);
      tl.kill();
      st.kill();
    };
  }, []);

  const chars = (s: string) =>
    s.split('').map((c, i) => (
      <span key={i} style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
        {c === ' ' ? '\u00A0' : c}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Backdrop video (image poster fallback) */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          filter: 'brightness(0.7) contrast(1.1) saturate(0.9)',
        }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={MEDIA.heroVideo}
          poster={MEDIA.hero}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => console.log('[hero video] loadeddata')}
          onCanPlay={() => console.log('[hero video] canplay')}
          onPlay={() => console.log('[hero video] play')}
          onError={(e) => console.error('[hero video] error', (e.target as HTMLVideoElement).error)}
        />
      </div>

      {/* Color grade + vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 55%, transparent 0%, rgba(5,6,8,0.5) 60%, rgba(5,6,8,0.95) 100%), linear-gradient(180deg, rgba(5,6,8,0.45) 0%, transparent 25%, transparent 65%, rgba(5,6,8,0.9) 100%)',
        }}
      />

      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'><filter id=\'n\'><feTurbulence baseFrequency=\'0.9\' numOctaves=\'2\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.6\'/></svg>")',
        }}
      />

      {/* Scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
        }}
      />

      {/* Target reticle */}
      <div
        ref={reticleRef}
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 'clamp(320px, 35vw, 540px)', height: 'clamp(320px, 35vw, 540px)' }}
      >
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          {/* Corner brackets */}
          <path d="M 10 40 L 10 10 L 40 10" fill="none" stroke="rgba(255,91,20,0.8)" strokeWidth="1.5" />
          <path d="M 160 10 L 190 10 L 190 40" fill="none" stroke="rgba(255,91,20,0.8)" strokeWidth="1.5" />
          <path d="M 190 160 L 190 190 L 160 190" fill="none" stroke="rgba(255,91,20,0.8)" strokeWidth="1.5" />
          <path d="M 40 190 L 10 190 L 10 160" fill="none" stroke="rgba(255,91,20,0.8)" strokeWidth="1.5" />
          {/* Cross */}
          <line x1="100" y1="70" x2="100" y2="90" stroke="rgba(255,91,20,0.4)" strokeWidth="1" />
          <line x1="100" y1="110" x2="100" y2="130" stroke="rgba(255,91,20,0.4)" strokeWidth="1" />
          <line x1="70" y1="100" x2="90" y2="100" stroke="rgba(255,91,20,0.4)" strokeWidth="1" />
          <line x1="110" y1="100" x2="130" y2="100" stroke="rgba(255,91,20,0.4)" strokeWidth="1" />
        </svg>
        {/* Rotating ring */}
        <div
          className="absolute inset-[10%] rounded-full border border-[var(--mach)]/30"
          style={{ animation: 'spin-slow 28s linear infinite' }}
        />
        <div
          className="absolute inset-[20%] rounded-full border border-dashed border-[var(--afterburn)]/30"
          style={{ animation: 'spin-rev-slow 18s linear infinite' }}
        />
      </div>

      {/* Top-of-section chapter tag */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 mono text-[10px] text-[var(--bone)]/50 flex items-center gap-4">
        <span className="h-px w-12 bg-[var(--bone)]/30" />
        <span>CHAPTER I — IGNITION</span>
        <span className="h-px w-12 bg-[var(--bone)]/30" />
      </div>

      {/* Headline */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8">
        <h1
          className="display text-center text-[var(--bone)] select-none"
          style={{
            fontSize: 'clamp(4.5rem, 17vw, 20rem)',
            textShadow: '0 4px 60px rgba(0,0,0,0.7)',
          }}
        >
          <span ref={ownRef} className="block overflow-hidden">
            {chars('OWN')}
          </span>
          <span ref={skyRef} className="block overflow-hidden" style={{ color: 'var(--bone)' }}>
            {chars('THE SKY')}
          </span>
        </h1>
        <div
          ref={subtitleRef}
          className="mono text-[10px] text-[var(--bone)]/70 mt-8 tracking-[0.25em] h-4"
        >
          {typed}
          <span
            className="inline-block h-3 w-[2px] bg-[var(--afterburn)] ml-1 align-middle"
            style={{ animation: 'hud-pulse 0.7s steps(2) infinite' }}
          />
        </div>
      </div>

      {/* Left info panel */}
      <div
        ref={leftPanelRef}
        className="absolute left-[90px] top-[25%] z-10 mono text-[10px] w-[240px] space-y-5"
      >
        <div>
          <div className="text-[var(--bone)]/40 text-[9px] mb-1.5">CALLSIGN</div>
          <div className="text-[var(--afterburn)] text-sm">VIPER-01</div>
        </div>
        <div>
          <div className="text-[var(--bone)]/40 text-[9px] mb-1.5">AIRFRAME</div>
          <div className="text-[var(--bone)]">RAVEN-VII / 5TH GEN</div>
          <div className="text-[var(--bone)]/50 text-[9px] mt-1">SN: 07-AX-2241</div>
        </div>
        <div>
          <div className="text-[var(--bone)]/40 text-[9px] mb-1.5">LOADOUT</div>
          <div className="text-[var(--bone)] text-[10px] leading-relaxed">
            4× AIM-260 JATM<br />
            2× AIM-9X BLK II<br />
            2× SDB-II GBU-53
          </div>
        </div>
        <div className="pt-3 border-t border-white/5">
          <div className="text-[var(--bone)]/40 text-[9px] mb-1.5">MISSION TIME</div>
          <div className="text-[var(--mach)] tabular-nums text-sm">{clockTime}</div>
        </div>
      </div>

      {/* Right info panel */}
      <div
        ref={rightPanelRef}
        className="absolute right-[90px] top-[25%] z-10 mono text-[10px] w-[240px] space-y-5 text-right"
      >
        <div>
          <div className="text-[var(--bone)]/40 text-[9px] mb-1.5">WEATHER</div>
          <div className="text-[var(--bone)]">CAVOK · UNLIMITED</div>
          <div className="text-[var(--bone)]/50 text-[9px] mt-1">WIND 270 / 08 KT</div>
        </div>
        <div>
          <div className="text-[var(--bone)]/40 text-[9px] mb-1.5">AIRSPACE</div>
          <div className="text-[var(--mach)]">MOA-17 ACTIVE</div>
          <div className="text-[var(--bone)]/50 text-[9px] mt-1">SFC / FL500</div>
        </div>
        <div>
          <div className="text-[var(--bone)]/40 text-[9px] mb-1.5">BINGO</div>
          <div className="text-[var(--bone)]">42 MIN · 180 NM</div>
        </div>
        <div className="pt-3 border-t border-white/5 ml-auto">
          <div className="text-[var(--bone)]/40 text-[9px] mb-1.5">CLEARANCE</div>
          <div className="text-[var(--afterburn)]">TOP SECRET / SAP</div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div
        ref={bottomPanelRef}
        className="absolute bottom-16 left-[90px] right-[90px] z-10 flex items-center gap-8 mono text-[10px]"
      >
        <div className="shrink-0 flex items-center gap-2 text-[var(--afterburn)]">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--afterburn)]"
            style={{ animation: 'hud-pulse 0.9s ease-in-out infinite' }}
          />
          LIVE
        </div>
        <div className="flex-1 overflow-hidden relative h-4">
          <div
            className="absolute whitespace-nowrap flex gap-16 text-[var(--bone)]/60"
            style={{ animation: 'ticker-scroll 60s linear infinite' }}
          >
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
        <div className="shrink-0 text-[var(--bone)]/50 tabular-nums">// {clockTime}</div>
      </div>
    </section>
  );
}
