# Redmelon

Redmelon 0.2: the Phase 1 single-page site, built from `REDMELON-MASTER-BUILD-SPEC.md` (v1.0, 5 Oct 2026).

**One message:** AI does the volume. A senior lead is involved in every stage and makes every final decision.

## Preview

Serve this folder with any static HTTP server. There is no build step.

```sh
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Where to edit

| Change | File |
|---|---|
| Colours, fonts, sizes, radii, easing, durations | `css/tokens.css` (the only place hex values live) |
| Lists of copy: services, steps, tiles, FAQ, logos, WhatsApp flow | `js/data.js` |
| Site switches: review mode, WhatsApp number, form endpoint | `RM.CONFIG` in `js/data.js` |
| Headings, ledes and section copy | `index.html` |
| One section's styling | `css/sections/<section>.css` |
| Scroll animation, pins and scrubs | `js/motion.js` |

## Before launch

1. Fill every `[NEED: ...]` placeholder. They show as dashed red boxes.
2. Set `REVIEW_MODE: false`. Selected work, Voices and the WhatsApp widget then hide until their own switches (`SHOW_WORK`, `SHOW_VOICES`, `WHATSAPP_NUMBER`) are set.
3. Set `FORM_ENDPOINT`. Until it's set, submissions are simulated and logged to the console.
4. Export the OG image to `assets/og.png` and confirm the canonical domain.

## Stack

GSAP 3.13 (ScrollTrigger, SplitText, CustomEase) and Lenis 1.3, loaded from jsDelivr. The page stays fully readable and usable if either fails to load, and under reduced motion.
