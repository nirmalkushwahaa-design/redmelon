/* =====================================================================
   DATA · every copy-driven list, the WhatsApp flow and site config.
   Edit content here; the layout files never need to change for copy.
   Placeholder content is marked PLACEHOLDER in comments; swap in real copy before launch.
   ===================================================================== */
window.RM = window.RM || {};

RM.CONFIG = {
  /* Review build: shows Selected work, Voices and the WhatsApp widget with
     placeholders. Set to false for production; empty blocks then hide. */
  REVIEW_MODE: true,
  SHOW_WORK: true,       /* real projects are in WORK */
  SHOW_VOICES: false,    /* production: true once quotes or lead profiles exist */
  WHATSAPP_NUMBER: '',   /* digits only with country code, e.g. '447700900000' */
  FORM_ENDPOINT: '',     /* email service, CRM or Google Sheet. Empty = simulate */
  CONTACT_EMAIL: 'hello@redmelondesign.com',   /* PLACEHOLDER: confirm */
  QUOTE_INTERVAL: 7000
};

/* A/B test copy (12.2). Swap HERO_H1 to test; the live H1 is in index.html. */
RM.AB = {
  HERO_H1_A: 'AI at scale. Humans in charge.',
  HERO_H1_B: 'Your AI pilot works in the demo. We make it work in the business.'
};

/* 12.3 · logo wall. Brand colours are third-party and live here, not in tokens. */
/* Hover stats (restored from the first draft). { v: figure, l: what it measures,
   up: true when a rising number is the win }.
   THE FIGURES ARE PLACEHOLDERS from the first draft: not measured and not cleared
   by any client. Replace with real numbers, or set v to '' to hide a stat. */
RM.LOGOS = [
  /* Client list from the logo sheet (14 Oct), grouped by industry. Names show in brand colour
     (color = light mode, dark = dark mode; '' = neutral). Only the five first-draft entries carry hover stats. */
  /* engineering, infrastructure and building materials */
  { name: 'L&T',               color: '#1D4F91', dark: '#6E9BE0' },
  { name: 'JSW',               color: '#1F3C88', dark: '#6D8DE0' },
  { name: 'UltraTech Cement',  color: '#A07F00', dark: '#FFD200' },
  { name: 'NITCO',             color: '',        dark: '' },
  { name: 'Hager',             color: '#2D8CC4', dark: '#5BB8EA' },
  { name: 'Coromandel',        color: '#D9790F', dark: '#FFA940' },
  /* energy and utilities */
  { name: 'Torrent Power',     color: '#D9790F', dark: '#F7A04B' },
  { name: 'Mahesh Gas',        color: '#2E3192', dark: '#8A8EF0' },
  { name: 'GridCrest',         color: '',        dark: '',        v: '35%',  l: 'shorter handover',        up: false },
  /* automotive */
  { name: 'Tata Motors',       color: '#1F5BA8', dark: '#5C95E6' },
  { name: 'Ford',              color: '#003478', dark: '#1C7EFF', v: '60%',  l: 'less manual QA',          up: false },
  { name: 'CarWale',           color: '#D0201A', dark: '#FF5148' },
  /* telecom */
  { name: 'Vodafone',          color: '#E60000', dark: '#FF3B3B' },
  /* banking, finance and professional services */
  { name: 'DBS Bank',          color: '#ED0000', dark: '#FF3333', v: '3×',   l: 'review throughput',       up: true  },
  { name: 'EY',                color: '#2E2E38', dark: '#FFE600' },
  { name: 'Centuro Global',    color: '#6B2C5F', dark: '#C982BC' },
  /* food and beverage, FMCG */
  { name: 'Mondelez',          color: '#502172', dark: '#A668D3', v: '40%',  l: 'faster asset turnaround', up: false },
  { name: 'Red Bull',          color: '#DB0A40', dark: '#FF4D73' },
  /* healthcare and pharma */
  { name: 'Johnson & Johnson', color: '#D51900', dark: '#FF4A33' },
  { name: 'Glenmark',          color: '#D7282F', dark: '#FF5A5F' },
  /* beauty */
  { name: "L'Oréal",      color: '',        dark: '' },
  /* fashion and apparel */
  { name: 'Raymond',           color: '#C8102E', dark: '#FF4560' },
  { name: 'Bestseller',        color: '',        dark: '' },
  { name: 'Vero Moda',         color: '',        dark: '' },
  /* health and fitness */
  { name: 'cure.fit',          color: '',        dark: '' },
  /* education and learning */
  { name: 'Ryan International', color: '#1C3F94', dark: '#6D8DE0' },
  { name: 'Vidyalankar',       color: '#D71920', dark: '#FF4B50' },
  { name: 'G-Cube',            color: '#D24A04', dark: '#FF7A3D' },
  /* technology */
  { name: 'U-TO Solutions',    color: '#1B75BB', dark: '#4FA3E6' },
  /* advertising, marketing and events */
  { name: 'Ogilvy',            color: '#E81F23', dark: '#EB4448', v: '2.5×', l: 'concepts per sprint',     up: true  },
  { name: 'Indigo Consulting', color: '#2A6EBB', dark: '#5FA0E8' },
  { name: 'Percept ICE',       color: '#D71E24', dark: '#FF5056' },
  { name: '70 Event Media Group', color: '#D9790F', dark: '#FFA940' },
  { name: 'The Big Small Events', color: '',     dark: '' },
  { name: 'vCloudx',           color: '#D62A43', dark: '#FF5C70' }
  /* not added (could not identify; confirm with Nirmal): the 'VIVCOOO' cloud logo and the dark square gold logo */
];

/* 12.3 · selected work. Image, client name, one plain line. */
RM.WORK = [
  { slug: 'iit-mumbai', client: 'IIT Mumbai',           line: 'A digital experience for a premier institute, showcasing its innovation, research and impact.', img: 'assets/img/work-iit.webp',
    tags: ['website', 'education'] },
  { slug: 'spaces', client: 'Spaces.in',            line: 'A modern, inspiring e-commerce experience for contemporary homes.',                            img: 'assets/img/work-spaces.webp',
    tags: ['website', 'ecommerce', 'retail'] },
  { slug: 'redmelon', client: 'Redmelon',             line: 'An AI-driven design studio for modern brands: our own identity and website.',                 img: 'assets/img/work-redmelon.webp',
    tags: ['brand', 'website'] },
  { slug: 'gridcrest', client: 'Gridcrest Technology', line: 'Website and product experience for a smarter, more connected grid.',                           img: 'assets/img/work-gridcrest.webp',
    tags: ['website', 'product', 'energy'],
    detail: { industry: 'Energy', services: ['Branding & Website Design'], year: '2026', duration: '20 Days', platform: 'PC',
      url: 'https://gridcrest.io/',
      challenge: 'Gridcrest Technology was ready to establish itself in the Indian energy market, but it had no brand identity and no website. Without them, the company had no clear way to introduce itself to customers and partners, or to stand out in a sector led by established names.',
      approach: 'We started with the Gridcrest team to agree the scope: what the brand needed to say, and which pages the website needed to carry it. With that settled, we created the brand identity and designed the website pages around it, delivering the full project in 20 days.',
      outcome: 'Gridcrest now has a consistent brand identity and a professional website. The company has a recognisable presence in the Indian energy market, and a credible place to send every customer and partner it meets.' } }
];

/* PROJECT DETAIL PAGE (project.html?p=<slug>): one template, filled from RM.WORK.
   Add a `detail` block to a project above when its data is ready. Every field is optional;
   a missing one shows as a dashed [NEED] placeholder in review mode, and in production the block hides.

   detail: {
     title:     'Headline for the case study',                  // falls back to the card line
     summary:   'Two or three sentences: what it is and why it mattered.',
     industry:  'Education',
     services:  ['Website', 'UX/UI design', 'Development'],
     year:      '2025',
     duration:  '12 weeks',
     platform:  'Webflow',
     url:       'https://example.com',                          // live site button
     cover:     'assets/img/work-x-cover.webp',                 // wide hero image (else the card image)
     challenge: 'What was wrong or missing before we started.',
     approach:  'How we tackled it, and where AI and the human expert each came in.',
     outcome:   'What changed for the client.',
     scope:     ['Discovery', 'Information architecture', 'Design system', 'Webflow build'],
     gallery:   [{ src: 'assets/img/x-1.webp', alt: '...', wide: true }, { src: '...', alt: '...' }],
     quote:     { quote: '...', name: '...', role: '...' }
   }
*/

/* Work page filter strip, in display order ('All' is added automatically).
   To add a tag: add it here, then put its id in the projects' tags above. */
RM.WORK_TAGS = [
  { id: 'website',   label: 'Website' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'product',   label: 'Product design' },
  { id: 'brand',     label: 'Brand identity' },
  { id: 'education', label: 'Education' },
  { id: 'retail',    label: 'Retail' },
  { id: 'energy',    label: 'Energy' }
];

/* 12.5 part 1 · card track */
RM.TRACK = [
  { n: '01', title: 'AI strategy',     line: 'Find the AI work worth paying for.',                                   href: '#svc-01', glyph: 'strategy' },
  { n: '02', title: 'AI experience',   line: 'Interfaces people trust enough to use.',                               href: '#svc-02', glyph: 'experience' },
  { n: '03', title: 'AI engineering',  line: 'LLM, RAG and data systems that hold up in production.',                href: '#svc-03', glyph: 'engineering' },
  { n: '04', title: 'Agentic AI',      line: 'Agents that do the task and check with a person before risky steps.',  href: '#svc-04', glyph: 'agentic' },
  { n: '05', title: 'AI automation',   line: 'Manual workflows rebuilt around AI.',                                  href: '#svc-05', glyph: 'automation' },
  { n: '06', title: 'Redmelon Studio', line: '2D, 3D and AI animation for brands.',                                  href: '#studio', glyph: 'studio', studio: true }
];

/* 12.5 part 2 · service switcher */
RM.SERVICES = [
  { id: 'svc-01', n: '01', name: 'AI strategy', motif: 'roadmap',
    heading: 'Find the AI work worth paying for.',
    body: 'We look at how your business runs today and point to the places where AI would save real time or money. You leave with a short, ranked list of what to build first and what to skip.',
    tags: ['Opportunity mapping', 'Use-case ranking', 'AI operating model', 'Governance'] },
  { id: 'svc-02', n: '02', name: 'AI experience', motif: 'panels',
    heading: 'Interfaces people trust enough to use.',
    body: 'An AI system only helps if people use it. We design the screens where your team reviews, corrects and approves what the AI does, so they can see what it did and overrule it.',
    tags: ['AI product design', 'Enterprise UX', 'Conversational interfaces', 'Human review flows'] },
  { id: 'svc-03', n: '03', name: 'AI engineering', motif: 'graph',
    heading: 'Systems that hold up in production.',
    body: 'We build the LLM applications, knowledge search and data pipelines behind the product, and connect them to the systems you already run. A human expert reviews the architecture and every change that carries risk.',
    tags: ['LLM applications', 'RAG and knowledge search', 'Model orchestration', 'Integrations', 'AI infrastructure'] },
  { id: 'svc-04', n: '04', name: 'Agentic AI', motif: 'loop',
    heading: 'Agents that do the task and ask before risky steps.',
    body: "Agents can read context, use your tools and complete work on their own. We set the points where an agent has to stop and get a person's approval, and we decide those points with you.",
    tags: ['AI Agents', 'Agentic Workflows', 'Multi-Agent Systems', 'Tool Use', 'Human-in-the-loop'] },
  { id: 'svc-05', n: '05', name: 'AI automation', motif: 'conveyor',
    heading: 'Manual workflows rebuilt around AI.',
    body: 'We redesign repetitive and complex workflows around AI, connecting people, systems and intelligent agents to reduce friction and increase operational capacity.',
    tags: ['AI Operations', 'Document Intelligence', 'Workflow Automation', 'AI Copilots', 'Decision Automation', 'AI Assistants'] }
];

/* panel 04 agent loop labels; 'Approve' is the green node (centre reads 'Human approve' at that step) */
RM.LOOP = ['Knowledge', 'Reason', 'Plan', 'Approve', 'Act', 'Learn'];

/* industries: pain line, what we build, proof (real projects only, no unapproved numbers), trust tag */
RM.INDUSTRIES = [
  { id: 'finance', cta: 'finance', icon: 'indBank', name: 'Financial services', tag: 'Runs inside your environment',
    pain: 'Onboarding checks take days and still miss the risky files.',
    build: ['Document checking agents', 'Risk flagging', 'Analyst copilots'], proof: 'DBS Bank · EY' },
  { id: 'brands', cta: 'consumer brands', icon: 'indBrand', name: 'Consumer brands & FMCG', tag: 'Brand rules built in',
    pain: 'Every market needs its own assets, and approvals slow everything down.',
    build: ['Campaign asset generation', 'Brand review flows', 'Content at scale'], proof: 'Mondelez · Red Bull · Ogilvy' },
  { id: 'energy', cta: 'energy', icon: 'indEnergy', name: 'Energy & utilities', tag: 'Works with live meter data',
    pain: 'Field and support teams are buried in meter data and tickets.',
    build: ['Smart-meter assistants', 'Outage triage', 'Customer copilots'], proof: 'Gridcrest Technology · Torrent Power · Mahesh Gas', work: true },
  { id: 'auto', cta: 'manufacturing', icon: 'indAuto', name: 'Automotive & manufacturing', tag: 'Connects to existing systems',
    pain: 'Quality checks and service manuals still run on manual effort.',
    build: ['Visual quality checks', 'Service knowledge search', 'Supply data agents'], proof: 'Ford · Tata Motors · JSW' },
  { id: 'edu', cta: 'education', icon: 'indEdu', name: 'Education', tag: 'Privacy first',
    pain: 'Students and staff wait days for answers that already exist somewhere.',
    build: ['Student service assistants', 'Research search', 'Admissions support'], proof: 'IIT Mumbai · Ryan International · Vidyalankar', work: true },
  { id: 'retail', cta: 'retail', icon: 'indRetail', name: 'Retail & e-commerce', tag: 'Plugs into your catalogue',
    pain: "Product content and search can't keep up with the catalogue.",
    build: ['Product content generation', 'Smart search', 'Personalisation'], proof: 'Spaces.in · Raymond · Bestseller', work: true }
];

/* 12.6 · how we work */
RM.STEPS = [
  { n: '01', title: 'Think', img: 'assets/img/step-think.webp', imgW: 900, imgH: 813, glow: 1.8,
    alt: 'Documents, data, support history and a database feed one AI core, which ranks the options and picks one',
    ai: 'Reads your documents, data and support history to show where time and money leak.',
    lead: 'Which problem is worth solving first, agreed with you.' },
  { n: '02', title: 'Design', img: 'assets/img/step-design.webp', imgW: 800, imgH: 866,
    alt: 'Code, components, a checklist and tests feed a build engine; a person approves the result before it ships',
    ai: 'Produces several working prototypes so you can react to something real.',
    lead: 'Which direction goes forward.' },
  { n: '03', title: 'Build', img: 'assets/img/step-build.webp', imgW: 800, imgH: 680,
    alt: 'Several screen layouts branch from an AI core; one is picked and approved',
    ai: 'Writes the repetitive code, variations and tests.',
    lead: "The architecture, and every change that carries risk. Nothing ships without their sign-off." },
  { n: '04', title: 'Move', img: 'assets/img/step-move.webp', imgW: 800, imgH: 806, glow: 2.1,
    alt: 'Live performance charts feed an AI core, which leads either to another round or to launch',
    ai: "Tracks how the system performs once it's live.",
    lead: 'Whether it worked, and with you, what happens next: another round, or a full handover.' }
];

/* 12.7 · Studio ticker */
RM.TICKER = ['2D animation', '3D animation', 'AI animation', 'Motion design', 'Visual storytelling', 'Creative production'];

/* 12.8 · voices */
RM.QUOTES = [
  /* Add real client quotes here: { quote, name, role, company }. The carousel stays hidden while empty. */
];
RM.LEADS = [
  /* PLACEHOLDER: roles only. Add real names and photos. */
  { name: 'AI engineering lead', role: 'LLM systems, data and integrations', photo: '', mono: 'AE' },
  { name: 'Product design lead', role: 'AI experience and human review flows', photo: '', mono: 'PD' },
  { name: 'Studio creative director', role: '2D, 3D and AI animation', photo: '', mono: 'CD' }
];

/* About page · what we believe. DRAFT: written from the positioning and FAQ answers already on the site; confirm with the client. */
RM.BELIEFS = [
  { t: 'AI does the volume. People make the calls.',
    d: 'A human expert is involved in every stage of your project and makes every final decision. AI does the repetitive work under their review.' },
  { t: 'Honest before billable.',
    d: "If AI isn't the right fix for your problem, you'll hear it from us on the first call, before you spend anything." },
  { t: 'What we build is yours.',
    d: 'Once the project is paid, the code, designs and models we build for you belong to you.' },
  { t: 'Your data stays yours.',
    d: 'We sign an NDA before we see anything, and we can build and run the system inside your own environment.' }
];

/* 12.9 · start-here tiles */
RM.TILES = [
  { id: 'idea',     title: 'We have an idea and nothing built',
    line: "On the call we'll tell you if it's worth building and what the first version should include.", stage: 'Idea, nothing built' },
  { id: 'first',    title: 'We need a first version soon',
    line: "Tell us your deadline and we'll say honestly whether it fits.", stage: 'First version needed' },
  { id: 'stalled-pilot', title: 'Our AI pilot stalled',
    line: 'Show us where it stopped. A human expert will tell you what it takes to finish it.', stage: 'Stalled pilot' },
  { id: 'manual',   title: 'My team does too much by hand',
    line: "Name the process and we'll check whether AI can take the volume.", stage: 'Manual process' },
  { id: 'boundary', title: 'It has to stay inside our security boundary',
    line: 'We can build and run it inside your own environment.', stage: 'Inside our boundary' }
];

/* 12.10 · FAQ. PLACEHOLDER answers for cost, time, data and IP: confirm with the client. */
RM.FAQ = [
  { id: 'who',   q: 'Who actually works on my project?',
    a: 'A human expert is involved in every stage and makes every final decision. AI does the repetitive work under their review.' },
  { id: 'cost',  q: 'How much does it cost?',
    a: 'It depends on what we build, so we scope it on the first call and send you a written estimate within two working days.' },
  { id: 'time',  q: 'How long does a project take?',
    a: "A first version usually takes 6 to 12 weeks, depending on scope. We'll give you a timeline for your project after the first call." },
  { id: 'data',  q: 'Is our data safe with you?',
    a: "Yes. We sign an NDA before we see anything, use your data only for your project, and can build and run the system inside your own environment." },
  { id: 'ip',    q: 'Who owns what you build?',
    a: 'You do. Once the project is paid, the code, designs and models we build for you are yours.' },
  { id: 'worth', q: "What if it isn't worth building?",
    a: "We'll tell you on the first call. If AI isn't the right fix for your problem, you'll hear that from us before you spend anything." }
];

/* 12.11 · form messages */
RM.FORM = {
  empty: { name: 'your name', email: 'your work email', phone: 'your phone number', what: 'what you are trying to build' },
  emailBad: 'That email looks incomplete. Check for a missing @ or domain.',
  phoneBad: 'Add the country code so we can reach you, for example +1 or +44.',
  freeMail: "A work email helps us route this. It's fine to keep this one.",
  sendFail: "That didn't send. Try again, or email us at hello@redmelondesign.com."
};

/* 12.13 · WhatsApp guided flow */
RM.WA_FLOW = {
  hello: { msg: 'Hi, this is Redmelon. What brings you here?',
    opts: [['What do you build?', 'what'], ['Can you help with my project?', 'fit'], ['How do we start?', 'start'], ['Something else', 'else']] },
  what:  { msg: 'We build AI products, agents and automation. On every project a human expert makes the decisions and AI does the repetitive work.',
    opts: [['Can you help with my project?', 'fit'], ['Talk to a person', 'human']] },
  fit:   { msg: "A person should answer that one properly. If a process is slow, expensive or done by hand, it's usually worth a call.",
    opts: [['Get a call back', 'callback'], ['Talk to a person', 'human']] },
  start: { msg: 'It starts with a short call. Leave your number and a human expert calls you back.',
    opts: [['Get a call back', 'callback'], ['Talk to a person', 'human']] },
  else:  { msg: "I can't answer that one, but a person can.",
    opts: [['Talk to a person', 'human'], ['Get a call back', 'callback']] },
  human: { msg: 'Opening WhatsApp. A person from the team will reply here.',
    opts: [['Get a call back instead', 'callback'], ['Start over', 'restart']] }
};

/* default country calling codes by browser language (form phone field) */
RM.DIAL = { 'en-GB': '+44', 'en-US': '+1', 'en-CA': '+1', 'en-IE': '+353', 'en-AU': '+61', 'en-IN': '+91',
  de: '+49', fr: '+33', nl: '+31', es: '+34', it: '+39', pt: '+351', sv: '+46', da: '+45', nb: '+47', fi: '+358', pl: '+48', hi: '+91' };
