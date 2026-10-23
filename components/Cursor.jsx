'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Custom cursor: a dot + a spring-following ring that grows on links and shows labels via [data-cursor="..."]
export default function Cursor() {
  const [fine, setFine] = useState(false);
  const [state, setState] = useState({ type: 'default', label: '' });
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.5 });

  useEffect(() => {
    const mq = matchMedia('(hover: hover) and (pointer: fine)');
    setFine(mq.matches);
    if (!mq.matches) return;
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => {
      const lab = e.target.closest?.('[data-cursor]');
      if (lab) return setState({ type: 'label', label: lab.dataset.cursor });
      if (e.target.closest?.('a, button, summary, [role="button"]')) return setState({ type: 'link', label: '' });
      setState({ type: 'default', label: '' });
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); };
  }, [x, y]);

  if (!fine) return null;
  const size = state.type === 'label' ? 96 : state.type === 'link' ? 58 : 30;
  return (
    <div className="cursor" aria-hidden="true">
      <motion.div className="cursor__pos" style={{ x: rx, y: ry }}>
        <motion.div className={`cursor__ring is-${state.type}`} animate={{ width: size, height: size }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>
          {state.label && <span>{state.label}</span>}
        </motion.div>
      </motion.div>
      <motion.div className="cursor__pos" style={{ x, y }}><div className="cursor__dot" /></motion.div>
    </div>
  );
}
