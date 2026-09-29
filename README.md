# Redmelon

Phase 1 single-page website for Redmelon: AI engineering with human judgement.

## Preview

Serve this directory with any static HTTP server, for example:

```sh
python -m http.server 4173
```

Open http://localhost:4173. No build step is required.

## Editing

- Content and Human/AI percentages: `js/data.js`
- Theme and typography tokens: `css/tokens.css`
- Visual styling: `css/experience.css`
- Smooth scrolling and desktop parallax: `js/scroll.js`
- Preloader and interactions: `js/experience.js`

Includes light/dark themes, responsive layouts, a supplied SVG logo, keyboard-accessible engagement tabs, and lazy-loaded decorative canvases. GSAP 3.13.0 and its plugins are bundled under `js/vendor` with their original license headers. Reduced-motion preferences and the motion toggle restore native scrolling.

## Preview limitations

The contact form does not send submissions. Email/WhatsApp details and client-name permissions require confirmation before launch.
