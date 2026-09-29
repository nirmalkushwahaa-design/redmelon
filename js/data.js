/* Redmelon v0.2 — All copy and content. Text edits touch only this file. */
/* ---------------- content ---------------- */
/* Logo wall. { n: name, v: figure, l: what it measures, up: true when a
   rising number is the win }

   ⚠ THE FIGURES ARE PLACEHOLDERS — invented, not measured, and not cleared by
   any client. They must be replaced with real numbers or the hover stat must be
   removed before launch. See PRD.md §7. */
const WALL = ['Mondelez','DBS Bank','Ford','Ogilvy','GridCrest'].map(n => ({n}));
/* Icons: Hugeicons Free (Stroke Rounded), MIT licensed.
   Copyright (c) Hugeicons — https://hugeicons.com
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction. The above copyright notice and this
   permission notice shall be included in all copies or substantial portions of
   the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

   24x24 grid. Each body carries its own stroke-width and stroke:currentColor,
   so colour is set with `color:` on the wrapper, never `stroke:`. */
const ICONS = {
  /* workflow */
  agent:'<g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 19c0-.465 0-.698.051-.888a1.5 1.5 0 0 1 1.06-1.06C4.304 17 4.536 17 5 17h3c.465 0 .697 0 .888.051a1.5 1.5 0 0 1 1.06 1.06c.052.191.052.424.052.889s0 .698-.051.888a1.5 1.5 0 0 1-1.06 1.06C8.696 21 8.464 21 8 21H5c-.465 0-.697 0-.888-.051a1.5 1.5 0 0 1-1.06-1.06C3 19.697 3 19.464 3 19ZM14 5c0-.465 0-.697.051-.888a1.5 1.5 0 0 1 1.06-1.06C15.303 3 15.536 3 16 3h3c.465 0 .698 0 .888.051a1.5 1.5 0 0 1 1.06 1.06C21 4.304 21 4.536 21 5s0 .697-.051.888a1.5 1.5 0 0 1-1.06 1.06C19.697 7 19.464 7 19 7h-3c-.465 0-.697 0-.888-.051a1.5 1.5 0 0 1-1.06-1.06C14 5.696 14 5.464 14 5Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h-.5a3.5 3.5 0 0 1 0-7H14m-4 14h5.5a3.5 3.5 0 0 0 0-7H15"/><path stroke-linejoin="round" d="M10.633 10.467c.644-.645.966-.967 1.367-.967c.4 0 .723.322 1.367.967l.166.166c.645.644.967.967.967 1.367s-.322.723-.967 1.367l-.166.166c-.644.645-.967.967-1.367.967s-.723-.322-1.367-.967l-.166-.166C9.822 12.723 9.5 12.401 9.5 12c0-.4.322-.723.967-1.367z"/></g>',
  /* ai-chip */
  chip:'<g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M18.828 18.828C17.657 20 15.771 20 12 20s-5.657 0-6.828-1.172S4 15.771 4 12s0-5.657 1.172-6.828S8.229 4 12 4s5.657 0 6.828 1.172S20 8.229 20 12s0 5.657-1.172 6.828M8 2v2m8-2v2m-4-2v2M8 20v2m4-2v2m4-2v2m6-6h-2M4 8H2m2 8H2m2-4H2m20-4h-2m2 4h-2"/><path d="M11.48 7.862a.554.554 0 0 1 1.04 0l.8 2.163c.112.303.352.543.655.655l2.163.8a.554.554 0 0 1 0 1.04l-2.163.8a1.1 1.1 0 0 0-.655.655l-.8 2.163a.554.554 0 0 1-1.04 0l-.8-2.163a1.1 1.1 0 0 0-.655-.655l-2.163-.8a.554.554 0 0 1 0-1.04l2.163-.8a1.11 1.11 0 0 0 .655-.655z"/></g>',
  /* layout-01 */
  panel:'<g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.891 20.109C2.5 18.717 2.5 16.479 2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391"/><path d="M2.5 9h19M8 21.5V9"/></g>',
  /* video-replay */
  play:'<g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="round" d="M17.7 21.335c-1.172.165-2.7.165-4.75.165h-1.9c-4.03 0-6.046 0-7.298-1.252S2.5 16.98 2.5 12.95v-1.9c0-4.03 0-6.046 1.252-7.298S7.02 2.5 11.05 2.5h1.9c4.03 0 6.046 0 7.298 1.252S21.5 7.019 21.5 11.05v1.9c0 1.208 0 2.235-.034 3.115c-.027.705-.04 1.057-.307 1.19c-.267.13-.566-.08-1.163-.503L18.65 15.8"/><path d="M14.945 12.395c-.176.627-1.012 1.07-2.682 1.955c-1.615.856-2.422 1.285-3.073 1.113a1.66 1.66 0 0 1-.712-.393C8 14.62 8 13.746 8 12s0-2.62.478-3.07c.198-.186.443-.321.712-.392c.65-.173 1.458.256 3.073 1.112c1.67.886 2.506 1.329 2.682 1.955c.073.259.073.531 0 .79Z"/></g>',
  /* hierarchy-square-01 */
  orchestrate:'<g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 19.5h-1c-2.828 0-4.243 0-5.121-.879C7 17.743 7 16.328 7 13.5v-2M7 8v3.5m0 0h7"/><path d="M14 11.5c0-1.178 0-1.768.351-2.134C14.704 9 15.27 9 16.4 9h1.2c1.131 0 1.697 0 2.048.366c.352.366.352.956.352 2.134s0 1.768-.352 2.134c-.35.366-.917.366-2.048.366h-1.2c-1.131 0-1.697 0-2.048-.366C14 13.268 14 12.678 14 11.5Zm0 8c0-1.178 0-1.768.351-2.134C14.704 17 15.27 17 16.4 17h1.2c1.131 0 1.697 0 2.048.366c.352.366.352.956.352 2.134s0 1.768-.352 2.134c-.35.366-.917.366-2.048.366h-1.2c-1.131 0-1.697 0-2.048-.366C14 21.268 14 20.678 14 19.5ZM5.286 2h3.428C10.79 2 11 3.11 11 5s-.211 3-2.286 3H5.286C3.21 8 3 6.89 3 5s.211-3 2.286-3Z"/></g>',
  /* database-search */
  data:'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="m22 21l-1.875-1.875M21 17a3 3 0 1 1-6 0a3 3 0 0 1 6 0"/><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 12c0 1.53 3.054 2.792 7 2.977"/><path d="M12 22c-4.418 0-8-1.343-8-3V5m16 0v5"/></g>',
  /* artboard-tool */
  design:'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path stroke-linejoin="round" d="M9 7h6c3.3 0 4.95 0 5.975 1.025S22 10.7 22 14v1c0 3.3 0 4.95-1.025 5.975S18.3 22 15 22h-1c-3.3 0-4.95 0-5.975-1.025S7 18.3 7 15V9"/><path d="M2 7h3m2-2V2"/></g>',
  /* source-code */
  engine:'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m17 8l1.84 1.85c.773.778 1.16 1.167 1.16 1.65s-.387.872-1.16 1.65L17 15M7 8L5.16 9.85C4.387 10.628 4 11.017 4 11.5s.387.872 1.16 1.65L7 15m7.5-11l-5 16"/>',
  /* camera-video */
  media:'<g fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 21.5l4-4m2 0l4 4m-5-4v5"/><path d="M2 11.875c0-2.062 0-3.094 1.025-3.734S5.7 7.5 9 7.5h1c3.3 0 4.95 0 5.975.64C17 8.782 17 9.814 17 11.876v1.25c0 2.062 0 3.094-1.025 3.734S13.3 17.5 10 17.5H9c-3.3 0-4.95 0-5.975-.64C2 16.218 2 15.186 2 13.124z"/><path stroke-linecap="round" d="m17 10.25l.126-.076c2.116-1.27 3.174-1.904 4.024-1.598c.85.307.85 1.323.85 3.355v1.138c0 2.032 0 3.048-.85 3.355s-1.908-.329-4.024-1.598L17 14.75"/><circle cx="12.5" cy="5" r="2.5"/><circle cx="7" cy="4.5" r="3"/></g>',
  /* handshake */
  partner:'<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M14.5 8.5c-.867.433-3.388 1.167-5.868 1.094c-.652-.02-1.132-.579-1.132-1.23c0-.525.31-1 .78-1.231a128 128 0 0 0 3.99-2.074c.853-.461 1.28-.692 1.603-.8c.865-.293 1.562-.304 2.437-.04c.326.099.718.295 1.502.687l.905.452c.071.036.107.054.144.069a1 1 0 0 0 .296.07c.04.003.08.003.16.003c.635 0 .953 0 1.213.071a2 2 0 0 1 1.398 1.398c.072.26.072.578.072 1.214v5.53c0 .71-.576 1.287-1.286 1.287a.64.64 0 0 0-.385.128l-.329.246c-.693.52-1.04.78-1.438.931a3 3 0 0 1-.229.076c-.408.119-.841.119-1.708.119H14"/><path d="m14.5 8.499l3.071 3.478a1.448 1.448 0 0 1-2.095 1.998c.553.553.576 1.472.024 2.024a1.414 1.414 0 0 1-2 0l-.5-.5a1.414 1.414 0 1 1-2 2a1.414 1.414 0 0 1 0 2l-.06.06a1.5 1.5 0 0 1-1.061.44H9.75c-.48 0-.94-.19-1.28-.53l-4.056-4.056a1.4 1.4 0 0 0-1-.414A1.414 1.414 0 0 1 2 13.585V9.499c0-1.886 0-2.828.586-3.414S4.114 5.499 6 5.499h5"/></g>',
  /* arrow-up-02 */
  up:'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 5.5V19m6-8s-4.419-6-6-6s-6 6-6 6"/>',
  /* arrow-down-02 */
  down:'<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18.502v-13.5m6 8s-4.419 6-6 6s-6-6-6-6"/>'
};
/* [number, icon, title, body, where the person holds the decision] */
const OUTCOMES = [
 ['01','agent','Agentic systems','Multi-agent workflows that run the operational work your team does by hand — intake, review, routing, assembly.','Person approves'],
 ['02','chip','AI engineering','Custom LLM, RAG and data systems built against your own corpus, inside your own boundary.','Person owns the boundary'],
 ['03','panel','Enterprise UX','The review, override and escalation interfaces that decide whether a system gets trusted or quietly bypassed.','Person can overrule'],
 ['04','play','Production &amp; media','AI-assisted video, motion and creative systems — campaign volume on a brand you keep control of.','Person signs off']
];
const MOVES = [
 { k:'frame', n:'01', t:'Frame', chk:'You confirm what actually matters.',
   sub:'We come back with what we found and what we think is worth your money. You cut it down.' },
 { k:'draft', n:'02', t:'Draft', d:'AI generates working options instead of decks. Real prototypes, real pages, real cuts. Volume is cheap now, so we show you three rather than describe one.',
   chk:'You choose the direction.', sub:'You react to something running, not to a slide about something running.' },
 { k:'build', n:'03', t:'Build', d:'AI does the repetitive mass — the scaffolding, the variants, the tests. We do architecture, taste, and the calls that carry risk.',
   chk:'You sign off what ships.', sub:'Nothing reaches your users that a person here has not looked at and put their name to.' },
 { k:'prove', n:'04', t:'Prove', chk:'', sub:'' }
];
const MODES = {
  // Client-supplied AI percentages; human contribution is the remainder to 100%.
  scratch: {
    label:'Start from nothing',
    ai:{frame:75,draft:65,build:55,prove:45},
    frame:'AI reads the market, the competitor set and whatever brief exists, and maps the territory in days. No discovery phase, no workshop theatre.',
    prove:'It goes live, we measure it against what Frame said would change, and ownership moves to you — documentation, tests and training material included.',
    proveChk:'You decide whether it worked — then you own it.',
    proveSub:'The handover is the deliverable, not an afterthought bolted on at the end.'
  },
  existing: {
    label:'Improve what exists',
    ai:{frame:85,draft:70,build:55,prove:50},
    frame:'AI reads what you already have — the codebase, the analytics, the support tickets, the session recordings, the competitor set — and shows where value is actually leaking. More to read than a blank page, which is why this is the move AI earns its keep on.',
    prove:'It ships against the baseline Frame established. The question is not whether it launched, it is whether the number moved.',
    proveChk:'You decide whether the delta was worth it, and whether there is a next lap.',
    proveSub:'If it did not move, we say so. That is the point of measuring rather than announcing.'
  },
  product: {
    label:'Run it with us',
    ai:{frame:80,draft:65,build:60,prove:50},
    frame:'Each lap starts by reading what changed since the last one: usage, tickets, the market, what competitors shipped. Continuous input, not a one-off audit.',
    prove:'Measured, then straight back into Frame. Nothing accumulates as unexamined debt because every lap ends with evidence.',
    proveChk:'You decide what ships, every lap.',
    proveSub:'You can still take the exit at any lap — the handover is always on the table, never a negotiation.'
  }
};
let MODE = 'existing';
/* [number, icon, title, body, 'quiet' to mark it as by-introduction] */
const CAPS = [
 ['01','orchestrate','Agentic AI &amp; orchestration','Agent design, tool use, memory, failure handling and the supervision model. Framework-agnostic — we pick for your stack, not our preference.',''],
 ['02','data','LLM, RAG &amp; data platforms','Retrieval that cites its sources, evaluation you can show someone, and deployment inside your boundary when the data cannot leave it.',''],
 ['03','design','Product design &amp; design systems','Human-in-the-loop flows, component libraries, and developer handoff specs your team can actually extend.',''],
 ['04','engine','Software &amp; platform engineering','The unglamorous half of every AI programme. APIs, pipelines, integration into core systems, and modernising whatever the AI has to talk to.',''],
 ['05','media','Digital production &amp; media','AI-assisted video, motion and creative systems, with the brand guardrails that keep volume from becoming noise.',''],
 ['06','partner','Partner delivery','We also work as a delivery pod inside agencies and consultancies, under their brand. By introduction.','quiet']
];
const WA_FLOW = {
  hello: { msg:"Hi 👋 I'm the Redmelon assistant. What brings you here?",
    opts:[['What do you do?','what'],['Can you help with my project?','fit'],['How do we start?','start'],['Something else','else']] },
  what: { msg:"We build AI systems and the interfaces around them — agentic workflows, LLM and RAG platforms, enterprise UX, and digital production. Every engagement runs the same four-move model, and a person holds every decision that carries risk.",
    opts:[['Can you help with my project?','fit'],['How do we start?','start'],['Talk to a human','human']] },
  fit: { msg:"Almost certainly worth a conversation — but that's a question for a person, not a bot. The short version: if a process is slow, expensive or judgement-heavy, it's usually a candidate.",
    opts:[['How do we start?','start'],['Talk to a human','human']] },
  start: { msg:"A 30-minute call. No deck — we ask about the process you want to change and tell you straight whether it's worth building. You can book a slot or send a brief.",
    opts:[['Book a call','book'],['Send a brief','brief'],['Talk to a human','human']] },
  else: { msg:"That one's beyond me — but a person can answer it properly. Message us on WhatsApp, or send a brief and we'll come back within a business day.",
    opts:[['Talk to a human','human'],['Send a brief','brief']] },
  human: { msg:"WhatsApp is not connected in this preview. You can prepare a project brief below; live contact details will be added before launch.",
    opts:[['Send a brief instead','brief'],['Start over','start_over']] }
};

const EXPERIENCE = {
  headlineLead:'AI that ships.',headlineMiddle:'Judgement that',headlineEnd:'stays human.',
  introLabel:'INTELLIGENCE, WITH INTENTION.',
  heroEyebrow:'Independent minds. Intelligent systems.',
  heroEdition:'AI-FIRST PRODUCT & ENGINEERING',
  heroBody:'We turn complex challenges into intelligent products, agentic workflows and experiences people trust. Built with AI. Owned by people.',
  heroCta:'Let’s build what’s next',
  heroSecondary:'Explore our approach',
  artTitle:'THE HUMAN IN THE LOOP',
  artHint:'Drag to explore',
  scrollLabel:'Scroll to discover',
  heroFooter:'Strategy. Engineering. Experience. One accountable team.',
  outcomePrompt:'Have a challenge that doesn’t fit a box?',
  outcomeLink:'Let’s figure it out together ↗',
  modeHint:'Three ways to start. The same four checkpoints. Swipe to explore.',
  formNotice:'Preview form — submissions are not sent yet.',
  formTitle:'Your brief is ready.',
  formResult:' — this is a preview. Your brief has not been sent. Live delivery will be connected before launch.',
  checkpoint:'Human checkpoint',
  splitTitle:'Human × AI',splitNote:'Contribution split',humanLabel:'Human',aiLabel:'AI',
  roles:['Understand the challenge','Explore the possibilities','Make it work','Measure what changed'],
  motionPause:'Pause motion',motionResume:'Resume motion'
};
