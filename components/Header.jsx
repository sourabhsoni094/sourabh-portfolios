'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSite } from './SiteContext';
import Magnetic from './Magnetic';
import { profile } from '@/lib/data';

const links = [
  ['Work', '#work'], ['Experience', '#experience'], ['Skills', '#skills'], ['Contact', '#contact'],
];

export default function Header() {
  const { loco, ready } = useSite();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = () => setTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date()));
    fmt();
    const id = setInterval(fmt, 20000);
    let last = window.scrollY;
    const onScroll = () => { const y = window.scrollY; setHidden(y > last && y > 160); last = y; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearInterval(id); window.removeEventListener('scroll', onScroll); };
  }, []);

  // lock page scroll while the menu is open
  useEffect(() => {
    if (!loco?.lenisInstance || !ready) return;
    open ? loco.lenisInstance.stop() : loco.lenisInstance.start();
  }, [open, loco, ready]);

  const go = (href) => {
    setOpen(false);
    setTimeout(() => loco?.scrollTo(href, { offset: -20, duration: 1.6 }), 50);
  };

  return (
    <>
      <header className={`header ${hidden && !open ? 'is-hidden' : ''}`}>
        <a href="#top" className="header__logo" onClick={(e) => { e.preventDefault(); go(0); }} aria-label="Sourabh Soni — back to top">
          Sourabh<i>.</i>
        </a>
        <p className="header__status mono"><span className="dot" /> Available for work · {profile.location} · {time} IST</p>
        <Magnetic strength={0.25}>
          <button className="header__menu" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu">
            <span>{open ? 'Close' : 'Menu'}</span><i className={open ? 'is-open' : ''} />
          </button>
        </Magnetic>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav id="menu" className="menu" aria-label="Primary"
            initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
            <ul>
              {links.map(([label, href], i) => (
                <li key={href}>
                  <motion.a href={href} onClick={(e) => { e.preventDefault(); go(href); }}
                    initial={{ y: '110%' }} animate={{ y: 0, transition: { delay: 0.25 + i * 0.07, duration: 0.9, ease: [0.19, 1, 0.22, 1] } }} exit={{ y: '110%' }}>
                    <span className="mono">0{i + 1}</span>{label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <div className="menu__foot mono">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
