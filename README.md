# Redmelon

**Current work: Redmelon v2.0 (in progress)**, the multi-page site: Home, Services, Clients, Work, About and Contact.

## Versions

| Version | What it is | Where to find it |
|---|---|---|
| **v2.0** (in progress) | Multi-page site. Home tells a short story; the details move to their own pages. | The project root (this folder) |
| **v1.0** (13 Oct 2026) | Single-page site with all sections, the five scroll-driven service animations, the industries explorer and the studio showreel. | `versions/v1.0-single-page/` (frozen copy, open its `index.html`), Git tag `v1.0` |
| v0.2 (29 Sep 2026) | Early single-page build from `REDMELON-MASTER-BUILD-SPEC.md` (v1.0, 5 Oct 2026). | Git tag `v0.2` |

How versions work:

- Work always happens in the project root.
- When a version is signed off, it is frozen: a copy goes into `versions/vX.Y-short-name/` and the same commit is tagged `vX.Y`. Frozen copies are never edited.
- Names follow `vMAJOR.MINOR`: a new major number for a new site structure, a new minor number for a round of changes on the same structure.

**One message:** AI does the volume. A human expert is involved in every stage and makes every final decision.

## Preview

Serve this folder with any static HTTP server. There is no build step.

```sh
python3 -m http.server 4173
```

Then open http://localhost:4173 (Home). The other pages are `services.html`, `clients.html`, `work.html`, `about.html` and `contact.html`.

## Where to edit

| Change | File |
|---|---|
| Colours, fonts, sizes, radii, easing, durations | `css/tokens.css` (the only place hex values live) |
| Lists of copy: services, steps, tiles, FAQ, logos, WhatsApp flow | `js/data.js` |
| Site switches: review mode, WhatsApp number, form endpoint | `RM.CONFIG` in `js/data.js` |
| Headings, ledes and section copy | the page it sits on: `index.html`, `services.html`, `clients.html`, `work.html`, `about.html`, `contact.html` |
| Nav, phone menu and footer | repeated in all six pages; change all six together |
| Which page a `#section` link goes to | `RM.ROUTES` in `js/core.js` |
| Beliefs, team, testimonials | `RM.BELIEFS`, `RM.LEADS`, `RM.QUOTES` in `js/data.js` |
| New v2.0 pieces (page header, menu, CTA band, strips) | `css/sections/pages.css` |
| What changed in each version | `CHANGELOG.md` |
| One section's styling | `css/sections/<section>.css` |
| Scroll animation, pins and scrubs | `js/motion.js` |

## Before launch

1. Fill every `[NEED: ...]` placeholder. They show as dashed red boxes.
2. Set `REVIEW_MODE: false`. Selected work, Voices and the WhatsApp widget then hide until their own switches (`SHOW_WORK`, `SHOW_VOICES`, `WHATSAPP_NUMBER`) are set.
3. Set `FORM_ENDPOINT`. Until it's set, submissions are simulated and logged to the console.
4. Export the OG image to `assets/og.png` and confirm the canonical domain.

## Stack

GSAP 3.13 (ScrollTrigger, SplitText, CustomEase) and Lenis 1.3, loaded from jsDelivr. The page stays fully readable and usable if either fails to load, and under reduced motion.
