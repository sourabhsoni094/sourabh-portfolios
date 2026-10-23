'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import Reveal from './Reveal';
import { experience } from '@/lib/data';

export default function Experience() {
  const root = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);

  // Desktop: the section pins and the track scrolls sideways. Mobile: plain vertical stack.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const dist = () => track.current.scrollWidth - window.innerWidth + window.innerWidth * 0.06;
      gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
          onUpdate: (self) => { if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`; },
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="experience" ref={root} className="exp">
      <header className="exp__head">
        <Reveal as="h2" className="display" lines={['Experience', '& education']} />
        <div className="exp__progress" aria-hidden="true"><i ref={bar} /></div>
      </header>
      <div className="exp__track" ref={track}>
        {experience.map((e) => (
          <article className="panel" key={e.n}>
            <span className="panel__n" aria-hidden="true">{e.n}</span>
            <p className="mono">{e.when}{e.where && ` · ${e.where}`}</p>
            <h3>{e.role}</h3>
            <p className="panel__org">{e.org}</p>
            <ul>{e.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}
