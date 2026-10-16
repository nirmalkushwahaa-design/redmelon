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
  QUOTE_INTERVAL: 7000,
  SHOW_PROJECT_PAGES: false   /* project detail pages (project.html) are hidden for now: cards don't link, and project.html sends visitors to work.html. Set true to switch them back on. */
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
     (color = light mode, dark = dark mode; '' = neutral). ind = the industry it shows under in the
     Clients explorer (RM.INDUSTRIES ids). logo = the real logo (cut from the client's logo sheet, 14 Oct); without one the name shows as a wordmark. Only the five first-draft entries carry hover stats. */
  /* engineering, infrastructure and building materials */
  { name: 'L&T', logo: 'assets/logos/lt.webp', ind: 'auto',               color: '#1D4F91', dark: '#6E9BE0' },
  { name: 'JSW', logo: 'assets/logos/jsw.webp', ind: 'auto',               color: '#1F3C88', dark: '#6D8DE0' },
  { name: 'UltraTech Cement', logo: 'assets/logos/ultratech-cement.webp', ind: 'auto',  color: '#A07F00', dark: '#FFD200' },
  { name: 'NITCO', logo: 'assets/logos/nitco.webp', ind: 'auto',             color: '',        dark: '' },
  { name: 'Hager', logo: 'assets/logos/hager.webp', ind: 'auto',             color: '#2D8CC4', dark: '#5BB8EA' },
  { name: 'Coromandel', logo: 'assets/logos/coromandel.webp', ind: 'auto',        color: '#D9790F', dark: '#FFA940' },
  /* energy and utilities */
  { name: 'Torrent Power', logo: 'assets/logos/torrent-power.webp', ind: 'energy',     color: '#D9790F', dark: '#F7A04B' },
  { name: 'Mahesh Gas', logo: 'assets/logos/mahesh-gas.webp', ind: 'energy',        color: '#2E3192', dark: '#8A8EF0' },
  { name: 'GridCrest', logo: 'assets/logos/gridcrest.webp', ind: 'energy',         color: '',        dark: '',        v: '35%',  l: 'shorter handover',        up: false },
  /* automotive */
  { name: 'IIT Mumbai', ind: 'edu', color: '', dark: '' },
  { name: 'Spaces.in', logo: 'assets/logos/spaces.webp', ind: 'retail', color: '', dark: '' },
  { name: 'Tata Motors', logo: 'assets/logos/tata-motors.webp', ind: 'auto',       color: '#1F5BA8', dark: '#5C95E6' },
  { name: 'Ford', logo: 'assets/logos/ford.webp', ind: 'auto',              color: '#003478', dark: '#1C7EFF', v: '60%',  l: 'less manual QA',          up: false },
  { name: 'CarWale', logo: 'assets/logos/carwale.webp', ind: 'auto',           color: '#D0201A', dark: '#FF5148' },
  /* telecom */
  { name: 'Vodafone', logo: 'assets/logos/vodafone.webp', ind: 'tech',          color: '#E60000', dark: '#FF3B3B' },
  /* banking, finance and professional services */
  { name: 'DBS Bank', logo: 'assets/logos/dbs-bank.webp', ind: 'finance',          color: '#ED0000', dark: '#FF3333', v: '3×',   l: 'review throughput',       up: true  },
  { name: 'EY', logo: 'assets/logos/ey.webp', ind: 'finance',                color: '#2E2E38', dark: '#FFE600' },
  { name: 'Stripe', ind: 'finance', color: '#635BFF', dark: '#8F88FF' },
  { name: 'Centuro Global', logo: 'assets/logos/centuro-global.webp', ind: 'finance',    color: '#6B2C5F', dark: '#C982BC' },
  /* food and beverage, FMCG */
  { name: 'Mondelez', logo: 'assets/logos/mondelez.webp', ind: 'brands',          color: '#502172', dark: '#A668D3', v: '40%',  l: 'faster asset turnaround', up: false },
  { name: 'Red Bull', logo: 'assets/logos/red-bull.webp', ind: 'brands',          color: '#DB0A40', dark: '#FF4D73' },
  /* healthcare and pharma */
  { name: 'Johnson & Johnson', logo: 'assets/logos/johnson-johnson.webp', ind: 'health', color: '#D51900', dark: '#FF4A33' },
  { name: 'Glenmark', logo: 'assets/logos/glenmark.webp', ind: 'health',          color: '#D7282F', dark: '#FF5A5F' },
  /* beauty */
  { name: "L'Oréal", logo: 'assets/logos/loreal.webp', ind: 'brands',      color: '',        dark: '' },
  /* fashion and apparel */
  { name: 'Raymond', logo: 'assets/logos/raymond.webp', ind: 'retail',           color: '#C8102E', dark: '#FF4560' },
  { name: 'Bestseller', logo: 'assets/logos/bestseller.webp', ind: 'retail',        color: '',        dark: '' },
  { name: 'Vero Moda', logo: 'assets/logos/vero-moda.webp', ind: 'retail',         color: '',        dark: '' },
  /* health and fitness */
  { name: 'cure.fit', logo: 'assets/logos/cure-fit.webp', ind: 'health',          color: '',        dark: '' },
  /* education and learning */
  { name: 'Ryan International', logo: 'assets/logos/ryan-international.webp', ind: 'edu', color: '#1C3F94', dark: '#6D8DE0' },
  { name: 'Vidyalankar', logo: 'assets/logos/vidyalankar.webp', ind: 'edu',       color: '#D71920', dark: '#FF4B50' },
  { name: 'G-Cube', logo: 'assets/logos/g-cube.webp', ind: 'edu',            color: '#D24A04', dark: '#FF7A3D' },
  /* technology */
  { name: 'U-TO Solutions', logo: 'assets/logos/u-to-solutions.webp', ind: 'tech',    color: '#1B75BB', dark: '#4FA3E6' },
  /* advertising, marketing and events */
  { name: 'Ogilvy', logo: 'assets/logos/ogilvy.webp', ind: 'media',            color: '#E81F23', dark: '#EB4448', v: '2.5×', l: 'concepts per sprint',     up: true  },
  { name: 'Indigo Consulting', logo: 'assets/logos/indigo-consulting.webp', ind: 'media', color: '#2A6EBB', dark: '#5FA0E8' },
  { name: 'Percept ICE', logo: 'assets/logos/percept-ice.webp', ind: 'media',       color: '#D71E24', dark: '#FF5056' },
  { name: '70 Event Media Group', logo: 'assets/logos/70-event-media-group.webp', ind: 'media', color: '#D9790F', dark: '#FFA940' },
  { name: 'The Big Small Events', logo: 'assets/logos/the-big-small-events.webp', ind: 'media', color: '',     dark: '' },
  { name: 'vCloudx', logo: 'assets/logos/vcloudx.webp', ind: 'media',           color: '#D62A43', dark: '#FF5C70' }
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
      outcome: 'Gridcrest now has a consistent brand identity and a professional website. The company has a recognisable presence in the Indian energy market, and a credible place to send every customer and partner it meets.' } },
  /* 5–12: from Nirmal's case-study slides (16 Oct). Year, timeline, activities, end users and overview/solution are the slides' own;
     challenge / approach / outcome are only filled where the slide has an overview and solution. */
  { slug: 'gcube', client: 'G-Cube', line: 'Enterprise learning management system: the WiZDOM LMS redesigned for learning on every device.', img: 'assets/img/work-gcube.webp',
    tags: ['product', 'education'],
    detail: { title: 'Enterprise Learning Management System', industry: 'Enterprise learning', services: ['UX/UI design', 'UI development'],
      year: '2017 – Present', duration: '8 months', platform: 'Web & mobile', audience: 'Corporate employees',
      scope: ['Focus groups', 'Competitive analysis', 'Heuristic evaluation', 'Task flows', 'Persona creation', 'Information architecture', 'Low-fidelity wireframes', 'UX/UI design', 'UI development'],
      challenge: 'For more than a decade G-Cube has deployed WiZDOM Enterprise LMS to meet the training, learning and development needs of large enterprises. In 2017 G-Cube came to us to reinvent WiZDOM and make it the standard for years to come.',
      approach: 'We redesigned the LMS suite through an integrated UX strategy, design and development, bringing design and technology together so learning works the same on every device.',
      outcome: 'WiZDOM now delivers a seamless experience across devices, from the interface to its interactive dashboards: one central platform for training and learning.' } },
  { slug: 'denali', client: 'Denali Assets', line: 'Business intelligence dashboard: one view of portfolio, finance, help desk, utilities and HR for leadership.', img: 'assets/img/work-denali.webp',
    tags: ['product'],
    detail: { title: 'Business Intelligence Dashboard', industry: 'Real estate', services: ['UX/UI design', 'Development'],
      year: '2019', duration: '4 months', platform: 'iPad', audience: 'MD, CEO, CFO, COO and department heads',
      scope: ['Focus groups', 'Task flows', 'High-fidelity wireframes', 'Design', 'Development', 'Deployment'] } },
  { slug: 'toppscholars', client: 'Toppscholars', line: 'Interactive K12 learning app: a mobile-first hub for learning, assessment and performance.', img: 'assets/img/work-toppscholars.webp',
    tags: ['product', 'education'],
    detail: { title: 'Interactive K12 Learning App', industry: 'Education', services: ['UX/UI design', 'UI development'],
      year: '2019', duration: 'Ongoing', platform: 'Mobile (all devices)', audience: 'Students and parents',
      scope: ['Focus groups', 'Competitive analysis', 'Heuristic evaluation', 'Task flows', 'Persona creation', 'Information architecture', 'UX/UI design', 'UI development'],
      challenge: 'Toppscholars is one of India’s leading ed-tech companies, with content designed under the supervision of expert teachers. It wanted to give digital-age students a personalised learning experience: one place to learn, assess their performance as they advance, and get insights for better results.',
      approach: 'The redesign took a mobile-first approach to work for the full range of K12 users, with one hub for all learning and assessment needs and a coherent experience across devices. The design is visually engaging to keep students learning and strengthen brand recall.',
      outcome: 'The app shows each student content tailored to their performance, giving them a better foundation for their learning.' } },
  { slug: 'vidyalankar', client: 'Vidyalankar', line: 'IIT GATE entrance app: goals, practice, tests and performance insights for engineering graduates.', img: 'assets/img/work-vidyalankar.webp',
    tags: ['product', 'education'],
    detail: { title: 'IIT GATE Entrance App', industry: 'Education', services: ['UX/UI design'],
      year: '2020', duration: '5 months', platform: 'Mobile app', audience: 'Engineering graduates',
      scope: ['Focus groups', 'Competitive analysis', 'Design thinking', 'Task flows', 'Persona creation', 'Information architecture', 'UX/UI design'] } },
  { slug: 'centuro', client: 'Centuro Global', line: 'Networking club app connecting large corporates, SMEs, consultants and startups.', img: 'assets/img/work-centuro.webp',
    tags: ['product'],
    detail: { title: 'Networking Club App', industry: 'Business networking', services: ['UX/UI design'],
      year: '2019 – 20', duration: '6 months', platform: 'Mobile app', audience: 'Large corporates, SMEs, consultants and startups',
      scope: ['Focus groups', 'Competitive analysis', 'Design thinking', 'Task flows', 'Information architecture', 'UX/UI design'] } },
  { slug: 'redbull-distributor', client: 'Red Bull', line: 'Distributor Evolution web app: hierarchical surveys and a scoring dashboard for every distributor.', img: 'assets/img/work-redbull.webp',
    tags: ['product'],
    detail: { title: 'Distributor Evolution Web Application', industry: 'Food & beverage', services: ['UX/UI design', 'Development'],
      year: '2015', duration: '5 months', platform: 'Web', audience: 'Red Bull management and distributors',
      scope: ['Focus groups', 'Task flows', 'Low-fidelity wireframes', 'Design', 'Development', 'Deployment'],
      challenge: 'Red Bull’s Evolution team ran its Distributor Evolution surveys on a third-party online tool. The tool was unstable, which meant rework, manual data checks, inefficiency and inaccurate scores. Red Bull needed a way to set up detailed hierarchical survey questions that roll up into an Enabler score for each distributor, with results in a dashboard that exports to multiple formats.',
      approach: 'We created a simple, effective interface that lets the Evolution team build visual, hierarchical surveys, backed by a deep analytical dashboard that helps them evaluate each distributor through its score details.',
      outcome: 'The solution was very well received by Red Bull’s executives and its distributors.' } },
  { slug: 'redbull-events', client: 'Red Bull', line: 'Enterprise event management app: schedules, alerts, contacts, chat and documents for on-site event teams.', img: 'assets/img/work-redbull-events.webp',
    tags: ['product'],
    detail: { title: 'Enterprise Event Management App', industry: 'Food & beverage', services: ['UI design'],
      year: '2015', duration: '3 months', platform: 'Mobile app', audience: 'Red Bull management and employees',
      scope: ['Focus groups', 'Task flows', 'Low-fidelity wireframes', 'UI design'],
      challenge: 'Red Bull North America’s event marketing team needed an internal tool to coordinate multiple teams at events. It relied on presentations and static content that were hard to get to teams quickly on site. The tool had to cover event information, alerts and notifications, schedules, contacts, chat, document sharing and mail.',
      approach: 'We designed a single tool where event teams can learn, connect and interact, giving them full control over their events.',
      outcome: 'The event teams replaced their old mass-communication methods with one platform that carries all the key features they need.' } },
  { slug: 'vodafone-cec', client: 'Vodafone', line: 'Digital installation for a Customer Experience Centre: interactive screens that walk enterprise customers through Vodafone’s offer.', img: 'assets/img/work-vodafone.webp',
    tags: ['product'],
    detail: { title: 'Digital Installation for Customer Experience Centre', industry: 'Telecom', services: ['UI design', 'UI animation', 'Development'],
      year: '2015 – 16', duration: '7 months', platform: 'Interactive touch screens', audience: 'CEC managers, business heads, CEOs, CTOs and CIOs',
      scope: ['Focus groups', 'User stories', 'UI design', 'UI animation', 'Design', 'Development'],
      challenge: 'Vodafone India, then the country’s second-largest telecom operator, set up a Customer Experience Centre (CEC) to showcase its end-to-end solutions to enterprise customers, typically CEOs, CTOs and vertical directors. It wanted digital screens with interactive content to present its product offerings.',
      approach: 'We set out to go beyond presentation pitches and let customers experience the full breadth of Vodafone’s offer. Research and meetings with CEC stakeholders let us streamline the pitch workflows into a new information architecture.',
      outcome: 'The result was an interactive application with a fluid framework of content and navigation, built around the logical flow of each product pitch and demo, which helps CEC staff make the most of every customer conversation.' } },
  { slug: 'raymond-mtm', client: 'Raymond', line: 'Digital style catalogue: an in-store iPad app for browsing, measuring and ordering Made-to-Measure.', img: 'assets/img/work-raymond.webp',
    tags: ['product', 'retail'],
    detail: { title: 'Digital Style Catalogue', industry: 'Fashion retail', services: ['UX/UI design', 'iOS development'],
      year: '2012', duration: '5 months', platform: 'iPad', audience: 'Raymond customers',
      scope: ['Focus groups', 'User stories', 'Task flows', 'Persona creation', 'High-fidelity wireframes', 'UX/UI design', 'iOS development'],
      challenge: 'Raymond’s Made-to-Measure line is made for customers who enjoy living in style. In store, they had to work through an exhaustive printed catalogue of options, and tagging each choice by category took a long time. The brief was a smart tablet app that lets a customer browse collections and fabrics, register their measurements and finalise their order.',
      approach: 'We created an in-store iPad app for Raymond that brings simplicity and style to choosing a wardrobe, so customers can go through every option with ease and select the specifications they need.',
      outcome: 'Customers who live in luxury and style get an experience to match in Raymond’s stores, and Raymond can keep an eye on trends.' } },
  { slug: 'hashedin-chrysler', client: 'HashedIn', line: 'Car dealer app: a showroom tablet tool that helps sales teams match each buyer to the right Chrysler in stock.', img: 'assets/img/work-chrysler.webp',
    tags: ['product'],
    detail: { title: 'Car Dealer Application', industry: 'Automotive', services: ['UI design'],
      year: '2015', duration: '2.5 months', platform: 'Tablet', audience: 'Sales teams and customers',
      scope: ['Focus groups', 'Heuristic evaluation', 'Paper wireframes', 'UI design'],
      challenge: 'Chrysler, the family brand for sedans and minivans worldwide, wanted to take its mobile and technology strategy onto the showroom floor: a tool for dealers that supports buying and service, and helps each buyer discover the right car.',
      approach: 'We designed a tablet app that helps sales staff work out which features a customer is looking for, then searches the inventory to suggest the vehicle in stock that matches those needs most closely.',
      outcome: 'Customers can also explore general stats and performance, technical and historical information for each vehicle, including 360° interior views, videos and slideshows.' } },
  { slug: 'carwale', client: 'CarWale', line: 'Web application for carwale.com: new cars, used cars, comparisons and prices in one place.', img: 'assets/img/work-carwale.webp',
    tags: ['website'],
    detail: { title: 'Web Application', industry: 'Automotive', services: ['UI design'],
      year: '2014', duration: '2 months', platform: 'Web', url: 'https://www.carwale.com/',
      scope: ['Focus groups', 'Competitive analysis', 'User stories', 'Task flows', 'Information architecture', 'High-fidelity wireframes', 'UI design'] } },
  { slug: 'vcloudx', client: 'vCloudx', line: 'Corporate website and brand for a video platform as a service: real-time communication made simple.', img: 'assets/img/work-vcloudx.webp',
    tags: ['website', 'brand'],
    detail: { title: 'Corporate Website', industry: 'Technology (video platform)', services: ['Brand identity', 'UI design', 'UI animation'],
      year: '2018', duration: '4 months', platform: 'Web',
      scope: ['Focus groups', 'Competitive analysis', 'Persona creation', 'Information architecture', 'Paper wireframes', 'UI design', 'UI animation'],
      challenge: 'vCloudx is a video platform as a service (VPaaS), started by entrepreneurs and seasoned professionals to change how the world communicates in real time, by enriching business applications with engaging, contextual communication. The website needed to carry the same thinking.',
      approach: 'As design partner, we worked closely with the internal team to build the brand’s look and design approach from scratch: the identity, the marketing collateral and, finally, the end-to-end design of the website.',
      outcome: 'The website is now the brand’s first touchpoint with its users.' } },
  { slug: 'centuro-website', client: 'Centuro Global', line: 'Corporate website and identity with a quirky, memorable style for a business growth platform.', img: 'assets/img/work-centuro-web.webp',
    tags: ['website', 'brand'],
    detail: { title: 'Corporate Website', industry: 'Business growth', services: ['Brand identity', 'UX/UI design', 'UI development', 'CMS integration'],
      year: '2019', duration: '5 months', platform: 'Web', url: 'https://centuroglobal.com/',
      scope: ['Competitive analysis', 'Persona creation', 'Market study', 'Information architecture', 'Paper wireframes', 'UX/UI design', 'UI development', 'CMS integration'],
      challenge: 'Centuro Global brings together an innovative business growth concept that helps companies win new clients, unlock fresh revenue streams, build an international reputation and attract investment. The ecosystem it serves is distinct, and it needed a style that carries the same thought.',
      approach: 'The whole design scheme, from the identity to the marketing website, was built on quirkiness as its cornerstone. Working closely with the client, our design team took creative liberties that let us break away from the usual norms of the market.',
      outcome: 'The interactions and design style were made to be memorable, so users remember the brand.' } },
  { slug: 'plassbox', client: 'Plassbox', line: 'Web application for plassbox.com: find and book workspaces and studios, plus networking events.', img: 'assets/img/work-plassbox.webp',
    tags: ['website'],
    detail: { title: 'Web Application', industry: 'Workspaces', services: ['UI design', 'UI animation'],
      year: '2018', duration: '4 months', platform: 'Web',
      scope: ['Focus groups', 'Competitive analysis', 'User stories', 'Task flows', 'Information architecture', 'Paper wireframes', 'UI design', 'UI animation'] } },
  { slug: 'irasva', client: 'Irasva', line: 'A refined e-commerce experience for contemporary fine diamond jewellery.', img: 'assets/img/work-irasva.webp',
    tags: ['website', 'ecommerce', 'retail'],
    detail: { industry: 'Fine jewellery', services: ['E-commerce website'], platform: 'Web', url: 'https://www.irasva.com/' } }
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

/* industries: the Clients explorer shows each industry's clients (RM.LOGOS entries with a matching ind).
   pain / build / proof / tag are kept for reference; the panel no longer shows them. */
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
  { id: 'health', cta: 'healthcare', icon: 'indHealth', name: 'Healthcare & wellness' },
  { id: 'tech', cta: 'technology', icon: 'indTech', name: 'Technology & telecom' },
  { id: 'edu', cta: 'education', icon: 'indEdu', name: 'Education', tag: 'Privacy first',
    pain: 'Students and staff wait days for answers that already exist somewhere.',
    build: ['Student service assistants', 'Research search', 'Admissions support'], proof: 'IIT Mumbai · Ryan International · Vidyalankar', work: true },
  { id: 'retail', cta: 'retail', icon: 'indRetail', name: 'Retail & e-commerce', tag: 'Plugs into your catalogue',
    pain: "Product content and search can't keep up with the catalogue.",
    build: ['Product content generation', 'Smart search', 'Personalisation'], proof: 'Spaces.in · Raymond · Bestseller', work: true },
  { id: 'media', cta: 'media and events', icon: 'indMedia', name: 'Advertising, media & events' }
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
  /* About page team. photo: 'assets/img/team-x.webp' (portrait, 4:5) replaces the initials. */
  { name: 'Rakshit Shah', role: 'Founder & Chief Experience Officer', photo: '', mono: 'RS' },
  { name: 'Arko Provo Mukherjee', role: 'Chief Creative Officer', photo: '', mono: 'AM' }
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

/* About page · in numbers (client's figures, 14 Oct) */
RM.STATS = [
  { v: '128+', l: 'Delivered projects', icon: 'statProjects' },
  { v: '20+',  l: 'Personalities',      icon: 'statPeople' },
  { v: '02',   l: 'Unicorns',           icon: 'statUnicorn' },
  { v: '580M', l: 'Pixels pushed',      icon: 'statPixels' },
  { v: '112K', l: 'Coffees',            icon: 'statCoffee' },
  { v: '13',   l: 'Years in business',  icon: 'statYears' }
];

/* About page · our values (client's copy, 14 Oct). Replaces the drafted RM.BELIEFS on the page. */
RM.VALUES = [
  { t: 'Founder Centric',
    d: 'Building and scaling a business goes beyond simple challenges because it demands continuous pursuit of bigger goals. Our services include bold strategies alongside direct support and essential clarity, so founders can overcome challenges while capturing opportunities and succeed throughout all business stages.' },
  { t: 'Performance',
    d: 'Our precise movements enable us to direct suitable expertise to every project for flawless execution and outstanding outcomes. Our streamlined approach maintains efficient workflows and project timelines while producing top-quality results on every occasion.' },
  { t: 'Personal Accountability',
    d: 'Each promise we fulfil leads projects to successful outcomes through accountable work and dedicated efforts. Transparency and open communication form our foundation and enable us to align each step with your vision.' },
  { t: 'Dedication & Collaboration',
    d: 'Our team is filled with driven specialists who deliver precision skills alongside innovative thinking. Our collaborative approach enables us to approach each project with a new perspective while pushing limits to achieve transformative results.' },
  { t: 'Growth Mindset',
    d: 'Each obstacle presents an opportunity for development, which allows us to hone our skills purposefully and elevate our expertise. Growth serves as our foundational mindset, which propels us to create new solutions while adapting to change and leading confidently.' }
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
