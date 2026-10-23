'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const text = 'I design and build dependable web applications — REST APIs, role-based platforms and performance-tuned backends — for teams in healthcare, education, finance and sport.';
const accent = new Set(['dependable', 'performance-tuned', 'role-based']);

export default function Statement() {
  const root = useRef(null);

  // Scrub-driven word-by-word highlight tied to scroll position
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.statement__word', { opacity: 0.12 }, {
        opacity: 1, stagger: 0.12, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 78%', end: 'bottom 55%', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" className="statement">
      <p className="eyebrow mono" data-scroll>( About )</p>
      <p className="statement__text">
        {text.split(' ').map((w, i) => (
          <span className="statement__word" key={i}>
            {accent.has(w.replace(/[,.—]/g, '')) ? <em>{w}</em> : w}{' '}
          </span>
        ))}
      </p>
    </section>
  );
}
