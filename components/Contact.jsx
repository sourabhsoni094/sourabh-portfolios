'use client';
import { useState } from 'react';
import { useSite } from './SiteContext';
import Reveal from './Reveal';
import Magnetic from './Magnetic';
import { profile } from '@/lib/data';

export default function Contact() {
  const { loco } = useSite();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch {}
  };

  return (
    <section id="contact" className="contact">
      <p className="eyebrow mono" data-scroll>( Contact )</p>
      <Reveal as="h2" className="contact__title" lines={['Let’s build', 'something', 'great.']} />

      <div className="contact__row">
        <Magnetic strength={0.4}>
          <a className="contact__cta" href={`mailto:${profile.email}`} data-cursor="Say hi"><span>Get in touch</span></a>
        </Magnetic>
        <div className="contact__links">
          <a className="roll" href={`mailto:${profile.email}`}><span data-text={profile.email}>{profile.email}</span></a>
          <button className="mono link" onClick={copy} aria-live="polite">{copied ? 'Copied ✓' : 'Copy email'}</button>
          <a className="roll" href={`tel:${profile.phone.replace(/\s/g, '')}`}><span data-text={profile.phone}>{profile.phone}</span></a>
          <div className="contact__social mono">
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
        </div>
      </div>

      <footer className="footer mono">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Next.js · GSAP · Three.js · Framer Motion · Locomotive + Lenis</span>
        <button className="link" onClick={() => loco?.scrollTo(0, { duration: 2 })}>Back to top ↑</button>
      </footer>
    </section>
  );
}
