'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSite } from './SiteContext';
import GLImage from './GLImage';
import Reveal from './Reveal';
import Magnetic from './Magnetic';
import { projects } from '@/lib/data';

function Modal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={onClose}>
      <motion.div className="modal__panel" onClick={(e) => e.stopPropagation()}
        initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} exit={{ clipPath: 'inset(100% 0 0 0)' }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
        <div className="modal__art" style={{ background: `linear-gradient(135deg, ${project.palette.join(', ')})` }} aria-hidden="true" />
        <div className="modal__body">
          <p className="mono">{project.id} / {project.type}</p>
          <h3 id="modal-title">{project.title}</h3>
          <ul>{project.points.map((p, i) => (
            <motion.li key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }}>{p}</motion.li>
          ))}</ul>
          <div className="tags">{project.tags.map((t) => <span key={t}>{t}</span>)}</div>
        </div>
        <button className="modal__close" onClick={onClose} autoFocus>Close ✕</button>
      </motion.div>
    </motion.div>
  );
}

export default function Work() {
  const { loco, ready } = useSite();
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!loco?.lenisInstance || !ready) return;
    active ? loco.lenisInstance.stop() : loco.lenisInstance.start();
  }, [active, loco, ready]);

  return (
    <section id="work" className="work">
      <header className="work__head">
        <Reveal as="h2" className="display" lines={['Selected', 'work']} />
        <p className="mono" data-scroll>( {String(projects.length).padStart(2, '0')} projects )</p>
      </header>

      <div className="work__list">
        {projects.map((p, i) => (
          <article key={p.id} className={`project ${i % 2 ? 'is-flip' : ''}`}>
            <button className="project__hit" onClick={() => setActive(p)} data-cursor="View" aria-label={`Open ${p.title}`}>
              <GLImage className="project__media" palette={p.palette} seed={p.seed} label={`${p.title} cover art`} />
            </button>
            <div className="project__body">
              <p className="mono"><span>{p.id}</span> {p.type}</p>
              <Reveal as="h3" className="project__title" lines={[p.title]} />
              <p className="project__blurb">{p.blurb}</p>
              <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
              <Magnetic><button className="btn" onClick={() => setActive(p)}>Read details <i>→</i></button></Magnetic>
            </div>
          </article>
        ))}
      </div>

      <AnimatePresence>{active && <Modal key={active.id} project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
