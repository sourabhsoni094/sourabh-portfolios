# Sourabh Soni — Portfolio (Next.js)

Awwwards-style landing page: WebGL shader background, GLSL image/cover planes, smooth scroll, pinned horizontal timeline, custom cursor.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
Deploy: push to GitHub and import the repo in Vercel (zero config).

## Stack
| Tool | Used for |
|---|---|
| Next.js 14 (App Router) | structure, SSR shell, fonts via Fontsource |
| SCSS | tokens, mixins, partials in `styles/` |
| Three.js + GLSL | `lib/gl/` — one fixed canvas: noise background + planes that track DOM elements |
| Locomotive Scroll v5 (Lenis inside) | smooth scroll, `data-scroll` reveals & parallax |
| GSAP + ScrollTrigger | preloader, scrubbed text, pinned horizontal section, marquees, magnetic buttons |
| Framer Motion | hero letters, menu, project modal, custom cursor springs |

> Locomotive Scroll v5 *is* built on Lenis, so Lenis is the single scroll engine (`loco.lenisInstance`). Running Lenis separately next to it would make two scrollers fight.

## Where to edit
- Content: `lib/data.js` (projects, experience, skills, contact)
- Photo: `public/images/portrait.jpg`
- Colours / fonts: `styles/abstracts/_variables.scss`
- Shaders: `lib/gl/shaders.js`
- Add real project screenshots: pass `src="/images/xyz.jpg"` to `<GLImage>` in `components/Work.jsx` — it gets the same hover/scroll shader effects.

## Performance & accessibility
- Pixel ratio capped (1.5 for the heavy background) and auto-lowered if FPS < ~38.
- `prefers-reduced-motion`: no smooth scroll, static shaders, transitions off.
- WebGL fallback: plain image/gradient if the context can't be created.
- Semantic HTML, keyboard-friendly modal (Esc), skip link, focus outlines.
