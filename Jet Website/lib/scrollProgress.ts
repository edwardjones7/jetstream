'use client';

// Singleton scroll-progress broadcaster.
// One scroll listener + one RAF for the whole app, dispatching to N subscribers.
// Replaces per-component window.scroll handlers that triggered React re-renders.

type Cb = (progress: number, scrollY: number) => void;

const subs = new Set<Cb>();
let progress = 0;
let scrollY = 0;
let initialized = false;
let dirty = false;

function compute() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return;
  scrollY = window.scrollY;
  const p = Math.max(0, Math.min(1, scrollY / max));
  if (p !== progress) {
    progress = p;
    dirty = true;
  }
}

function tick() {
  if (dirty) {
    dirty = false;
    subs.forEach((cb) => cb(progress, scrollY));
  }
  requestAnimationFrame(tick);
}

function init() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  window.addEventListener('scroll', compute, { passive: true });
  window.addEventListener('resize', compute);
  compute();
  dirty = true;
  requestAnimationFrame(tick);
}

export function subscribeScrollProgress(cb: Cb) {
  init();
  subs.add(cb);
  cb(progress, scrollY);
  return () => {
    subs.delete(cb);
  };
}

export function getScrollProgress() {
  return progress;
}
