/* =====================================================================
   DATA · every copy-driven list, the WhatsApp flow and site config.
   Edit content here; the layout files never need to change for copy.
   Text in [NEED: ...] renders as a visible dashed placeholder.
   ===================================================================== */
window.RM = window.RM || {};

RM.CONFIG = {
  /* Review build: shows Selected work, Voices and the WhatsApp widget with
     placeholders. Set to false for production; empty blocks then hide. */
  REVIEW_MODE: true,
  SHOW_WORK: false,      /* production: true once 3-4 real projects are in WORK */
  SHOW_VOICES: false,    /* production: true once quotes or lead profiles exist */
  WHATSAPP_NUMBER: '',   /* digits only with country code, e.g. '447700900000' */
  FORM_ENDPOINT: '',     /* [NEED: email service, CRM or Google Sheet]. Empty = simulate */
  CONTACT_EMAIL: '',     /* [NEED: real email] */
  QUOTE_INTERVAL: 7000
};

/* A/B test copy (12.2). Swap HERO_H1 to test; the live H1 is in index.html. */
RM.AB = {
  HERO_H1_A: 'AI at scale. Humans in charge.',
  HERO_H1_B: 'Your AI pilot works in the demo. We make it work in the business.'
};

/* 12.3 · logo wall. Brand colours are third-party and live here, not in tokens. */
RM.LOGOS = [
  { name: 'Mondelez',  color: '#4F2170', dark: '#B79AD6' },
  { name: 'DBS Bank',  color: '#E2231A', dark: '#FF6B63' },
  { name: 'Ford',      color: '#00274E', dark: '#6FA3E0' },
  { name: 'Ogilvy',    color: '#D6001C', dark: '#FF5A6A' },
  { name: 'GridCrest', color: '#0B6E4F', dark: '#4FD1A5' }
];

/* 12.3 · selected work. Image, client name, one plain line. */
RM.WORK = [
  { client: '[NEED: Client name]', line: '[NEED: What we did, in one plain line]', img: '' },
  { client: '[NEED: Client name]', line: '[NEED: What we did, in one plain line]', img: '' },
  { client: '[NEED: Client name]', line: '[NEED: What we did, in one plain line]', img: '' },
  { client: '[NEED: Client name]', line: '[NEED: What we did, in one plain line]', img: '' }
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
    body: 'We build the LLM applications, knowledge search and data pipelines behind the product, and connect them to the systems you already run. A senior engineer reviews the architecture and every change that carries risk.',
    tags: ['LLM applications', 'RAG and knowledge search', 'Model orchestration', 'Integrations', 'AI infrastructure'] },
  { id: 'svc-04', n: '04', name: 'Agentic AI', motif: 'loop',
    heading: 'Agents that do the task and ask before risky steps.',
    body: "Agents can read context, use your tools and complete work on their own. We set the points where an agent has to stop and get a person's approval, and we decide those points with you.",
    tags: ['AI agents', 'Multi-agent workflows', 'Tool use', 'Human approval steps'] },
  { id: 'svc-05', n: '05', name: 'AI automation', motif: 'conveyor',
    heading: 'Manual workflows rebuilt around AI.',
    body: 'Pick a process your team repeats every day. We rebuild it so AI handles the volume and your people handle the exceptions.',
    tags: ['Document processing', 'Workflow automation', 'Copilots', 'Decision support'] }
];

/* panel 04 agent loop labels; 'Approve' is the red node */
RM.LOOP = ['Knowledge', 'Reason', 'Plan', 'Approve', 'Act', 'Learn'];

/* 12.6 · how we work */
RM.STEPS = [
  { n: '01', title: 'Think',
    ai: 'Reads your documents, data and support history to show where time and money leak.',
    lead: 'Which problem is worth solving first, agreed with you.' },
  { n: '02', title: 'Design',
    ai: 'Produces several working prototypes so you can react to something real.',
    lead: 'Which direction goes forward.' },
  { n: '03', title: 'Build',
    ai: 'Writes the repetitive code, variations and tests.',
    lead: "The architecture, and every change that carries risk. Nothing ships without their sign-off." },
  { n: '04', title: 'Move',
    ai: "Tracks how the system performs once it's live.",
    lead: 'Whether it worked, and with you, what happens next: another round, or a full handover.' }
];

/* 12.7 · Studio ticker */
RM.TICKER = ['2D animation', '3D animation', 'AI animation', 'Motion design', 'Visual storytelling', 'Creative production'];

/* 12.8 · voices */
RM.QUOTES = [
  { quote: "[Quote in the client's own words.]", name: '[Name]', role: '[Role]', company: '[Company]', need: 'real quotes' },
  { quote: "[Quote in the client's own words.]", name: '[Name]', role: '[Role]', company: '[Company]', need: 'real quotes' }
];
RM.LEADS = [
  { name: '[NEED: name]', role: '[NEED: role]', photo: '' },
  { name: '[NEED: name]', role: '[NEED: role]', photo: '' },
  { name: '[NEED: name]', role: '[NEED: role]', photo: '' }
];

/* 12.9 · start-here tiles */
RM.TILES = [
  { id: 'idea',     title: 'We have an idea and nothing built',
    line: "On the call we'll tell you if it's worth building and what the first version should include.", stage: 'Idea, nothing built' },
  { id: 'first',    title: 'We need a first version soon',
    line: "Tell us your deadline and we'll say honestly whether it fits.", stage: 'First version needed' },
  { id: 'stalled-pilot', title: 'Our AI pilot stalled',
    line: 'Show us where it stopped. A senior lead will tell you what it takes to finish it.', stage: 'Stalled pilot' },
  { id: 'manual',   title: 'My team does too much by hand',
    line: "Name the process and we'll check whether AI can take the volume.", stage: 'Manual process' },
  { id: 'boundary', title: 'It has to stay inside our security boundary',
    line: 'We can build and run it inside your own environment. [NEED: confirm offered]', stage: 'Inside our boundary' }
];

/* 12.10 · FAQ. Answers that are only a [NEED] are left out of the schema. */
RM.FAQ = [
  { id: 'who',   q: 'Who actually works on my project?',
    a: 'A senior lead is involved in every stage and makes every final decision. AI does the repetitive work under their review.' },
  { id: 'cost',  q: 'How much does it cost?',
    a: 'It depends on what we build, so we scope it on the first call and send you a written estimate. [NEED: optional pricing model or starting range]' },
  { id: 'time',  q: 'How long does a project take?',
    a: "[NEED: typical range for a first version] We'll give you a timeline for your project after the first call." },
  { id: 'data',  q: 'Is our data safe with you?',
    a: "[NEED: NDA, deployment inside the client's environment, data handling]" },
  { id: 'ip',    q: 'Who owns what you build?',
    a: '[NEED: IP terms, e.g. "You own the code and designs once the project is paid."]' },
  { id: 'worth', q: "What if it isn't worth building?",
    a: "We'll tell you on the first call. If AI isn't the right fix for your problem, you'll hear that from us before you spend anything." }
];

/* 12.11 · form messages */
RM.FORM = {
  empty: { name: 'your name', email: 'your work email', phone: 'your phone number', what: 'what you are trying to build' },
  emailBad: 'That email looks incomplete. Check for a missing @ or domain.',
  phoneBad: 'Add the country code so we can reach you, for example +1 or +44.',
  freeMail: "A work email helps us route this. It's fine to keep this one.",
  sendFail: "That didn't send. Try again, or email us at [NEED: email]."
};

/* 12.13 · WhatsApp guided flow */
RM.WA_FLOW = {
  hello: { msg: 'Hi, this is Redmelon. What brings you here?',
    opts: [['What do you build?', 'what'], ['Can you help with my project?', 'fit'], ['How do we start?', 'start'], ['Something else', 'else']] },
  what:  { msg: 'We build AI products, agents and automation. On every project a senior lead makes the decisions and AI does the repetitive work.',
    opts: [['Can you help with my project?', 'fit'], ['Talk to a person', 'human']] },
  fit:   { msg: "A person should answer that one properly. If a process is slow, expensive or done by hand, it's usually worth a call.",
    opts: [['Get a call back', 'callback'], ['Talk to a person', 'human']] },
  start: { msg: 'It starts with a short call. Leave your number and a senior lead calls you back.',
    opts: [['Get a call back', 'callback'], ['Talk to a person', 'human']] },
  else:  { msg: "I can't answer that one, but a person can.",
    opts: [['Talk to a person', 'human'], ['Get a call back', 'callback']] },
  human: { msg: 'Opening WhatsApp. A person from the team will reply here.',
    opts: [['Get a call back instead', 'callback'], ['Start over', 'restart']] }
};

/* default country calling codes by browser language (form phone field) */
RM.DIAL = { 'en-GB': '+44', 'en-US': '+1', 'en-CA': '+1', 'en-IE': '+353', 'en-AU': '+61', 'en-IN': '+91',
  de: '+49', fr: '+33', nl: '+31', es: '+34', it: '+39', pt: '+351', sv: '+46', da: '+45', nb: '+47', fi: '+358', pl: '+48', hi: '+91' };
