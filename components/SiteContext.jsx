'use client';
import { createContext, useContext } from 'react';

// stage: WebGL engine · loco: Locomotive Scroll (Lenis inside) · ready: preloader finished · noGL: WebGL unavailable
export const SiteCtx = createContext({ stage: null, loco: null, ready: false, noGL: false });
export const useSite = () => useContext(SiteCtx);
