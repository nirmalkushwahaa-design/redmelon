/* =====================================================================
   ABOUT PAGE MOTION · built from the patterns in 2026 Awwwards winners
   (LPAS, Sadu Media, TBWA\HAKUHODO, Kavieng Creative: GSAP-driven
   kinetic type, scrollytelling, image reveals, microinteractions).
   1 hero headline rises word by word      2 studio photo grows to full screen
   3 story text fills in as you read; red ink spreads through "Red"
   4 numbers count up                       5 value cards stack (pinned title)
   6 team photo wipes in
   Runs before motion.js (so its pin is measured first). Reduced motion or
   no GSAP: everything is simply shown in its final state.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $ = RM.$, $$ = RM.$$;
  if (!$('.ab-hero')) return;
  if (!RM.flags.motion) return;
  var E = RM.ease;

  /* 1 · hero: each word rises out of its own mask, the orange line last */
  (function () {
    var h = $('#abH'); if (!h) return;
    gsap.set(h, { opacity: 0 });
    RM.afterPreload(function () {
      gsap.set(h, { opacity: 1 });
      if (!window.SplitText) { gsap.from(h, { y: 40, opacity: 0, duration: 1 }); return; }
      SplitText.create(h, { type: 'words', mask: 'words', autoSplit: true, onSplit: function (self) {
        return gsap.from(self.words, { yPercent: 115, rotate: 4, duration: 1.1, stagger: .07, ease: E });
      } });
    });
    /* marquee leans with scroll speed */
    var mq = $('.ab-marquee'); if (!mq) return;
    var to = gsap.quickTo(mq, 'skewX', { duration: .5 }), rest = gsap.delayedCall(.15, function () { to(0); }).pause();
    ScrollTrigger.create({ trigger: '.ab-hero', start: 'top top', end: 'bottom top',
      onUpdate: function (s) { to(gsap.utils.clamp(-10, 10, s.getVelocity() / -250)); rest.restart(true); } });
  })();

  /* 2 · studio photo: a card in the middle of the screen that grows to fill it (desktop pin); phones: an inset wipe */
  (function () {
    var sec = $('.ab-reveal'), fig = $('.ab-reveal-fig'); if (!sec || !fig) return;
    var img = $('img', fig), cap = $('.ab-reveal-cap', fig);
    gsap.matchMedia().add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, function (c) {
      if (c.conditions.desk) {
        sec.classList.add('is-pinned');
        var tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: function () { return '+=' + Math.round(innerHeight * 1.3); },
          pin: true, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 2 } });
        tl.fromTo(fig, { width: '44vw', height: '56vh', borderRadius: 28 }, { width: '100vw', height: '100vh', borderRadius: 0, ease: 'none', duration: 1 })
          .fromTo(img, { scale: 1.3 }, { scale: 1, ease: 'none', duration: 1 }, 0)
          .fromTo(cap, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none', duration: .3 }, .72);
        return function () { sec.classList.remove('is-pinned'); };
      }
      gsap.fromTo(fig, { clipPath: 'inset(10% 8% 10% 8% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 12px)', ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top 90%', end: 'center 55%', scrub: true } });
      gsap.fromTo(cap, { opacity: 0, y: 24 }, { opacity: 1, y: 0, scrollTrigger: { trigger: fig, start: 'center 70%', once: true } });
    });
  })();

  /* 3 · story: words go from faint to solid as the reader moves down; "Red" fills with red; ink blot grows behind */
  (function () {
    var body = $('#storyBody'); if (!body) return;
    if (window.SplitText) $$('p', body).forEach(function (p) {
      SplitText.create(p, { type: 'words', autoSplit: true, onSplit: function (self) {
        return gsap.fromTo(self.words, { opacity: .16 }, { opacity: 1, stagger: .05, ease: 'none',
          scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 48%', scrub: true } });
      } });
    });
    var red = $('.story-h .ink');
    if (red) gsap.fromTo(red, { '--fill': '0%' }, { '--fill': '100%', ease: 'none',
      scrollTrigger: { trigger: '.story-h', start: 'top 85%', end: 'top 35%', scrub: true } });
    var blob = $('.story-blob');
    if (blob) gsap.fromTo(blob, { scale: .2, opacity: 0 }, { scale: 1.5, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '#story-sec', start: 'top 75%', end: 'bottom 40%', scrub: true } });
    var pic = $('.story-pic');
    if (pic) gsap.fromTo(pic, { y: 60, rotate: -6 }, { y: -40, rotate: 3, ease: 'none',
      scrollTrigger: { trigger: '#story-sec', start: 'top bottom', end: 'bottom top', scrub: true } });
  })();

  /* 4 · numbers: count up from zero (keeps zero padding and the +, M, K suffix); icons pop in after */
  (function () {
    var vals = $$('.stat-v'); if (!vals.length) return;
    vals.forEach(function (el) {
      var m = /^(\d+)(.*)$/.exec(el.textContent.trim()); if (!m) return;
      var target = +m[1], width = m[1].length, suffix = m[2], o = { v: 0 };
      var fmt = function (v) { var n = String(Math.round(v)); while (n.length < width) n = '0' + n; return n + suffix; };
      el.setAttribute('aria-label', el.textContent.trim());
      el.textContent = fmt(0);
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: function () {
        gsap.to(o, { v: target, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v); } });
      } });
    });
    var icos = $$('.stat-ico');
    gsap.set(icos, { scale: 0, rotate: -90 });
    ScrollTrigger.batch(icos, { start: 'top 88%', once: true,
      onEnter: function (b) { gsap.to(b, { scale: 1, rotate: 0, duration: .7, stagger: .08, delay: .25, ease: 'back.out(2.2)' }); } });
  })();

  /* 5 · values: cards are CSS-sticky and stack; the one underneath shrinks back as the next covers it; the pinned title counts 01–05 */
  (function () {
    var cards = $$('#values .value'), now = $('#valuesNow'); if (!cards.length) return;
    gsap.matchMedia().add('(min-width: 901px)', function () {
      var tw = [];
      cards.forEach(function (c, i) {
        ScrollTrigger.create({ trigger: c, start: 'top 60%', end: 'bottom 60%',
          onToggle: function (s) { if (s.isActive && now) now.textContent = '0' + (i + 1); } });
        var next = cards[i + 1]; if (!next) return;
        tw.push(gsap.to(c, { scale: .93, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 30%', scrub: true } }));
      });
      return function () { tw.forEach(function (t) { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); }); gsap.set(cards, { clearProps: 'transform,filter' }); };
    });
    /* the number circle spins in as each card arrives */
    cards.forEach(function (c) {
      gsap.from($('.value-n', c), { rotate: -180, scale: .4, duration: .9, ease: 'back.out(1.8)', scrollTrigger: { trigger: c, start: 'top 80%', once: true } });
    });
  })();

  /* 6 · team photo: wipes up from the bottom while the picture settles; names slide in */
  (function () {
    var f = $('.ab-team-photo'); if (!f) return;
    gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 85%', once: true } })
      .fromTo(f, { clipPath: 'inset(100% 0 0 0 round 16px)' }, { clipPath: 'inset(0% 0 0 0 round 16px)', duration: 1.2 })
      .fromTo(f.firstElementChild, { scale: 1.15 }, { scale: 1, duration: 1.6 }, 0);
    var names = $$('.team-names .tn');
    gsap.set(names, { opacity: 0, y: 30 });
    ScrollTrigger.create({ trigger: '.team-names', start: 'top 90%', once: true,
      onEnter: function () { gsap.to(names, { opacity: 1, y: 0, duration: .8, stagger: .12 }); } });
  })();
})();
