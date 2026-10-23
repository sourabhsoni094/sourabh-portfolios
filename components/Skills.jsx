'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import Reveal from './Reveal';
import { skillGroups, marquee } from '@/lib/data';

function Row({ rowRef, outline }) {
  const items = [...marquee, ...marquee];
  return (
    <div className={`marquee ${outline ? 'is-outline' : ''}`} aria-hidden="true">
      <div className="marquee__inner" ref={rowRef}>
        {items.map((m, i) => <span key={i}>{m}<b>✦</b></span>)}
      </div>
    </div>
  );
}

export default function Skills() {
  const a = useRef(null);
  const b = useRef(null);

  // Two marquees running in opposite directions that speed up with scroll velocity
  useEffect(() => {
    let xa = 0, xb = 0, last = window.scrollY, boost = 0;
    const tick = () => {
      if (!a.current || !b.current) return;
      const wa = a.current.scrollWidth / 2 || 1, wb = b.current.scrollWidth / 2 || 1;
      const y = window.scrollY; boost += (Math.abs(y - last) - boost) * 0.1; last = y;
      const speed = 0.6 + boost * 0.5;
      xa = (xa - speed) % wa; xb = (xb + speed) % wb;
      a.current.style.transform = `translate3d(${xa}px,0,0)`;
      b.current.style.transform = `translate3d(${xb - wb}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  // Spotlight effect: the card glow follows the pointer
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section id="skills" className="skills">
      <header className="skills__head">
        <Reveal as="h2" className="display" lines={['Tools', 'I think in']} />
      </header>
      <Row rowRef={a} />
      <Row rowRef={b} outline />
      <div className="skills__grid">
        {skillGroups.map((g) => (
          <div className="card" key={g.title} onPointerMove={spot} data-scroll>
            <h3 className="mono">{g.title}</h3>
            <p>{g.items.join(' · ')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
