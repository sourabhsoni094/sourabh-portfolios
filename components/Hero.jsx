'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import { useSite } from './SiteContext';
import GLImage from './GLImage';
import { stats } from '@/lib/data';

const char = {
  hidden: { y: '118%' },
  show: (i) => ({ y: '0%', transition: { delay: 0.04 * i + 0.1, duration: 1.1, ease: [0.19, 1, 0.22, 1] } }),
};

function Line({ text, offset = 0, ready, n }) {
  return (
    <span className={`hero__line hero__line--${n}`} aria-hidden="true">
      {[...text].map((c, i) => (
        <span className="mask" key={i}>
          <motion.span className="char" variants={char} custom={i + offset} initial="hidden" animate={ready ? 'show' : 'hidden'}>{c}</motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { ready } = useSite();
  const root = useRef(null);

  // Scroll-driven: on desktop the name lines slide subtly, portrait drifts up; on mobile subtle parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero__line--1', { xPercent: -4, ease: 'none', scrollTrigger: st });
        gsap.to('.hero__line--2', { xPercent: 4, ease: 'none', scrollTrigger: st });
        gsap.to('.hero__portrait', { yPercent: -12, scale: 0.95, ease: 'none', scrollTrigger: st });
        gsap.to('.hero__meta', { opacity: 0, y: -30, ease: 'none', scrollTrigger: { ...st, end: '40% top' } });
      });
      mm.add('(max-width: 899px)', () => {
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero__portrait', { yPercent: -8, scale: 0.96, ease: 'none', scrollTrigger: st });
        gsap.to('.hero__meta', { opacity: 0, y: -20, ease: 'none', scrollTrigger: { ...st, end: '50% top' } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="hero">
      <GLImage className="hero__portrait" src="/images/portrait.jpg" label="Portrait of Sourabh Soni" delay={0.2} data-cursor="Hello" />

      <motion.div className="hero__meta" initial={{ opacity: 0, y: 24 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.9, duration: 1, ease: [0.19, 1, 0.22, 1] }}>
        <p className="eyebrow mono">Software Engineer</p>
        <p className="hero__lede">
          Building <em>reliable</em> web applications with PHP, Laravel &amp; Python — across healthcare, education, finance and sport.
        </p>
        <ul className="hero__stats">
          {stats.map((s) => (<li key={s.l}><b>{s.n}</b><span className="mono">{s.l}</span></li>))}
        </ul>
      </motion.div>

      <h1 className="hero__title" aria-label="Sourabh Soni">
        <Line text="SOURABH" n={1} ready={ready} />
        <Line text="SONI" n={2} offset={7} ready={ready} />
      </h1>

      <div className="hero__scroll mono" aria-hidden="true"><span className="hero__ring" />Scroll</div>
    </section>
  );
}
