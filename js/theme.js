/* Redmelon v0.2 — Shared flags and theme. Loads first; everything downstream reads RM / M / ANIM / root. */
/* Shared flags + theme. Loaded first: everything else reads RM / M / ANIM / root
   and a module repaints on theme change by assigning onTheme. */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const M = window.Motion || {};
const ANIM = !!(window.gsap && window.ScrollTrigger) && !RM;
// Reveals animate from visible content after the intro; never hide fallback copy.

/* ---------------- theme ---------------- */
var onTheme = function(){};          /* replaced once the WebGL hero exists */
const root = document.documentElement;
let theme = 'dark';
try { const s = localStorage.getItem('rm_ui'); if (s === 'light' || s === 'dark') theme = s; } catch (e) {}
function applyTheme(t, animate) {
  theme = t;
  const set = () => { if (t === 'light') root.setAttribute('data-ui','light'); else root.removeAttribute('data-ui'); onTheme(); };
  if (animate && document.startViewTransition && !RM) document.startViewTransition(set); else set();
  try { localStorage.setItem('rm_ui', t); } catch (e) {}
}
applyTheme(theme, false);
document.getElementById('tgl').addEventListener('click', () => applyTheme(theme === 'light' ? 'dark' : 'light', true));
