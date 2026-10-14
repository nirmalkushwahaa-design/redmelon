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
    var base = [], reps = Math.max(1, Math.ceil(12 / RM.LOGOS.length)); for (var i = 0; i < reps; i++) base = base.concat(RM.LOGOS);
    ul.style.animationDuration = Math.round(base.length * 4.6) + 's';   /* same speed per name however long the list */
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
    /* data-limit="2" on the grid shows only the first projects (home page teaser) */
    var limit = +grid.dataset.limit || RM.WORK.length;
    grid.innerHTML = RM.WORK.slice(0, limit).map(function (w, i) {
      var img = w.img
        ? '<img src="' + RM.esc(w.img) + '" alt="' + RM.esc(w.client) + ': ' + RM.esc(w.line) + '" width="756" height="500" loading="lazy" decoding="async">'
        : '<span class="work-ph work-ph-' + (w.art || 1) + '" aria-hidden="true"></span><span class="ph-tag" aria-hidden="true"><b>Image slot</b> Case study · 1600 × 1280 · JPG/WebP</span>';
      var label = function (id) { var t = (RM.WORK_TAGS || []).filter(function (x) { return x.id === id; })[0]; return t ? t.label : id; };
      var tags = (w.tags || []).map(function (t) { return '<li>' + RM.esc(label(t)) + '</li>'; }).join('');
      var href = w.slug ? 'project.html?p=' + encodeURIComponent(w.slug) : '';
      return '<article class="work-card' + (i % 2 ? ' alt' : '') + (href ? ' has-link' : '') + '" data-tags="' + RM.esc((w.tags || []).join(' ')) + '"><div class="work-img">' + img + '</div>' +
        '<div class="work-meta"><h3>' + (href ? '<a class="work-link" href="' + href + '">' + RM.txt(w.client) + '</a>' : RM.txt(w.client)) + '</h3><p>' + RM.txt(w.line) + '</p>' +
        (tags ? '<ul class="work-tags" aria-label="Tags">' + tags + '</ul>' : '') + '</div></article>';
    }).join('');
  })();

  /* work page filter strip: one tag at a time; 'All' clears it. work.html?tag=retail opens filtered. */
  (function () {
    var bar = $('#workFilter'), grid = $('#workGrid'); if (!bar || !grid || !RM.WORK_TAGS) return;
    var cards = RM.$$('.work-card', grid), status = $('#workCount'), cur = 'all', busy = null;
    var used = RM.WORK_TAGS.filter(function (t) { return cards.some(function (c) { return c.dataset.tags.split(' ').indexOf(t.id) > -1; }); });
    bar.innerHTML = [{ id: 'all', label: 'All' }].concat(used).map(function (t) {
      var n = t.id === 'all' ? cards.length : cards.filter(function (c) { return c.dataset.tags.split(' ').indexOf(t.id) > -1; }).length;
      return '<button type="button" class="wf" data-tag="' + t.id + '" aria-pressed="' + (t.id === 'all') + '">' + RM.esc(t.label) + '<span class="wf-n">' + n + '</span></button>';
    }).join('');
    var btns = RM.$$('.wf', bar);
    function match(c, tag) { return tag === 'all' || c.dataset.tags.split(' ').indexOf(tag) > -1; }
    function layout() {        /* second, fourth... visible card drops down (the staggered grid) */
      var k = 0; cards.forEach(function (c) { if (!c.hidden) { c.classList.toggle('alt', k % 2 === 1); k++; } });
      if (status) status.textContent = k + (k === 1 ? ' project' : ' projects');
    }
    function apply(tag, user) {
      if (tag === cur && user) tag = 'all';
      cur = tag;
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.tag === tag); });
      try { var u = new URL(location.href); if (tag === 'all') u.searchParams.delete('tag'); else u.searchParams.set('tag', tag); history.replaceState(null, '', u); } catch (e) {}
      if (user) RM.track('work_filter', { tag: tag });
      var show = cards.filter(function (c) { return match(c, tag); }), hide = cards.filter(function (c) { return !match(c, tag); });
      if (!user || !RM.flags.motion) {
        cards.forEach(function (c) { c.hidden = !match(c, tag); if (window.gsap) gsap.set(c, { clearProps: 'opacity,transform' }); });
        layout(); if (window.ScrollTrigger) ScrollTrigger.refresh(); return;
      }
      if (busy) busy.kill();
      /* out: cards leaving fade and sink; in: the new set rises in with a stagger */
      busy = gsap.timeline()
        .to(cards.filter(function (c) { return !c.hidden; }), { opacity: 0, y: 24, duration: .28, ease: 'power2.in', stagger: .03 })
        .add(function () {
          hide.forEach(function (c) { c.hidden = true; }); show.forEach(function (c) { c.hidden = false; });
          layout(); ScrollTrigger.refresh();
          RM.$$('.work-img', grid).forEach(function (w) { gsap.set(w, { clipPath: 'inset(0% 0 0 0)' }); });
        })
        .fromTo(show, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: .6, stagger: .08, ease: RM.ease, clearProps: 'transform' });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.tag, true); if (RM.sfx) RM.sfx('tick'); }); });
    var start = null; try { start = new URL(location.href).searchParams.get('tag'); } catch (e) {}
    apply(btns.some(function (b) { return b.dataset.tag === start; }) ? start : 'all', false);
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
    /* no background panel; only a clip area so the conveyor items stay inside the drawing */
    var panel = function (id) { return '<defs><clipPath id="' + id + 'C"><rect x="6" y="6" width="388" height="388"/></clipPath></defs>'; };
    var t = function (x, y, s, a) { return '<text class="m-txt" x="' + x + '" y="' + y + '"' + (a ? ' text-anchor="' + a + '"' : '') + '>' + s + '</text>'; };
    switch (kind) {
      /* AI strategy: canvas drawn by js/roadmap.js, driven by scroll */
      case 'roadmap': return '<div class="motif motif-roadmap"><canvas class="rmap" role="img" aria-label="Many messy experiments settle into one clean rising line that passes Experiment, Prioritise and Pilot and ends on Scale"></canvas></div>';
      /* AI experience: canvas drawn by js/checkpoint.js, driven by scroll */
      case 'panels': return '<div class="motif motif-roadmap"><canvas class="ckpt" role="img" aria-label="AI actions travel along a track and stop at a human review checkpoint. Most are approved, two are edited and one is sent back to the AI."></canvas></div>';
      /* AI engineering: canvas drawn by js/observe.js, driven by scroll */
      case 'graph': return '<div class="motif motif-roadmap"><canvas class="obs" role="img" aria-label="Docs, Data and APIs feed the LLM, which serves Agents, Apps and Systems. Data flows while every node shows a live metric; the APIs connection times out, retries and recovers with nothing lost."></canvas></div>';
      /* Agentic AI: canvas drawn by js/agent.js, driven by RM.setLoop from the switcher */
      case 'loop': return '<div class="motif motif-roadmap"><canvas class="agent" role="img" aria-label="An agent goes round the loop: knowledge, reason, plan, then it stops at approve until a person approves a refund, then it acts and learns."></canvas></div>';
      /* AI automation: canvas drawn by js/automation.js, driven by scroll */
      case 'conveyor': return '<div class="motif motif-roadmap"><canvas class="auto" role="img" aria-label="Two lanes of Intake, Decide and Act. The manual lane builds queues and finishes few items; the AI lane moves many items and sends exceptions to a person."></canvas></div>';
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
        '<a class="btn btn-ghost" href="#contact" data-cta="service-' + s.n + '">Explore ' + RM.esc(s.name) + ' ' + RM.icon('arrowRight', 'arrow') + '</a></article>';
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
    RM.renderSlots = function (root) { RM.$$('[data-ph]:not(.ph-done)', root).forEach(function (f) { f.classList.add('ph-done');
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
    }); };
    RM.renderSlots(document);
  })();

  /* the big idea, scrubbed by scroll (motion.js calls RM.ideaScrub with f = 0..4):
     the current word is solid; as you scroll, the next word draws in as an outline over it,
     the current one fades back, then the outline fills in and becomes the new solid word. */
  (function () {
    var box = $('#ideaWord'); if (!box) return;
    var WORDS = ['THINK', 'DESIGN', 'BUILD', 'MOVE'], A = $('.idea-a', box), B = $('.idea-b', box),
        bars = RM.$$('#ideaBars i'), pics = RM.$$('#ideaArt .idea-pic'), cur = -1, nxt = -1;
    function word(el, i) { el.firstChild.nodeValue = WORDS[i]; }
    function ramp(t, a, b) { t = (t - a) / (b - a); return t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t); }
    RM.ideaScrub = function (f) {
      f = Math.max(0, Math.min(3.999, f));
      var k = Math.floor(f), t = f - k, last = k === WORDS.length - 1;
      if (k !== cur) { if (cur >= 0 && RM.sfx) RM.sfx('whoosh'); cur = k; word(A, k); pics.forEach(function (p, n) { p.classList.toggle('on', n === k); }); }
      if (!last && k + 1 !== nxt) { nxt = k + 1; word(B, nxt); }
      var outl = last ? 0 : ramp(t, .35, .7), fill = last ? 0 : ramp(t, .72, 1), fade = last ? 0 : ramp(t, .45, .95);
      A.style.opacity = 1 - fade; A.style.transform = 'scale(' + (1 - fade * .04) + ')';
      B.style.opacity = outl; B.style.setProperty('--fill', fill);
      bars.forEach(function (b, n) { b.style.setProperty('--p', Math.max(0, Math.min(1, f - n))); });
    };
    RM.ideaScrub(RM.flags.motion ? 0 : 0);
    if (!RM.flags.motion) bars.forEach(function (b) { b.style.setProperty('--p', 1); });
  })();

  /* industries explorer: big index on the left, dark spotlight panel on the right.
     Hover, focus or click an industry to bring its panel forward. Phones: the panel opens under the chosen row. */
  (function () {
    var idx = $('#indIndex'), stage = $('#indStage'); if (!idx || !RM.INDUSTRIES) return;
    var D = RM.INDUSTRIES, n2 = function (i) { return (i < 9 ? '0' : '') + (i + 1); };
    idx.innerHTML = D.map(function (d, i) {
      return '<button class="ind-row' + (i ? '' : ' on') + '" role="tab" id="indTab-' + d.id + '" aria-controls="indPane-' + d.id + '" aria-selected="' + !i + '" data-i="' + i + '">' +
        '<span class="ind-n">' + n2(i) + '</span><span class="ind-name">' + RM.esc(d.name) + '</span>' + RM.icon('arrowRight', 'ind-arrow') + '</button>';
    }).join('') +
      '<a class="ind-row ind-row-other" href="#contact" data-cta="industry-other"><span class="ind-n">+</span><span class="ind-name">Another industry? Tell us about yours</span>' + RM.icon('arrowRight', 'ind-arrow') + '</a>';
    /* panel: the industry's clients as a logo board (wordmarks in brand colour until logo files are added) */
    var byInd = function (id) { return (RM.LOGOS || []).filter(function (l) { return l.ind === id; }); };
    stage.innerHTML = '<span class="ind-glow" aria-hidden="true"></span>' + D.map(function (d, i) {
      var cl = byInd(d.id);
      return '<div class="ind-pane' + (i ? '' : ' on') + '" role="tabpanel" id="indPane-' + d.id + '" aria-labelledby="indTab-' + d.id + '">' +
        '<div class="ind-pane-top"><span class="ind-count">' + n2(i) + ' / ' + n2(D.length - 1) + '</span><span class="ind-tag">' + RM.icon(d.icon, 'ind-tag-ico') +
          cl.length + (cl.length === 1 ? ' client' : ' clients') + '</span></div>' +
        '<h3 class="ind-pane-h">' + RM.esc(d.name) + '</h3>' +
        '<ul class="ind-logos" aria-label="Clients in ' + RM.esc(d.name) + '">' + cl.map(function (l, k) {
          return '<li class="ind-logo" style="--i:' + k + (l.dark ? ';--c:' + l.dark : '') + '">' +
            (l.logo ? '<img src="' + RM.esc(l.logo) + '" alt="' + RM.esc(l.name) + '" loading="lazy">' : '<span>' + RM.esc(l.name) + '</span>') + '</li>';
        }).join('') + '</ul>' +
        '<div class="ind-foot"><a class="btn btn-1 btn-s" href="#contact" data-cta="industry-' + d.id + '">Talk to us about ' + RM.esc(d.cta) + ' ' + RM.icon('arrowRight', 'arrow') + '</a></div></div>';
    }).join('');
    var rows = RM.$$('.ind-row[role="tab"]', idx), panes = RM.$$('.ind-pane', stage), cur = 0;
    var narrow = function () { return innerWidth <= 900; };
    function place() { /* phones: move the panel right under the active row; desktop: keep it in the right column */
      var ex = $('#indExplorer');
      if (narrow()) rows[cur].insertAdjacentElement('afterend', stage); else if (stage.parentNode !== ex) ex.appendChild(stage);
    }
    function set(i, focus) {
      if (i === cur) return; cur = i; if (RM.sfx) RM.sfx('tick');
      rows.forEach(function (r, k) { r.classList.toggle('on', k === i); r.setAttribute('aria-selected', k === i); r.tabIndex = k === i ? 0 : -1; });
      panes.forEach(function (p, k) { p.classList.toggle('on', k === i); });
      place(); if (focus) rows[i].focus();
    }
    rows.forEach(function (r, k) {
      r.tabIndex = k ? -1 : 0;
      r.addEventListener('click', function () { set(k); });
      r.addEventListener('mouseenter', function () { if (!narrow() && RM.flags.fine) set(k); });
      r.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { e.preventDefault(); set((cur + d + rows.length) % rows.length, true); }
      });
    });
    place(); addEventListener('resize', place, { passive: true });
    if (RM.renderSlots) RM.renderSlots(stage);
    /* clients.html#ind-energy (from the home page strip) opens that industry */
    var m = /^#ind-(.+)$/.exec(location.hash);
    if (m) D.forEach(function (d, k) { if (d.id === m[1]) set(k); });
  })();

  /* home page industries strip: one link per industry, into the explorer on the Clients page */
  (function () {
    var ul = $('#indStrip'); if (!ul || !RM.INDUSTRIES) return;
    ul.innerHTML = RM.INDUSTRIES.map(function (d) {
      return '<li><a class="ind-chip" href="clients.html#ind-' + d.id + '">' + RM.icon(d.icon, 'ind-chip-ico') +
        '<span>' + RM.esc(d.name) + '</span>' + RM.icon('arrowUpRight', 'arrow') + '</a></li>';
    }).join('');
  })();

  /* testimonials (Clients page): real quotes from RM.QUOTES; in review mode, three marked placeholders */
  (function () {
    var box = $('#quoteGrid'); if (!box) return;
    var list = RM.QUOTES.length ? RM.QUOTES : (C.REVIEW_MODE ? [1, 2, 3].map(function () {
      return { quote: '[Quote: one or two sentences from a client]', name: '[Name]', role: '[Role]', company: '[Company]' }; }) : []);
    if (!list.length) { box.closest('section').hidden = true; return; }
    box.innerHTML = list.map(function (q) {
      return '<figure class="say"><span class="say-mark" aria-hidden="true">“</span><blockquote>' + RM.txt(q.quote) + '</blockquote>' +
        '<figcaption><b>' + RM.txt(q.name) + '</b><span>' + RM.txt(q.role) + ', ' + RM.txt(q.company) + '</span></figcaption></figure>';
    }).join('');
  })();

  /* team (About page): RM.LEADS, roles only until real names and photos arrive */
  (function () {
    var ul = $('#team'); if (!ul) return;
    ul.innerHTML = RM.LEADS.map(function (l) {
      var ph = l.photo ? '<img src="' + RM.esc(l.photo) + '" alt="" width="400" height="500" loading="lazy">' : '<span class="lead-ph" aria-hidden="true">' + RM.esc(l.mono || '') + '</span>';
      return '<li class="lead"><div class="lead-img">' + ph + '</div><p class="lead-name">' + RM.txt(l.name) + '</p><p class="lead-role">' + RM.txt(l.role) + '</p></li>';
    }).join('');
  })();

  /* beliefs (About page) */
  (function () {
    var ol = $('#beliefs'); if (!ol || !RM.BELIEFS) return;
    ol.innerHTML = RM.BELIEFS.map(function (b, i) {
      return '<li class="belief"><span class="belief-n">0' + (i + 1) + '</span><h3>' + RM.esc(b.t) + '</h3><p>' + RM.txt(b.d) + '</p></li>';
    }).join('');
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

  /* =====================================================================
     PAGES · v2.0 is multi-page. A "#section" link whose section is not on
     this page goes to the page that holds it (e.g. #contact → contact.html).
     ===================================================================== */
  RM.ROUTES = { top: './', idea: './#idea', services: 'services.html', studio: 'services.html#studio', how: 'services.html#how',
    start: 'services.html#start', proof: 'clients.html', industries: 'clients.html', work: 'work.html', about: 'about.html',
    contact: 'contact.html', faq: 'contact.html#faq' };
  RM.route = function (scope) {
    RM.$$('a[href^="#"]', scope).forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (!id || document.getElementById(id)) return;
      var to = RM.ROUTES[id] || (/^svc-0\d$/.test(id) ? 'services.html#' + id : /^ind-/.test(id) ? 'clients.html#' + id : null);
      if (to) a.setAttribute('href', to);
    });
  };
  RM.route(document);

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
