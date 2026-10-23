'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export default function Preloader({ onStart }) {
  const root = useRef(null);
  const num = useRef(null);
  const bar = useRef(null);
  const start = useRef(onStart);
  start.current = onStart;            // always call the latest callback without re-running the effect

  useEffect(() => {
    const el = root.current;
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: () => { el.style.display = 'none'; } });
      tl.from('.pre__char', { yPercent: 115, stagger: 0.05, duration: 0.9, ease: 'power4.out' })
        .to(counter, {
          v: 100, duration: 1.9, ease: 'power2.inOut',
          onUpdate: () => { num.current.textContent = String(Math.round(counter.v)).padStart(3, '0'); bar.current.style.transform = `scaleX(${counter.v / 100})`; },
        }, 0.2)
        .to('.pre__char', { yPercent: -115, stagger: 0.03, duration: 0.6, ease: 'power3.in' }, '+=0.15')
        .add(() => start.current(), '-=0.1')                         // hero starts entering as the curtain lifts
        .to(el, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.15');
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="pre" role="status" aria-label="Loading">
      <div className="pre__word" aria-hidden="true">
        {[...'SOURABH SONI'].map((c, i) => (
          <span className="pre__mask" key={i}><span className="pre__char">{c === ' ' ? '\u00A0' : c}</span></span>
        ))}
      </div>
      <div className="pre__foot" aria-hidden="true">
        <span ref={num} className="mono">000</span>
        <span className="pre__bar"><i ref={bar} /></span>
        <span className="mono">Portfolio — 2026</span>
      </div>
    </div>
  );
}
