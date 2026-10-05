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
  var heroFade = $$('.hero-fade'), heroH = $('#heroH1');
  gsap.set(heroFade, { opacity: 0, y: 16 });
  gsap.set(heroH, { opacity: 0 });
  gsap.set('#pipeFill', { scaleX: 0 });
  RM.afterPreload(function () {
    gsap.set(heroH, { opacity: 1 });
    splitReveal(heroH, false);
    gsap.to(heroFade, { opacity: 1, y: 0, duration: D.reveal, stagger: D.stagger, delay: .35 });
    gsap.to('#pipeFill', { scaleX: 1, duration: D.reveal, delay: .7, ease: E });   /* pipeline line draws once */
  });

  /* every other H2, except the Studio one which waits for its wipe */
  $$('[data-split]').forEach(function (el) {
    if (el === heroH || el.classList.contains('studio-h')) return;
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
  batch('.lead');
  batch('.contact-art');
  batch('.switch-stage');

  /* selected work: rectangle wipe from the bottom */
  $$('.work-img').forEach(function (w) {
    gsap.fromTo(w, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: D.wipe,
      scrollTrigger: { trigger: w, start: START, once: true } });
  });

  /* ---------- B · problem: words fill --ink3 to --ink on scrub (no pin) ---------- */
  (function () {
    var p = $('#problemBody'); if (!p) return;
    var words = p.textContent.trim().split(/\s+/);
    p.innerHTML = words.map(function (w) { return '<span class="w">' + RM.esc(w) + '</span>'; }).join(' ');
    var spans = $$('.w', p), lit = -1;
    ScrollTrigger.create({ trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: function (s) {
        var n = Math.round(s.progress * spans.length);
        if (n === lit) return; lit = n;
        spans.forEach(function (sp, i) { sp.classList.toggle('lit', i < n); });
      } });
  })();

  /* ---------- the two pins (desktop only) ---------- */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', function () {
    /* PIN 1 · What we do card track */
    var track = $('#track'), view = $('#trackView');
    function dist() { return Math.max(0, track.scrollWidth - view.clientWidth); }
    gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '#trackPin', start: 'top top', end: function () { return '+=' + dist(); },
        pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1 } });

    /* PIN 2 · service switcher */
    var sw = $('#switch'), list = $('#switchPanels'), panels = $$('.panel', sw), N = panels.length;
    sw.classList.add('is-pinned');
    function span() { return panels[N - 1].offsetTop - panels[0].offsetTop; }
    var st = ScrollTrigger.create({ trigger: sw, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * .7 * N); },
      pin: true, scrub: true, invalidateOnRefresh: true,
      animation: gsap.fromTo(list, { y: 0 }, { y: function () { return -span(); }, ease: 'none' }),
      onUpdate: function (s) {
        var f = s.progress * (N - 1);
        RM.setService(Math.round(f));
        RM.setLoop(Math.max(0, Math.min(1, f - 2.5)));          /* ring fills as panel 04 becomes active */
      } });
    RM.switchScrollFor = function (k) { return st.start + (k / (N - 1)) * (st.end - st.start) + 2; };
    return function () { sw.classList.remove('is-pinned'); RM.switchScrollFor = null; gsap.set(list, { clearProps: 'transform' }); };
  });
  mm.add('(max-width: 900px)', function () { batch('.track .card'); });

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
  gsap.fromTo('#studioStage', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', ease: 'none',
    scrollTrigger: { trigger: '#studio', start: 'top 95%', end: 'top 15%', scrub: true } });
  splitReveal($('.studio-h'), '#studio', 'top 25%');
  gsap.fromTo('#melonSlice', { rotate: -12 }, { rotate: 10, ease: 'none',
    scrollTrigger: { trigger: '#studio', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- B · logo marquee skews with scroll velocity (max ±8deg) ---------- */
  (function () {
    var tr = $('#logos'); if (!tr) return;
    var to = gsap.quickTo(tr, 'skewX', { duration: .5 }), rest = gsap.delayedCall(.15, function () { to(0); }).pause();
    ScrollTrigger.create({ trigger: '#proof', start: 'top bottom', end: 'bottom top',
      onUpdate: function (s) { to(gsap.utils.clamp(-8, 8, s.getVelocity() / -300)); rest.restart(true); } });
  })();

  /* ---------- contact card drifts sideways a little (desktop, max 26px) ---------- */
  mm.add('(min-width: 941px)', function () {
    gsap.fromTo('#contactCard', { x: -13 }, { x: 13, ease: 'none',
      scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* keep measurements honest once fonts and images settle */
  addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  RM.themeHooks.push(function () { ScrollTrigger.refresh(); });
})();
