/* =====================================================================
   CORE · flags, helpers, analytics, render-from-data, theme, Lenis + GSAP
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, root = document.documentElement, C = RM.CONFIG;

  /* ---------- flags ---------- */
  var mq = function (q) { return !!(window.matchMedia && matchMedia(q).matches); };
  RM.flags = {
    rm: root.classList.contains('rm'),
    fine: mq('(hover:hover) and (pointer:fine)'),
    touch: mq('(hover:none)'),
    gsap: !!(window.gsap && window.ScrollTrigger),
    split: !!window.SplitText,
    lowPower: (navigator.hardwareConcurrency || 8) <= 4
  };
  RM.flags.motion = RM.flags.gsap && !RM.flags.rm;
  if (RM.flags.motion) root.classList.add('motion');
  RM.dpr = function () { return Math.min(window.devicePixelRatio || 1, RM.flags.lowPower ? 1 : 1.5); };

  /* ---------- helpers ---------- */
  RM.$ = function (s, c) { return (c || document).querySelector(s); };
  RM.$$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  RM.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  /* escape, then style any [NEED: ...] as a visible placeholder */
  RM.txt = function (s) {
    return RM.esc(s).replace(/\[NEED:[^\]]*\]|\[(?:Quote|Name|Role|Company)[^\]]*\]/g, function (m) { return '<span class="need">' + m + '</span>'; });
  };
  RM.isNeed = function (s) { return /^\s*\[NEED:[^\]]*\]\s*$/.test(s); };
  /* run cb(true/false) as el enters/leaves the viewport; also false when the tab is hidden */
  RM.onScreen = function (el, cb, margin) {
    var vis = false;
    function emit() { cb(vis && !document.hidden); }
    document.addEventListener('visibilitychange', emit);
    if (!('IntersectionObserver' in window)) { vis = true; emit(); return; }
    new IntersectionObserver(function (e) { vis = e[0].isIntersecting; emit(); }, { rootMargin: margin || '80px' }).observe(el);
  };

  /* ---------- analytics ---------- */
  RM.track = function (event, data) {
    var payload = Object.assign({ event: event }, data || {});
    if (window.dataLayer && window.dataLayer.push) window.dataLayer.push(payload);
    else if (window.console) console.debug('[rm]', payload);
  };

  /* ---------- smooth scroll target helper (Lenis when present) ---------- */
  RM.scrollTo = function (target, opts) {
    opts = opts || {};
    var el = typeof target === 'string' ? RM.$(target) : target;
    if (!el) return;
    var off = opts.offset != null ? opts.offset : -12;
    if (RM.lenis) RM.lenis.scrollTo(el, { offset: off, duration: 1.2, onComplete: opts.done });
    else {
      var y = el.getBoundingClientRect().top + window.scrollY + off;
      window.scrollTo({ top: y, behavior: RM.flags.rm ? 'auto' : 'smooth' });
      if (opts.done) setTimeout(opts.done, RM.flags.rm ? 30 : 700);
    }
  };

  /* =====================================================================
     RENDER · build the data-driven parts of the page
     ===================================================================== */
  var $ = RM.$;
  var reviewWork = C.REVIEW_MODE || C.SHOW_WORK;
  var reviewVoices = C.REVIEW_MODE || C.SHOW_VOICES;

  /* logo wall: the list repeats until wider than any screen, then doubles so the
     -50% loop is seamless. Hover swaps the name for its stat (first-draft behaviour). */
  (function () {
    var ul = $('#logos'); if (!ul) return;
    var base = []; for (var i = 0; i < 4; i++) base = base.concat(RM.LOGOS);
    var list = base.concat(base);
    ul.innerHTML = list.map(function (l, k) {
      var stat = l.v ? '<span class="marquee-stat" aria-hidden="true"><span class="marquee-stat-v">' +
        RM.icon(l.up ? 'up' : 'down', 'marquee-arrow' + (l.up ? ' is-up' : '')) + RM.esc(l.v) + '</span>' +
        '<span class="marquee-stat-l">' + RM.esc(l.l) + '</span></span>' : '';
      return '<li class="marquee-cell' + (l.v ? ' has-stat' : '') + '"' + (k >= RM.LOGOS.length ? ' aria-hidden="true"' : '') +
        (l.color ? ' style="--brand-l:' + l.color + ';--brand-d:' + l.dark + '"' : '') +
        '><span class="marquee-name">' + RM.esc(l.name) + '</span>' + stat + '</li>';
    }).join('');
  })();

  /* selected work */
  (function () {
    var grid = $('#workGrid'), work = $('#work');
    if (!grid) return;
    if (!reviewWork || !RM.WORK.length) { work.hidden = true; return; }
    if (!C.REVIEW_MODE) RM.$$('.work-need').forEach(function (n) { n.hidden = true; });
    grid.innerHTML = RM.WORK.map(function (w, i) {
      var img = w.img
        ? '<img src="' + RM.esc(w.img) + '" alt="' + RM.esc(w.client) + ' project" width="1000" height="800" loading="lazy">'
        : '<span class="work-ph work-ph-' + (w.art || 1) + '" aria-hidden="true"></span><span class="ph-tag" aria-hidden="true"><b>Image slot</b> Case study · 1600 × 1280 · JPG/WebP</span>';
      return '<article class="work-card"><div class="work-img">' + img + '</div>' +
        '<div class="work-meta"><h3>' + RM.txt(w.client) + '</h3><p>' + RM.txt(w.line) + '</p>' +
        '<a class="text-link" href="#contact" data-cta="work-' + (i + 1) + '">Get a call back about a project like this ' + RM.icon('arrowRight', 'arrow') + '</a></div></article>';
    }).join('');
  })();

  /* card track glyphs: Hugeicons stroke-rounded (js/icons.js) */
  (function () {
    var ol = $('#track'); if (!ol) return;
    ol.innerHTML = RM.TRACK.map(function (t) {
      return '<li class="card' + (t.studio ? ' card-studio zone-dark' : '') + '">' +
        RM.icon(t.glyph, 'card-glyph') +
        '<span class="card-num" aria-hidden="true">' + t.n + '</span>' +
        '<div class="card-body"><h3>' + RM.esc(t.title) + '</h3><p>' + RM.esc(t.line) + '</p>' +
        '<a class="card-go" href="' + t.href + '">See details ' + RM.icon('arrowRight', 'arrow') + '<span class="sr-only"> about ' + RM.esc(t.title) + '</span></a></div></li>';
    }).join('');
  })();

  /* service motifs: one red stroke each (.m-red) */
  function motif(kind) {
    var t = function (x, y, s, a) { return '<text class="m-txt" x="' + x + '" y="' + y + '"' + (a ? ' text-anchor="' + a + '"' : '') + '>' + s + '</text>'; };
    switch (kind) {
      case 'roadmap': return '<svg viewBox="0 0 400 400" class="motif motif-road">' +
        '<path class="m-line" stroke-dasharray="4 6" d="M40 330 C 120 330, 110 250, 180 240 S 260 170, 280 130 S 330 70, 360 60"/>' +
        '<path class="m-red draw" d="M40 330 C 120 330, 110 250, 180 240 S 260 170, 280 130 S 330 70, 360 60"/>' +
        '<g class="pop"><circle class="m-node" cx="40" cy="330" r="9"/>' + t(31, 356, 'MAP') + '</g>' +
        '<g class="pop"><circle class="m-node" cx="180" cy="240" r="9"/>' + t(196, 258, 'RANK') + '</g>' +
        '<g class="pop"><circle class="m-node" cx="280" cy="130" r="9"/>' + t(264, 134, 'PILOT', 'end') + '</g>' +
        '<g class="pop"><circle class="m-hot" cx="360" cy="60" r="11"/>' + t(360, 36, 'SCALE', 'middle') + '</g></svg>';
      case 'panels': return '<svg viewBox="0 0 400 400" class="motif">' +
        '<g class="pop"><rect class="m-panel" x="40" y="50" width="220" height="150" rx="8"/><rect class="m-soft" x="58" y="70" width="90" height="10" rx="5"/><rect class="m-soft" x="58" y="92" width="160" height="8" rx="4"/><rect class="m-soft" x="58" y="108" width="130" height="8" rx="4"/><rect class="m-btn" x="58" y="150" width="70" height="28" rx="4"/></g>' +
        '<g class="pop"><rect class="m-panel" x="150" y="170" width="210" height="180" rx="8"/><circle class="m-node" cx="176" cy="200" r="10"/><rect class="m-soft" x="196" y="194" width="120" height="12" rx="6"/><rect class="m-panel2" x="230" y="226" width="110" height="34" rx="12"/><rect class="m-soft" x="168" y="276" width="140" height="34" rx="12"/>' + t(176, 337, 'APPROVE · EDIT · REJECT') + '</g>' +
        '<g class="pop"><rect class="m-panel" x="40" y="250" width="120" height="100" rx="8"/><path class="m-red draw" d="M56 320 L80 300 L100 310 L140 272"/></g></svg>';
      case 'graph': return '<svg viewBox="0 0 400 400" class="motif">' +
        '<path class="m-line draw" d="M110 100 L166 200"/><path class="m-line draw" d="M110 200 L166 200"/><path class="m-line draw" d="M110 300 L166 200"/>' +
        '<path class="m-red draw" d="M234 200 L290 120"/><path class="m-red draw" d="M234 200 L290 200"/><path class="m-red draw" d="M234 200 L290 280"/>' +
        '<g class="pop"><rect class="m-node" x="30" y="84" width="80" height="32" rx="4"/>' + t(70, 105, 'DOCS', 'middle') + '</g>' +
        '<g class="pop"><rect class="m-node" x="30" y="184" width="80" height="32" rx="4"/>' + t(70, 205, 'DATA', 'middle') + '</g>' +
        '<g class="pop"><rect class="m-node" x="30" y="284" width="80" height="32" rx="4"/>' + t(70, 305, 'APIS', 'middle') + '</g>' +
        '<g class="pop"><circle class="m-core" cx="200" cy="200" r="34"/>' + t(200, 205, 'LLM', 'middle') + '</g>' +
        '<g class="pop"><rect class="m-node" x="290" y="104" width="84" height="32" rx="4"/>' + t(332, 125, 'AGENTS', 'middle') + '</g>' +
        '<g class="pop"><rect class="m-node" x="290" y="184" width="84" height="32" rx="4"/>' + t(332, 205, 'APPS', 'middle') + '</g>' +
        '<g class="pop"><rect class="m-node" x="290" y="264" width="84" height="32" rx="4"/>' + t(332, 285, 'SYSTEMS', 'middle') + '</g></svg>';
      case 'loop':
        var R = 130, C0 = 2 * Math.PI * R, nodes = RM.LOOP.map(function (name, i) {
          var a = (-90 + i * 60) * Math.PI / 180, x = 200 + R * Math.cos(a), y = 200 + R * Math.sin(a);
          var approve = name === 'Approve', side = Math.abs(x - 200) > 20;
          /* side nodes: label beside the dot, outside the ring; top and bottom: above / below */
          var lx = side ? x + (x > 200 ? 20 : -20) : x, ly = side ? y + 4 : y + (y < 200 ? -20 : 30);
          var anchor = side ? (x > 200 ? 'start' : 'end') : 'middle';
          return '<g class="loop-node' + (approve ? ' is-approve' : '') + '"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (approve ? 13 : 10) + '"/>' +
            t(lx.toFixed(1), ly.toFixed(1), name.toUpperCase(), anchor) + '</g>';
        }).join('');
        return '<svg viewBox="0 0 400 400" class="motif motif-loop">' +
          '<circle class="loop-ring" cx="200" cy="200" r="' + R + '"/>' +
          '<circle class="loop-prog m-red" cx="200" cy="200" r="' + R + '" transform="rotate(-90 200 200)" stroke-dasharray="' + C0.toFixed(1) + '" stroke-dashoffset="' + C0.toFixed(1) + '" data-len="' + C0.toFixed(1) + '"/>' +
          nodes + '<text class="m-txt loop-cap" x="200" y="196" text-anchor="middle">AGENT LOOP</text><text class="loop-center" x="200" y="226" text-anchor="middle">Knowledge</text></svg>';
      case 'conveyor': return '<svg viewBox="0 0 400 400" class="motif">' +
        '<line class="m-line" x1="0" y1="250" x2="400" y2="250"/>' +
        '<g class="pop"><rect class="m-panel" x="40" y="150" width="80" height="100" rx="6"/>' + t(80, 140, 'INTAKE', 'middle') + '</g>' +
        '<g class="pop"><rect class="m-panel" x="160" y="150" width="80" height="100" rx="6"/>' + t(200, 140, 'AI', 'middle') + '</g>' +
        '<g class="pop"><rect class="m-panel" x="280" y="150" width="80" height="100" rx="6"/>' + t(320, 140, 'PEOPLE', 'middle') + '</g>' +
        '<rect class="m-item" x="66" y="226" width="20" height="20" rx="3"/><rect class="m-item" x="190" y="226" width="20" height="20" rx="3"/><rect class="m-item" x="214" y="226" width="20" height="20" rx="3"/>' +
        '<path class="m-red draw" d="M120 200 C 142 200, 142 180, 160 180"/>' +
        '<path class="m-red draw" d="M240 200 C 262 200, 262 180, 280 180"/>' +
        /* captions stacked and centred so both fit inside the frame */
        t(200, 300, 'AI TAKES THE VOLUME', 'middle') + t(200, 324, 'PEOPLE TAKE THE EXCEPTIONS', 'middle') + '</svg>';
    }
    return '';
  }
  RM.motif = motif;

  /* service switcher: shared desktop stage + panels (each panel carries its own art for mobile) */
  (function () {
    var stage = $('#switchStage'), panels = $('#switchPanels'), dots = $('#switchDots');
    if (!stage) return;
    stage.innerHTML = RM.SERVICES.map(function (s, i) {
      return '<div class="stage-art' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">' + motif(s.motif) + '</div>';
    }).join('');
    panels.innerHTML = RM.SERVICES.map(function (s, i) {
      return '<article class="panel' + (i === 0 ? ' on' : '') + '" id="' + s.id + '" data-i="' + i + '" aria-labelledby="' + s.id + '-h">' +
        '<div class="panel-art" aria-hidden="true">' + motif(s.motif) + '</div>' +
        '<p class="panel-idx"><span>' + s.n + '</span> ' + RM.esc(s.name) + '</p>' +
        '<h3 id="' + s.id + '-h">' + RM.esc(s.heading) + '</h3>' +
        '<p class="body">' + RM.esc(s.body) + '</p>' +
        (s.motif === 'loop' ? '<p class="sr-only">The agent loop: knowledge, reason, plan, then a person approves, then the agent acts and learns.</p>' : '') +
        '<ul class="tags">' + s.tags.map(function (t) { return '<li class="tag">' + RM.esc(t) + '</li>'; }).join('') + '</ul>' +
        '<a class="btn btn-ghost" href="#contact" data-cta="service-' + s.n + '">Get a call back ' + RM.icon('arrowRight', 'arrow') + '</a></article>';
    }).join('');
    dots.innerHTML = RM.SERVICES.map(function (s, i) {
      return '<button type="button" role="tab" class="dot' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" aria-label="' + RM.esc(s.name) + '" aria-selected="' + (i === 0) + '"></button>';
    }).join('');
  })();

  /* image slots: <figure class="ph" data-ph="render|photo|video|screen" data-ph-label data-ph-size [data-src data-alt data-poster]>.
     With data-src the real file shows; without it a designed placeholder shows with a tag saying what goes there. */
  (function () {
    var STAR = 'M100 62 C104 92 110 98 140 102 C110 106 104 112 100 142 C96 112 90 106 60 102 C90 98 96 92 100 62Z';
    var ART = {
      render: '<span class="ph-glow"></span><span class="ph-float"><svg class="ph-svg" viewBox="0 0 200 200">' +
        '<rect class="ph-chip c1" x="0" y="20" width="44" height="32" rx="9"/><rect class="ph-chip c2" x="164" y="30" width="36" height="36" rx="9"/>' +
        '<rect class="ph-chip c3" x="166" y="138" width="34" height="26" rx="7"/>' +
        '<path class="ph-wire" d="M44 36 C72 36 82 54 90 62 M164 48 C134 48 118 56 110 62 M166 151 C162 151 160 151 158 151"/>' +
        '<circle class="ph-dome" cx="100" cy="66" r="18"/><rect class="ph-body" x="44" y="66" width="112" height="104" rx="28"/><path class="ph-star" d="' + STAR + '" transform="translate(0 16)"/></svg></span>',
      photo: '<svg class="ph-svg ph-icon" viewBox="0 0 64 64"><rect class="ph-line" x="6" y="12" width="52" height="40" rx="6"/><circle class="ph-dot" cx="44" cy="24" r="5"/><path class="ph-line" d="M8 46 L24 30 L36 42 L44 34 L56 46"/></svg>',
      video: '<span class="ph-glow"></span><span class="ph-play"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>',
      screen: '<span class="ph-browser"><span class="ph-bar"><i></i><i></i><i></i></span><span class="ph-page">' +
        '<span class="ph-block w60"></span><span class="ph-block w40"></span><span class="ph-cols"><span></span><span></span><span class="is-off"></span></span>' +
        '<span class="ph-flag">Stalled at pilot</span></span></span>'
    };
    RM.$$('[data-ph]').forEach(function (f) {
      var kind = f.dataset.ph, src = f.dataset.src, alt = RM.esc(f.dataset.alt || '');
      f.classList.add('ph-' + kind);
      if (src) {
        f.classList.add('has-media');
        f.innerHTML = kind === 'video'
          ? '<video src="' + RM.esc(src) + '"' + (f.dataset.poster ? ' poster="' + RM.esc(f.dataset.poster) + '"' : '') + ' muted loop playsinline autoplay preload="metadata" aria-label="' + alt + '"></video>'
          : '<img src="' + RM.esc(src) + '" alt="' + alt + '" loading="lazy" decoding="async">';
        return;
      }
      f.setAttribute('aria-hidden', 'true');
      f.innerHTML = '<span class="ph-art">' + (ART[kind] || '') + '</span>' +
        '<figcaption class="ph-tag"><b>Image slot</b> ' + RM.esc(f.dataset.phLabel || '') + ' · ' + RM.esc(f.dataset.phSize || '') + '</figcaption>';
    });
  })();

  /* how we work steps */
  (function () {
    var ol = $('#steps'); if (!ol) return;
    ol.innerHTML = RM.STEPS.map(function (s, i) {
      return '<li class="step' + (s.img ? ' has-art' : '') + '" data-i="' + i + '"><div class="step-in">' +
        '<div class="step-title"><span class="step-n">' + s.n + '</span><h3>' + s.title + '</h3></div>' +
        '<div class="step-rows">' +
          '<div class="step-row"><p class="step-who">AI does</p><p>' + RM.esc(s.ai) + '</p></div>' +
          '<div class="step-row"><p class="step-who">Human expert decides</p><p>' + RM.esc(s.lead) + '</p></div>' +
        '</div>' +
        '<div class="split" aria-hidden="true"><span class="split-ai"><b>AI</b><i><b>AI</b></i></span><span class="split-lead"><b>Human expert</b><i><b>Human expert</b></i></span></div>' +
        '<p class="sr-only">In this step AI does the volume and the human expert makes the decision.</p>' +
        (s.img ? '<figure class="step-art"><img src="' + s.img + '" alt="' + RM.esc(s.alt || '') + '" width="' + s.imgW + '" height="' + s.imgH + '"' +
          /* glow: % of the picture's width its soft glow hangs below the cards' edge, so the edge (not the glow) lines up with the bar */
          (s.glow ? ' style="margin-bottom:-' + s.glow + '%"' : '') + ' loading="lazy" decoding="async"></figure>' : '') +
        '</div></li>';
    }).join('');
  })();

  /* studio ticker (two copies for a seamless loop) */
  (function () {
    var tk = $('#ticker'); if (!tk) return;
    var row = RM.TICKER.map(function (w) { return '<span>' + RM.esc(w) + '</span>'; }).join('');
    tk.innerHTML = row + row;
  })();

  /* voices */
  (function () {
    var sec = $('#voices'); if (!sec) return;
    if (!reviewVoices) { sec.hidden = true; return; }
    if (!RM.QUOTES.length) {                          /* no real quotes yet: hide the carousel block */
      ['#quotes', '#quoteDots'].forEach(function (q) { $(q).hidden = true; });
      var eb = $('#voices .eyebrow'); if (eb) eb.hidden = true;
    }
    $('#quotes').innerHTML = RM.QUOTES.map(function (q, i) {
      return '<figure class="quote' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" aria-hidden="' + (i !== 0) + '"><blockquote>' + RM.txt(q.quote) + '</blockquote>' +
        '<figcaption>' + RM.txt(q.name) + ', ' + RM.txt(q.role) + ', ' + RM.txt(q.company) +
'</figcaption></figure>';
    }).join('');
    $('#quoteDots').innerHTML = RM.QUOTES.map(function (q, i) {
      return '<button type="button" role="tab" class="dot' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" aria-label="Quote ' + (i + 1) + '" aria-selected="' + (i === 0) + '"></button>';
    }).join('');
    $('#leads').innerHTML = RM.LEADS.map(function (l) {
      var ph = l.photo ? '<img src="' + RM.esc(l.photo) + '" alt="" width="400" height="500" loading="lazy">' : '<span class="lead-ph" aria-hidden="true">' + RM.esc(l.mono || '') + '</span>';
      return '<li class="lead"><div class="lead-img">' + ph + '</div><p class="lead-name">' + RM.txt(l.name) + '</p><p class="lead-role">' + RM.txt(l.role) + '</p></li>';
    }).join('');
  })();

  /* start-here tiles */
  (function () {
    var box = $('#tiles'); if (!box) return;
    box.innerHTML = RM.TILES.map(function (t, i) {
      var open = i === 0;
      return '<div class="tile' + (open ? ' open' : '') + '" data-id="' + t.id + '">' +
        '<span class="tile-glow" aria-hidden="true"></span>' +
        '<button type="button" class="tile-head" aria-expanded="' + open + '" aria-controls="tile-' + t.id + '" id="tile-b-' + t.id + '">' +
          '<span class="tile-n">0' + (i + 1) + '</span><span class="tile-t">' + RM.esc(t.title) + '</span><span class="tile-plus" aria-hidden="true">+</span></button>' +
        '<div class="tile-body" id="tile-' + t.id + '" role="region" aria-labelledby="tile-b-' + t.id + '"><div class="tile-inner">' +
          '<p>' + RM.txt(t.line) + '</p>' +
          '<a class="btn btn-1 btn-s" href="#contact" data-cta="tile-' + t.id + '" data-stage="' + RM.esc(t.stage) + '" data-tile="' + RM.esc(t.title) + '"' + (open ? '' : ' tabindex="-1"') + '><span class="sheen"></span>Get a call back ' + RM.icon('arrowRight', 'arrow') + '</a>' +
        '</div></div></div>';
    }).join('');
  })();

  /* FAQ + FAQPage schema (only answered questions) */
  (function () {
    var list = $('#faqList'); if (!list) return;
    list.innerHTML = RM.FAQ.map(function (f) {
      return '<details class="qa" data-id="' + f.id + '"><summary><span>' + RM.esc(f.q) + '</span><span class="qa-plus" aria-hidden="true">+</span></summary>' +
        '<div class="qa-a"><p>' + RM.txt(f.a) + '</p></div></details>';
    }).join('');
    var answered = RM.FAQ.filter(function (f) { return !/\[NEED:/.test(f.a); });
    if (answered.length) {
      var s = document.createElement('script'); s.type = 'application/ld+json';
      s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: answered.map(function (f) { return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; }) });
      document.head.appendChild(s);
    }
  })();

  /* production: hide review-only placeholder notes */
  if (!C.REVIEW_MODE) RM.$$('.proof-need,.process-need').forEach(function (n) { n.hidden = true; });

  /* =====================================================================
     THEME · dark default, View Transition circle from the toggle
     ===================================================================== */
  RM.themeHooks = [];
  (function () {
    var btn = $('#tgl'); if (!btn) return;
    function label() {
      var dark = root.getAttribute('data-ui') === 'dark';
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    label();
    function apply() {
      var next = root.getAttribute('data-ui') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-ui', next);
      try { localStorage.setItem('rm-ui', next); } catch (e) {}
      label();
      RM.themeHooks.forEach(function (f) { f(next); });
    }
    btn.addEventListener('click', function () {
      if (!document.startViewTransition || RM.flags.rm) { apply(); return; }
      var b = btn.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
      var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var vt = document.startViewTransition(apply);
      vt.ready.then(function () {
        document.documentElement.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' });
      }).catch(function () {});
    });
  })();

  /* =====================================================================
     GSAP + LENIS setup (motion only)
     ===================================================================== */
  if (RM.flags.motion) {
    var plugins = [ScrollTrigger];
    if (window.SplitText) plugins.push(SplitText);
    if (window.CustomEase) plugins.push(CustomEase);
    gsap.registerPlugin.apply(gsap, plugins);
    RM.ease = window.CustomEase ? (CustomEase.create('rm', '0.2,0.8,0.2,1'), 'rm') : 'power3.out';
    gsap.defaults({ ease: RM.ease });
    if (window.Lenis) {
      RM.lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      root.classList.add('lenis');
      RM.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { RM.lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* in-page anchors go through the smooth scroller; CTAs are handled in form.js */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-cta') || a.getAttribute('href') === '#contact') return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var tgt = $(id); if (!tgt) return;
    e.preventDefault();
    if (RM.goTo && RM.goTo(id)) return;           /* interactions.js routes service anchors */
    RM.scrollTo(tgt, { offset: id === '#top' ? 0 : -12 });
    history.replaceState(null, '', id);
  });
})();
