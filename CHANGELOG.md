# Changelog

## v2.0 (in progress)
- Multi-page site: Home, Services, Clients, Work, About, Contact. The home page becomes a short story; the details move to their own pages.
- Repo cleaned: old archived sections and unused section styles (problem, process) removed from the working site. They remain in `versions/v1.0-single-page/`.
- 13 Oct, first build of the six pages:
  - **Home** (`index.html`): hero, logo wall, the big idea, the six service cards, two work items, an industries strip, the Studio band and a closing call-to-action band.
  - **Services** (`services.html`): the pinned switcher with all five canvas animations, Studio, How we work, Start here.
  - **Clients** (`clients.html`): logo wall, the industries explorer, testimonials (placeholders).
  - **Work** (`work.html`): all projects. **About** (`about.html`): photos, four beliefs (draft copy), team (roles only, placeholders).
  - **Contact** (`contact.html`): the three-step brief, email, LinkedIn and markets, then the FAQ.
  - Shared: nav marks the current page; full-screen menu on phones; one footer; a soft cross-fade between pages.
  - Work page: tag filter strip (All, Website, E-commerce, Product design, Brand identity, Education, Retail, Energy). One tag at a time, animated, with a live project count; `work.html?tag=retail` opens filtered. Tags also show on each project card. Edit tags in `RM.WORK` / `RM.WORK_TAGS` in `js/data.js`.
  - 14 Oct: client list updated from the logo sheet: 35 brands on the logo wall (Home and Clients), grouped by industry in `RM.LOGOS`; industries explorer "Worked with" lines now name real clients. Marquee speed stays the same per name.
  - 14 Oct: project detail template (`project.html?p=<slug>`), modelled on the Brightter case-study layout: breadcrumb, tags, title, summary, meta row (client, industry, services, year, timeline, platform, live-site button), cover, challenge / approach / outcome, gallery, scope, client quote, more work, next project, CTA. Work cards open it. Data goes in a `detail` block on each project in `RM.WORK`; missing fields show as [NEED] placeholders in review mode and hide in production.
  - 14 Oct: industries explorer redesigned as a client logo board. Hovering (or tapping) an industry shows its clients as tiles in brand colour, with a client count and a call-to-action. Nine industries now (added Healthcare & wellness, Technology & telecom, Advertising, media & events) so every client has a home. Each client's industry is the `ind` field in `RM.LOGOS`; add `logo: 'assets/logos/x.svg'` to show a logo file instead of the name.
  - Links to a section on another page are routed automatically (`#contact` → `contact.html`, `#svc-03` → `services.html#svc-03`, `#ind-energy` → `clients.html#ind-energy`).

## v1.0 (13 Oct 2026), single-page site, frozen in `versions/v1.0-single-page/`
- Hero, logo wall and stats, the big idea scroll story, six services with a pinned switcher and five scroll-driven canvas animations (AI strategy roadmap, AI experience checkpoint, AI engineering observable, agentic AI loop with approval, AI automation before/after).
- How we work timeline, Redmelon Studio with the showreel, industries explorer, selected work, about, start-here tiles, FAQ, three-step contact form.
- Light and dark themes, a single orange accent, Hugeicons, WhatsApp button. Optional UI sounds, switched off.

## v0.2 (29 Sep 2026)
- Early single-page build from `REDMELON-MASTER-BUILD-SPEC.md`.
