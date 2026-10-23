'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Stage } from '@/lib/gl/stage';
import { SiteCtx } from './SiteContext';
import Preloader from './Preloader';
import Header from './Header';
import Cursor from './Cursor';

export default function Site({ children }) {
  const canvasRef = useRef(null);
  const [stage, setStage] = useState(null);
  const [loco, setLoco] = useState(null);
  const [ready, setReady] = useState(false);
  const [noGL, setNoGL] = useState(false);

  // 1 — WebGL stage, ticked by gsap so everything shares one clock
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let s;
    try { s = new Stage(canvasRef.current, { reduced }); } catch (e) { setNoGL(true); return; }
    const tick = (time, dt) => s.update(time, dt);
    gsap.ticker.add(tick);
    setStage(s);
    return () => { gsap.ticker.remove(tick); s.destroy(); setStage(null); };
  }, []);

  // 2 — Locomotive Scroll v5 (powered by Lenis) wired into the GSAP ticker + ScrollTrigger
  useEffect(() => {
    let l, dead = false;
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    (async () => {
      const { default: LocomotiveScroll } = await import('locomotive-scroll');
      if (dead) return;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.ticker.lagSmoothing(0);
      l = new LocomotiveScroll({
        lenisOptions: { lerp: reduced ? 1 : 0.085, smoothWheel: !reduced },
        scrollCallback: () => ScrollTrigger.update(),
        initCustomTicker: (render) => gsap.ticker.add(render),
        destroyCustomTicker: (render) => gsap.ticker.remove(render),
      });
      l.lenisInstance.stop(); // locked until the preloader is done
      document.documentElement.classList.add('js-ready');
      setLoco(l);
    })();
    return () => { dead = true; l?.destroy(); setLoco(null); document.documentElement.classList.remove('js-ready'); };
  }, []);

  // 3 — when the preloader finishes: unlock scroll, start the WebGL reveals, refresh triggers
  useEffect(() => {
    if (!ready) return;
    if (stage) stage.started = true;
    loco?.lenisInstance?.start();
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onOrient = () => setTimeout(() => ScrollTrigger.refresh(), 200);
    window.addEventListener('orientationchange', onOrient);
    return () => {
      clearTimeout(t);
      window.removeEventListener('orientationchange', onOrient);
    };
  }, [ready, stage, loco]);

  return (
    <SiteCtx.Provider value={{ stage, loco, ready, noGL }}>
      <a className="skip" href="#work">Skip to work</a>
      <canvas ref={canvasRef} className="webgl" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Preloader onStart={() => setReady(true)} />
      <Header />
      <main>{children}</main>
    </SiteCtx.Provider>
  );
}
