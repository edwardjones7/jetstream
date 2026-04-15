'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEDIA } from '@/lib/media';

export default function Mach() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const jetRef = useRef<HTMLDivElement>(null);
  const coneRef = useRef<HTMLDivElement>(null);
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
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const grain = grainRef.current;
    if (!canvas || !grain) return;
    const ctx = canvas.getContext('2d');
    const gctx = grain.getContext('2d');
    if (!ctx || !gctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grain.width = w; grain.height = h;
      grain.style.width = `${w}px`; grain.style.height = `${h}px`;
    };
    resize();

    const stars = Array.from({ length: 220 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: Math.random() * Math.max(w, h) * 0.5 + 20,
      speed: Math.random() * 6 + 1.5,
    }));

    let raf = 0;
    let grainFrame = 0;
    const tick = () => {
      const p = progressRef.current;

      // star streaks — softer
      ctx.fillStyle = `rgba(5,6,8,${0.28 - p * 0.14})`;
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const speedMult = 1 + p * 8;
      for (const s of stars) {
        const prevR = s.r;
        s.r += s.speed * speedMult;
        if (s.r > Math.max(w, h) * 1.1) {
          s.r = 20;
          s.a = Math.random() * Math.PI * 2;
        }
        const x1 = cx + Math.cos(s.a) * prevR;
        const y1 = cy + Math.sin(s.a) * prevR;
        const x2 = cx + Math.cos(s.a) * s.r;
        const y2 = cy + Math.sin(s.a) * s.r;
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(${200 + p * 55},${210 + p * 45},${235 + p * 20},${0.15 + p * 0.45})`;
        ctx.lineWidth = 0.5 + p * 1.1;
        ctx.stroke();
      }

      // film grain — render every 2nd frame at reduced resolution for perf
      grainFrame++;
      if (grainFrame % 2 === 0) {
        const gw = Math.ceil(w / 2);
        const gh = Math.ceil(h / 2);
        const img = gctx.createImageData(gw, gh);
        const d = img.data;
        const strength = 28;
        for (let i = 0; i < d.length; i += 4) {
          const n = (Math.random() - 0.5) * strength;
          d[i] = 128 + n;
          d[i + 1] = 128 + n;
          d[i + 2] = 128 + n;
          d[i + 3] = 18;
        }
        gctx.putImageData(img, 0, 0);
        gctx.drawImage(grain, 0, 0, gw, gh, 0, 0, w, h);
      }

      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener('resize', resize);

    const formatTC = (p: number) => {
      // pretend reel time — advances with scroll
      const totalFrames = Math.floor(p * 2400) + 122400; // ~01:25:00:00 base
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
        progressRef.current = p;

        if (bgRef.current) {
          bgRef.current.style.transform = `scale(${1.08 + p * 0.25})`;
          bgRef.current.style.filter = `brightness(${0.38 + p * 0.22}) contrast(${1.05 + p * 0.15}) blur(${p * 3}px) saturate(${0.9 + p * 0.3})`;
          bgRef.current.style.opacity = String(Math.max(0, 1 - p * 0.55));
        }
        if (coneRef.current) {
          coneRef.current.style.opacity = String(Math.max(0, (p - 0.3) * 1.8) * 0.85);
          coneRef.current.style.transform = `translate(-50%,-50%) scale(${0.55 + p * 1.1})`;
        }
        if (jetRef.current) {
          const aberration = p * 3.5;
          jetRef.current.style.filter = `drop-shadow(${-aberration}px 0 0 rgba(255,91,20,0.35)) drop-shadow(${aberration}px 0 0 rgba(94,200,255,0.35)) contrast(1.05)`;
          jetRef.current.style.transform = `translate(-50%,-50%) scale(${1 + p * 0.3})`;
        }
        if (flashRef.current) {
          if (p > 0.94) flashRef.current.style.opacity = String((p - 0.94) / 0.06 * 0.7);
          else flashRef.current.style.opacity = '0';
        }

        // letterbox bars slide in 0 → 0.18, hold, slide out 0.88 → 1
        const barIn = Math.min(1, p / 0.18);
        const barOut = p > 0.88 ? 1 - Math.min(1, (p - 0.88) / 0.12) : 1;
        const barHeight = `${Math.min(barIn, barOut) * 11}vh`;
        if (barTopRef.current) barTopRef.current.style.height = barHeight;
        if (barBottomRef.current) barBottomRef.current.style.height = barHeight;

        // anamorphic lens streak — blooms mid-scroll
        if (streakRef.current) {
          const streak = Math.max(0, 1 - Math.abs(p - 0.55) * 2.6);
          streakRef.current.style.opacity = String(streak * 0.9);
          streakRef.current.style.transform = `translate(-50%,-50%) scaleX(${0.4 + streak * 1.8})`;
        }

        // cinematic corner metadata — appears with bars, stays
        const metaOpacity = barIn * barOut;
        if (slateRef.current) slateRef.current.style.opacity = String(metaOpacity * 0.85);
        if (footLeftRef.current) footLeftRef.current.style.opacity = String(metaOpacity * 0.75);
        if (footRightRef.current) footRightRef.current.style.opacity = String(metaOpacity * 0.75);
        if (timecodeRef.current) timecodeRef.current.textContent = formatTC(p);

        // Title card — fade up between 0.32 and 0.62, lift out after 0.82
        const cardIn = Math.min(1, Math.max(0, (p - 0.32) / 0.3));
        const cardOut = p > 0.82 ? Math.max(0, 1 - (p - 0.82) / 0.12) : 1;
        const cardEased = cardIn * cardOut;
        if (cardRef.current) {
          cardRef.current.style.opacity = String(cardEased);
        }
        if (titleRef.current) {
          titleRef.current.style.letterSpacing = `${-0.04 + (1 - cardIn) * 0.28}em`;
          titleRef.current.style.transform = `translateY(${(1 - cardIn) * 14}px)`;
        }
        if (subtitleRef.current) {
          const subT = Math.min(1, Math.max(0, (p - 0.42) / 0.2));
          subtitleRef.current.style.opacity = String(subT * cardOut);
          subtitleRef.current.style.transform = `translateY(${(1 - subT) * 10}px)`;
        }
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="mach"
      className="relative h-[220vh] w-full overflow-hidden bg-[#010104]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Backdrop photo */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${MEDIA.mach})`,
            filter: 'brightness(0.42) saturate(0.95) contrast(1.1)',
          }}
        />

        {/* Heavy cinematic vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.92) 100%)' }}
        />

        {/* Teal/amber split toning for film look */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-color"
          style={{
            background:
              'linear-gradient(180deg, rgba(30,60,90,0.25) 0%, rgba(30,60,90,0.15) 45%, rgba(90,50,20,0.12) 55%, rgba(90,50,20,0.22) 100%)',
          }}
        />

        {/* Star streak canvas */}
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Vapor cone */}
        <div
          ref={coneRef}
          className="pointer-events-none absolute top-1/2 left-1/2 rounded-full"
          style={{
            width: '130vh', height: '130vh',
            transform: 'translate(-50%,-50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(200,230,255,0.3) 18%, rgba(100,180,255,0.1) 42%, transparent 70%)',
            mixBlendMode: 'screen',
            filter: 'blur(34px)',
            opacity: 0,
          }}
        />

        {/* Jet photo cutout */}
        <div
          ref={jetRef}
          className="pointer-events-none absolute top-1/2 left-1/2 z-10"
          style={{
            width: 'min(55vh, 45vw)',
            height: 'min(40vh, 32vw)',
            transform: 'translate(-50%,-50%)',
            backgroundImage: `url(${MEDIA.jetA})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform, filter',
            maskImage: 'radial-gradient(ellipse at center, black 45%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 45%, transparent 80%)',
          }}
        />

        {/* Anamorphic lens streak — horizontal blue bloom */}
        <div
          ref={streakRef}
          className="pointer-events-none absolute top-1/2 left-1/2 z-[11]"
          style={{
            width: '120vw', height: '2px',
            transform: 'translate(-50%,-50%)',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(94,200,255,0.08) 20%, rgba(160,220,255,0.95) 50%, rgba(94,200,255,0.08) 80%, transparent 100%)',
            filter: 'blur(2.5px)',
            mixBlendMode: 'screen',
            opacity: 0,
          }}
        />

        {/* Cinematic title card */}
        <div
          ref={cardRef}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center"
          style={{ opacity: 0 }}
        >
          <h2
            ref={titleRef}
            className="display text-center text-[var(--bone)] whitespace-nowrap"
            style={{
              fontSize: 'clamp(2.5rem, 8.5vw, 8.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              mixBlendMode: 'difference',
            }}
          >
            ABOVE THE WEATHER
          </h2>
          <div
            ref={subtitleRef}
            className="mt-6 mono text-[11px] text-[var(--bone)]/70 flex items-center gap-4"
            style={{ opacity: 0, letterSpacing: '0.42em' }}
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
          style={{ height: 0 }}
        />
        <div
          ref={barBottomRef}
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 bg-black"
          style={{ height: 0 }}
        />

        {/* Slate — top-left film metadata */}
        <div
          ref={slateRef}
          className="absolute z-40 mono text-[9px] text-[var(--bone)]/80 flex flex-col gap-1"
          style={{ top: 'calc(11vh + 18px)', left: '28px', opacity: 0, letterSpacing: '0.32em' }}
        >
          <div className="flex items-center gap-2">
            <span className="inline-block h-[6px] w-[6px] bg-[var(--afterburn)]" />
            REEL 03 · SC 114
          </div>
          <div className="text-[var(--bone)]/50">ABOVE THE WEATHER</div>
          <div className="text-[var(--bone)]/40">DIR. CAPT. M. HARRIS</div>
        </div>

        {/* Timecode — top-right, advances with scroll */}
        <div
          className="absolute z-40 mono text-[9px] text-[var(--bone)]/80"
          style={{ top: 'calc(11vh + 18px)', right: '28px', letterSpacing: '0.22em' }}
        >
          <div className="text-right text-[var(--bone)]/50 mb-1">TC · 24 FPS</div>
          <div className="tabular-nums text-[11px] text-[var(--mach)]">
            <span ref={timecodeRef}>01:25:00:00</span>
          </div>
        </div>

        {/* Bottom-left — coordinates */}
        <div
          ref={footLeftRef}
          className="absolute z-40 mono text-[9px] text-[var(--bone)]/70"
          style={{ bottom: 'calc(11vh + 18px)', left: '28px', opacity: 0, letterSpacing: '0.28em' }}
        >
          <div className="text-[var(--bone)]/40 mb-1">COORDS</div>
          <div className="tabular-nums text-[var(--bone)]/80">47.46°N · 008.55°E</div>
          <div className="tabular-nums text-[var(--bone)]/50">FL 580 · OAT −56°C</div>
        </div>

        {/* Bottom-right — format stamp */}
        <div
          ref={footRightRef}
          className="absolute z-40 mono text-[9px] text-[var(--bone)]/70 text-right"
          style={{ bottom: 'calc(11vh + 18px)', right: '28px', opacity: 0, letterSpacing: '0.32em' }}
        >
          <div className="text-[var(--bone)]/40 mb-1">FORMAT</div>
          <div>65MM · 2.39:1</div>
          <div className="text-[var(--bone)]/50">DOLBY ATMOS</div>
        </div>

        {/* Film grain overlay */}
        <canvas
          ref={grainRef}
          className="pointer-events-none absolute inset-0 z-[45]"
          style={{ mixBlendMode: 'overlay', opacity: 0.55 }}
        />

        {/* Sonic boom flash */}
        <div ref={flashRef} className="pointer-events-none absolute inset-0 z-[50] bg-white"
             style={{ opacity: 0, mixBlendMode: 'screen' }} />
      </div>
    </section>
  );
}
