'use client';
import { useEffect, useRef } from 'react';
import { Media } from '@/lib/gl/media';
import { useSite } from './SiteContext';

// A DOM box that gets painted by WebGL. Falls back to a plain image / gradient when WebGL is unavailable.
export default function GLImage({ src, palette, seed = 0, label, className = '', delay = 0, ...rest }) {
  const ref = useRef(null);
  const { stage, noGL } = useSite();

  useEffect(() => {
    if (!stage) return;
    const m = new Media(stage, ref.current, { src, palette, seed, delay });
    return () => m.destroy();
  }, [stage, src, seed, delay, palette]);

  const fallback = noGL
    ? { background: src ? `center / cover url(${src})` : `linear-gradient(135deg, ${palette?.join(', ')})` }
    : undefined;
  return <div ref={ref} className={`gl-media ${className}`} role="img" aria-label={label} style={fallback} {...rest} />;
}
