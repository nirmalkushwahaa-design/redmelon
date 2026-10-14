/* =====================================================================
   MOTION · reveal system, the two pins, scrubs (spec section 8)
   Family A  mask / clip-path wipes   (preloader, Studio, work images, headings)
   Family B  scroll-scrubbed stories  (problem fill, PIN 1 track, PIN 2 switcher, split bars, marquee skew)
   Family C  micro-interactions       (interactions.js + CSS)
   Budget: exactly 2 pins, one easing ("rm"), reveals once at top 85%.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $ = RM.$, $$ = RM.$$;

  /* ---------- scroll depth (independent of motion) ---------- */
  (function () {
    var marks = [25, 50, 75, 100], hit = {};
    addEventListener('scroll', function () {
      var max = document.documentElement.scrollHeight - innerHeight; if (max <= 0) return;
      var p = scrollY / max * 100;
      marks.forEach(function (m) { if (p >= m - .5 && !hit[m]) { hit[m] = 1; RM.track('scroll_depth', { percent: m }); } });
    }, { passive: true });
  })();

  if (!RM.flags.motion) return;                 /* reduced motion or GSAP missing: everything stays in its final state */

  var E = RM.ease, D = { reveal: .8, wipe: 1.1, stagger: .06 };
  var START = 'top 85%';

  /* ---------- A · headings: SplitText line masks rise from 105% ---------- */
  function splitReveal(el, trigger, start, delay) {
    if (!el) return null;                       /* v2.0: not every page has every heading */
    if (!window.SplitText) {
      return gsap.from(el, { opacity: 0, y: 24, duration: D.reveal, delay: delay || 0, scrollTrigger: trigger === false ? null : { trigger: trigger || el, start: start || START, once: true } });
    }
    return SplitText.create(el, {
      type: 'lines,words', mask: 'lines', autoSplit: true,
      onSplit: function (self) {
        return gsap.from(self.lines, { yPercent: 105, duration: D.reveal, stagger: D.stagger, delay: delay || 0,
          scrollTrigger: trigger === false ? null : { trigger: trigger || el, start: start || START, once: true } });
      }
    });
  }

  /* hero: held until the curtain lifts */
  /* (home hero, and the page header on every other page: both use #heroH1 + .hero-fade) */
  var heroFade = $$('.hero-fade'), heroH = $('#heroH1');
  if (heroFade.length) gsap.set(heroFade, { opacity: 0, y: 16 });
  if (heroH) gsap.set(heroH, { opacity: 0 });
  RM.afterPreload(function () {
    if (heroH) { gsap.set(heroH, { opacity: 1 }); splitReveal(heroH, false); }
    if (heroFade.length) gsap.to(heroFade, { opacity: 1, y: 0, duration: D.reveal, stagger: D.stagger, delay: .35 });
  });

  /* every other H2, except the Studio one which waits for its wipe */
  $$('[data-split]').forEach(function (el) {
    if (el === heroH || el.classList.contains('studio-h') || el.closest('#problem')) return;
    splitReveal(el);
  });

  /* ---------- reveals: main visuals + batched card groups ---------- */
  function batch(sel) {
    var els = $$(sel); if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 24 });
    ScrollTrigger.batch(els, { start: START, once: true,
      onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: D.reveal, stagger: D.stagger, overwrite: true }); } });
  }
  batch('.tiles .tile');
  /* industries: index rows slide in, then the spotlight panel rises */
  (function () {
    var ex = $('#indExplorer'); if (!ex) return;
    var rows = $$('.ind-row', ex);
    gsap.set(rows, { opacity: 0, x: -24 }); gsap.set('#indStage', { opacity: 0, y: 40 });
    ScrollTrigger.create({ trigger: ex, start: 'top 80%', once: true, onEnter: function () {
      gsap.to(rows, { opacity: 1, x: 0, duration: .7, stagger: .07, ease: E, clearProps: 'transform' });
      gsap.to('#indStage', { opacity: 1, y: 0, duration: 1, delay: .15, ease: E, clearProps: 'transform' });
    } });
  })();
  batch('.lead');
  batch('.belief');
  batch('.say');
  batch('.ind-chip');
  batch('.detail');
  batch('.pj-card');
  batch('.brief-shell');
  batch('.switch-stage');

  /* selected work: rectangle wipe from the bottom */
  $$('.work-img').forEach(function (w) {
    gsap.fromTo(w, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: D.wipe,
      scrollTrigger: { trigger: w, start: START, once: true } });
  });

  /* ---------- problem: "fade-in-blur" word reveal (motion-primitives TextEffect,
     preset fade-in-blur, speedReveal 1.1, speedSegment 0.3), heading then body ---------- */
  (function () {
    var sec = $('#problem'); if (!sec) return;
    var SPEED_REVEAL = 1.1, SPEED_SEGMENT = 0.3;
    var STAGGER = 0.05 / SPEED_REVEAL;            /* per-word delay */
    var DURATION = 0.3 / SPEED_SEGMENT;           /* each word's fade */
    function words(el) {
      var label = el.textContent.trim();
      el.setAttribute('aria-label', label);
      el.innerHTML = label.split(/\s+/).map(function (w) { return '<span class="fx-w" aria-hidden="true">' + RM.esc(w) + '</span>'; }).join(' ');
      return $$('.fx-w', el);
    }
    var all = words($('h2', sec)).concat(words($('#problemBody')));
    gsap.set(all, { opacity: 0, filter: 'blur(12px)', y: 20 });
    ScrollTrigger.create({ trigger: sec, start: 'top 75%', once: true, onEnter: function () {
      gsap.to(all, { opacity: 1, filter: 'blur(0px)', y: 0, duration: DURATION, stagger: STAGGER, ease: E,
        onComplete: function () { gsap.set(all, { clearProps: 'filter,transform,willChange' }); } });
    } });
  })();

  /* ---------- the two pins (desktop only) ---------- */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', function () {
    /* PIN 1 · What we do card track */
    var track = $('#track'), view = $('#trackView');
    function dist() { return Math.max(0, track.scrollWidth - view.clientWidth); }
    if (track) gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '#trackPin', start: 'top top', end: function () { return '+=' + dist(); },
        pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1 } });

    /* PIN 2 · service switcher */
    var sw = $('#switch'); if (!sw) return;        /* the switcher lives on the Services page only */
    var list = $('#switchPanels'), panels = $$('.panel', sw), N = panels.length;
    sw.classList.add('is-pinned');
    function span() { return panels[N - 1].offsetTop - panels[0].offsetTop; }
    /* HOLD: extra pinned scroll after 05 is in place, so its animation has room to play (share of the list's scroll) */
    var HOLD = .16;
    var st = ScrollTrigger.create({ trigger: sw, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * .7 * N * (1 + HOLD)); },
      pin: true, scrub: true, invalidateOnRefresh: true,
      animation: gsap.timeline().fromTo(list, { y: 0 }, { y: function () { return -span(); }, ease: 'none', duration: 1 }).to({}, { duration: HOLD }),
      onUpdate: function (s) { if (s.progress > 0) pick(); } });   /* at 0 the early trigger decides */
    /* the illustration switches as soon as the next service's top reaches the middle of the illustration,
       not when it has fully settled */
    var stage = $('#switchStage');
    function pick() {
      var sr = stage.getBoundingClientRect(), mid = sr.top + sr.height / 2, k = 0;
      for (var i = 1; i < N; i++) if (panels[i].getBoundingClientRect().top <= mid) k = i;
      RM.setService(k);
      var t3 = panels[3].getBoundingClientRect().top;
      /* the ring fills slowly across the whole time 04 is on screen: from its switch-in, finishing with time to spare before 05 comes up */
      var gap = panels[4].offsetTop - panels[3].offsetTop;
      RM.setLoop(Math.max(0, Math.min(1, (mid - t3) / Math.max(1, gap * .62))));
    }
    /* once 05 is in place, How we work comes straight up under it: the empty band below 05
       is covered by pulling the next section up (it paints over the end of the pinned frame) */
    var next = sw.closest('section').nextElementSibling, art = $('.switch-art', sw);
    function tuck() {
      var y = gsap.getProperty(list, 'y') || 0, top = sw.getBoundingClientRect().top;
      var bottom05 = panels[0].getBoundingClientRect().top - y - top + panels[N - 1].offsetHeight;
      var gap = Math.max(0, Math.round(innerHeight - bottom05 - 64));
      if (next) next.style.marginTop = -gap + 'px';
      /* illustration sits level with the service text: its centre lines up with 01's centre */
      art.style.top = '0px';
      var a = art.getBoundingClientRect(), p0 = panels[0].getBoundingClientRect();
      art.style.top = Math.round((p0.top - y + p0.height / 2) - (a.top + a.height / 2)) + 'px';
    }
    tuck(); ScrollTrigger.addEventListener('refreshInit', tuck);
    /* the 01 illustration appears (and draws in) as soon as the section comes into view, before 01 arrives;
       it hides again on the way back up */
    var early = ScrollTrigger.create({ trigger: sw, start: 'top 85%', end: function () { return st.end; },
      onEnter: function () { if (st.progress > 0) pick(); else RM.setService(0); },
      onLeaveBack: function () { RM.hideServiceArt(); } });
    if (scrollY < early.start) RM.hideServiceArt();
    /* 01 AI strategy roadmap plays with the scroll: from the section coming into view until just before 02 takes over */
    /* ...and ends as 02 AI experience starts to show at the bottom of the text column */
    var col = $('#switchCol');
    /* scroll position at which panel k's top sits at `edge` px below the section top (list moving up) */
    function listLen() { return (st.end - st.start) / (1 + HOLD); }   /* scroll over which the list moves */
    function scrollFor(k, edge) {
      var sr = sw.getBoundingClientRect(), y = gsap.getProperty(list, 'y') || 0;
      var pk = panels[k].getBoundingClientRect().top - sr.top - y;
      return st.start + Math.max(0, pk - edge) / Math.max(1, span()) * listLen();
    }
    function colEdge() { return col.getBoundingClientRect().top - sw.getBoundingClientRect().top + col.clientHeight * .95; }
    function stageMid() { var r = stage.getBoundingClientRect(); return r.top - sw.getBoundingClientRect().top + r.height / 2; }
    function roadEnd() { return scrollFor(1, colEdge()); }
    var road = RM.setRoadmap ? ScrollTrigger.create({ trigger: sw, start: 'top 85%',
      end: roadEnd, scrub: true, invalidateOnRefresh: true,
      onUpdate: function (s) { RM.setRoadmap(s.progress); } }) : null;
    /* 02 AI experience checkpoint: from its illustration switching in until just before 03 switches in */
    var ckpt = RM.setCheckpoint ? ScrollTrigger.create({ trigger: sw,
      start: function () { return scrollFor(1, stageMid()); }, end: function () { return scrollFor(2, stageMid()) - 60; },   /* runs right up to 03 switching in (slower scrub) */
      scrub: true, invalidateOnRefresh: true, onUpdate: function (s) { RM.setCheckpoint(s.progress); } }) : null;
    /* 03 AI engineering: from its illustration switching in until just before 04 switches in */
    var obs = RM.setObserve ? ScrollTrigger.create({ trigger: sw,
      start: function () { return scrollFor(2, stageMid()); }, end: function () { return scrollFor(3, stageMid()) - 60; },
      scrub: true, invalidateOnRefresh: true, onUpdate: function (s) { RM.setObserve(s.progress); } }) : null;
    /* 05 AI automation: from its illustration switching in until the pin releases */
    var auto = RM.setAutomation ? ScrollTrigger.create({ trigger: sw,
      start: function () { return scrollFor(N - 1, stageMid()); }, end: function () { return st.end - 40; },
      scrub: true, invalidateOnRefresh: true, onUpdate: function (s) { RM.setAutomation(s.progress); } }) : null;
    RM.switchScrollFor = function (k) { return st.start + (k / (N - 1)) * listLen() + 2; };
    return function () { early.kill(); if (road) { road.kill(); RM.setRoadmap(1); } if (ckpt) { ckpt.kill(); RM.setCheckpoint(1); } if (auto) { auto.kill(); RM.setAutomation(1); } if (obs) { obs.kill(); RM.setObserve(1); } RM.setService(0); ScrollTrigger.removeEventListener('refreshInit', tuck); if (next) next.style.marginTop = ''; art.style.top = ''; sw.classList.remove('is-pinned'); RM.switchScrollFor = null; gsap.set(list, { clearProps: 'transform' }); };
  });
  mm.add('(max-width: 900px)', function () {
    batch('.track .card');
    /* phones: the 01 roadmap in its card plays as the card scrolls up into view */
    var cv = RM.roadmapCanvases && RM.roadmapCanvases.filter(function (c) { return c.closest('.panel-art'); })[0];
    if (!cv) return;
    var road = ScrollTrigger.create({ trigger: cv, start: 'top 95%', end: 'center 30%', scrub: true,
      onUpdate: function (s) { RM.setRoadmap(s.progress, cv); } });
    /* 02 checkpoint plays once when its card is swiped into view */
    /* 02-05 canvas animations play once when their card is swiped into view */
    var inCard = function (list) { return list && list.filter(function (c) { return c.closest('.panel-art'); })[0]; };
    var ck = inCard(RM.checkpointCanvases), ob3 = inCard(RM.observeCanvases), ag = inCard(RM.agentCanvases), au = inCard(RM.automationCanvases), obs = [];
    [[ck, RM.playCheckpoint], [ob3, RM.playObserve], [ag, RM.playAgent], [au, RM.playAutomation]].forEach(function (pair) {
      var c = pair[0]; if (!c || !('IntersectionObserver' in window)) return;
      var ob = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { ob.disconnect(); pair[1](c); } }, { root: $('#switchPanels'), threshold: .6 });
      ob.observe(c.closest('.panel')); obs.push(ob);
    });
    return function () { road.kill(); RM.setRoadmap(1, cv); obs.forEach(function (o) { o.disconnect(); }); if (ck) RM.setCheckpoint(1, ck); if (au) RM.setAutomation(1, au); if (ob3) RM.setObserve(1, ob3); };
  });

  /* ---------- B · how we work: counter + split bars fill as cards arrive ---------- */
  (function () {
    var steps = $$('.step'), count = $('#stepCount');
    steps.forEach(function (s, i) {
      var ai = $('.split-ai i', s), lead = $('.split-lead i', s);
      gsap.timeline({ scrollTrigger: { trigger: s, start: 'top 85%', end: 'top 35%', scrub: true } })
        .fromTo(ai, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none' })
        .fromTo(lead, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none' });
      ScrollTrigger.create({ trigger: s, start: 'top 55%',
        onEnter: function () { s.classList.add('on'); if (count) count.textContent = '0' + (i + 1) + ' / 0' + steps.length; },
        onLeaveBack: function () { s.classList.remove('on'); if (count) count.textContent = '0' + Math.max(1, i) + ' / 0' + steps.length; } });
    });
  })();

  /* ---------- A · Studio: circular wipe (scrubbed), then the H2 lines rise ---------- */
  if ($('#studio')) {
  gsap.fromTo('#studioStage', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', ease: 'none',
    scrollTrigger: { trigger: '#studio', start: 'top 95%', end: 'top 15%', scrub: true } });
  splitReveal($('.studio-h'), '#studio', 'top 25%');
  gsap.fromTo('#melonSlice', { rotate: -12 }, { rotate: 10, ease: 'none',
    scrollTrigger: { trigger: '#studio', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* ---------- B · the big idea: scrolling moves through THINK · DESIGN · BUILD · MOVE.
     Desktop: the section pins while you scroll. Phones: no pin, the words change as the section passes. ---------- */
  (function () {
    var sec = $('#idea'); if (!sec || !RM.ideaScrub) return;
    function update(s) { RM.ideaScrub(s.progress * 4); }
    gsap.matchMedia().add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, function (c) {
      if (c.conditions.desk) {
        sec.classList.add('is-pinned');
        ScrollTrigger.create({ trigger: sec, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * 2.6); },
          pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1, onUpdate: update });
        return function () { sec.classList.remove('is-pinned'); };
      }
      ScrollTrigger.create({ trigger: '#ideaWord', start: 'top 80%', end: 'top 15%', scrub: .6, onUpdate: update });
    });
  })();

  /* ---------- B · how we work: the orange line fills down to Evolve; each step lights as the line reaches its dot ---------- */
  (function () {
    var list = $('.how-list'), fill = $('#hwFill'); if (!list || !fill) return;
    var steps = $$('.hw-step', list), line = fill.parentNode, len = 0;
    /* the track runs from the top of the list to the centre of Evolve's dot, so the fill stops there */
    function size() { var d = $('.hw-dot', steps[steps.length - 1]); len = d.getBoundingClientRect().top + d.offsetHeight / 2 - list.getBoundingClientRect().top; line.style.bottom = 'auto'; line.style.height = len + 'px'; }
    size(); ScrollTrigger.addEventListener('refreshInit', size);
    fill.style.setProperty('--hw', 0);
    ScrollTrigger.create({ trigger: list, start: 'top 60%', end: function () { return 'top+=' + Math.round(len) + ' 60%'; }, scrub: .4, invalidateOnRefresh: true,
      onUpdate: function (s) {
        fill.style.setProperty('--hw', s.progress.toFixed(4));
        var y = list.getBoundingClientRect().top + s.progress * len;
        steps.forEach(function (st) { st.classList.toggle('on', $('.hw-dot', st).getBoundingClientRect().top <= y + 2); });
      } });
  })();

  /* ---------- A · image slots (placeholders now, real files later; same motion either way) ---------- */
  (function () {
    /* hero render: rises in with the copy, then tilts a little toward the pointer */
    var hero = $('.hero-art');
    if (hero) {
      gsap.set(hero, { opacity: 0, y: 30, scale: .96 });
      RM.afterPreload(function () { gsap.to(hero, { opacity: 1, y: 0, scale: 1, duration: 1.2, delay: .55 }); });
      var inner = hero.firstElementChild;
      if (RM.flags.fine && inner) {
        var rx = gsap.quickTo(inner, 'rotationX', { duration: .8 }), ry = gsap.quickTo(inner, 'rotationY', { duration: .8 });
        $('#top').addEventListener('pointermove', function (e) {
          var b = hero.getBoundingClientRect();
          ry(gsap.utils.clamp(-10, 10, (e.clientX - (b.left + b.width / 2)) / 40));
          rx(gsap.utils.clamp(-8, 8, -(e.clientY - (b.top + b.height / 2)) / 50));
        });
        $('#top').addEventListener('pointerleave', function () { rx(0); ry(0); });
      }
    }
    /* problem visual and about photos: wipe up from the bottom while the picture settles from 110% */
    $$('.problem-art, .about-photo').forEach(function (f) {
      var tl = gsap.timeline({ scrollTrigger: { trigger: f, start: START, once: true } });
      tl.fromTo(f, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: D.wipe })
        .fromTo(f.firstElementChild, { scale: 1.1 }, { scale: 1, duration: D.wipe * 1.3 }, 0);
    });
    /* about photos drift at different speeds */
    $$('.about-photo').forEach(function (f, i) {
      var amt = [40, -40][i] || 30;
      gsap.fromTo(f, { y: amt }, { y: -amt, ease: 'none', scrollTrigger: { trigger: '.about-strip', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    /* studio showreel grows to full size as it scrolls in */
    var reel = $('.studio-reel');
    if (reel) gsap.fromTo(reel, { scale: .84, borderRadius: 28 }, { scale: 1, borderRadius: 8, ease: 'none',
      scrollTrigger: { trigger: reel, start: 'top 95%', end: 'top 45%', scrub: true } });
  })();

  /* ---------- A · footer wordmark: letters rise from the bottom, then follow the pointer slowly ---------- */
  (function () {
    var g = $('.foot-giant'); if (!g) return;
    var txt = g.textContent;
    g.innerHTML = txt.split('').map(function (c) { return '<span class="fg-l">' + c + '</span>'; }).join('');
    var ls = $$('.fg-l', g);
    gsap.fromTo(ls, { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: .06, ease: E,
      scrollTrigger: { trigger: g, start: 'top 95%', toggleActions: 'play none none reverse', onEnter: function () { if (RM.sfx) RM.sfx('cascade', ls.length); } } });
    if (!RM.flags.fine) return;
    /* each letter leans a little toward the pointer; outer letters move more */
    var to = ls.map(function (l) { return { x: gsap.quickTo(l, 'x', { duration: 1.6, ease: 'power3' }), y: gsap.quickTo(l, 'y', { duration: 1.6, ease: 'power3' }) }; });
    var mid = (ls.length - 1) / 2, raf = 0, px = 0, py = 0;
    addEventListener('pointermove', function (e) {
      px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = g.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
        to.forEach(function (t, i) { var k = 1 + Math.abs(i - mid) / mid * .8; t.x(px * 22 * k); t.y(py * 14 * k * (i % 2 ? 1 : -1)); });
      });
    }, { passive: true });
  })();

  /* ---------- B · logo marquee skews with scroll velocity (max ±8deg) ---------- */
  (function () {
    var tr = $('#marquee'); if (!tr) return;   /* skew the frame; the track's own transform runs the CSS loop */
    var to = gsap.quickTo(tr, 'skewX', { duration: .5 }), rest = gsap.delayedCall(.15, function () { to(0); }).pause();
    ScrollTrigger.create({ trigger: '#proof', start: 'top bottom', end: 'bottom top',
      onUpdate: function (s) { to(gsap.utils.clamp(-8, 8, s.getVelocity() / -300)); rest.restart(true); } });
  })();

  /* keep measurements honest once fonts and images settle */
  addEventListener('load', function () { ScrollTrigger.refresh(); arrive(); });
  /* arriving from another page with a #hash (e.g. services.html#svc-03): the pins change the page height,
     so jump again once they are measured. Service anchors go through RM.goTo (the pinned switcher). */
  function arrive() {
    var h = location.hash; if (h.length < 2) return;
    /* clients.html#ind-energy: core.js already picked the industry; bring the explorer into view */
    var el = /^#ind-/.test(h) ? document.getElementById('industries') : document.getElementById(h.slice(1));
    if (!el) return;
    setTimeout(function () {
      if (RM.goTo && RM.goTo(h)) return;
      if (RM.lenis) RM.lenis.scrollTo(el, { offset: -12, immediate: true }); else el.scrollIntoView();
    }, 60);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  RM.themeHooks.push(function () { ScrollTrigger.refresh(); });
})();
