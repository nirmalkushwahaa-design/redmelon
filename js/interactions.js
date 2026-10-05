/* =====================================================================
   INTERACTIONS · nav, rail, magnetic, cursor chip, card track drag/keys,
   service switcher state, tiles, quotes carousel
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $ = RM.$, $$ = RM.$$, F = RM.flags, root = document.documentElement;
  var narrow = function () { return innerWidth <= 900; };

  /* ---------- nav: stuck after 40px, hide on scroll down, show on up ---------- */
  (function () {
    var nav = $('#nav'), lastY = scrollY, ticking = false;
    function update() {
      ticking = false;
      var y = scrollY;
      nav.classList.toggle('is-stuck', y > 40);
      var hide = y > lastY && y > 240 && !root.classList.contains('sheet-open') && !nav.contains(document.activeElement);
      if (Math.abs(y - lastY) > 4) { nav.classList.toggle('is-hidden', hide); lastY = y; }
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    nav.addEventListener('focusin', function () { nav.classList.remove('is-hidden'); });
    update();
  })();

  /* ---------- rail (8 entries) + active nav link ---------- */
  (function () {
    var rail = $('#rail'), secs = $$('[data-rail]');
    secs.forEach(function (s) {
      var a = document.createElement('a');
      a.href = '#' + s.id; a.setAttribute('aria-label', s.dataset.rail);
      a.innerHTML = '<span class="rail-dot" aria-hidden="true"></span><span class="rail-lab" aria-hidden="true">' + s.dataset.rail + '</span>';
      rail.appendChild(a); s._rail = a;
    });
    var navLinks = $$('.nav-links a'), map = { services: '#services', process: '#process', studio: '#studio', work: '#work', about: '#about', faq: '#faq' };
    function setNav(id) { navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === map[id]); }); }
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var s = e.target;
        if (s._rail) {
          secs.forEach(function (x) { x._rail.removeAttribute('aria-current'); });
          s._rail.setAttribute('aria-current', 'true');
          rail.classList.toggle('on-dark', s.classList.contains('zone-dark'));
          rail.classList.toggle('on-light', s.classList.contains('zone-light') && root.getAttribute('data-ui') === 'dark');
        }
        setNav(s.id);
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    secs.concat($$('#faq,#work,#about')).forEach(function (s) { io.observe(s); });
  })();

  /* ---------- magnetic primary CTAs (fine pointer, motion only, max 8px) ---------- */
  if (F.motion && F.fine) {
    $$('.mag').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: .3 }), yTo = gsap.quickTo(el, 'y', { duration: .3 });
      el.addEventListener('pointermove', function (e) {
        var b = el.getBoundingClientRect(), dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
        xTo(Math.max(-8, Math.min(8, dx * .2))); yTo(Math.max(-8, Math.min(8, dy * .3)));
      });
      el.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
  }

  /* ---------- context cursor chip: Drag / View / Open zones only ---------- */
  (function () {
    var chip = $('#chip'); if (!chip || !F.fine || F.rm) return;
    var lab = chip.firstElementChild, x = 0, y = 0, raf = 0;
    function place() { raf = 0; chip.style.left = x + 'px'; chip.style.top = y + 'px'; }
    $$('[data-chip-zone]').forEach(function (z) {
      z.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'mouse') return; lab.textContent = z.dataset.chipZone; chip.classList.add('on'); });
      z.addEventListener('pointerleave', function () { chip.classList.remove('on'); });
      z.addEventListener('pointermove', function (e) { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(place); });
    });
  })();

  /* ---------- card track: mouse drag + arrow keys (desktop drives the pin) ---------- */
  (function () {
    var view = $('#trackView'), track = $('#track'); if (!view) return;
    var cards = $$('.card', track);
    function step() { return cards[0] ? cards[0].offsetWidth + 18 : 400; }
    function pinned() { return root.classList.contains('motion') && !narrow(); }
    function by(dx) {
      if (pinned()) {
        var y = scrollY + dx;
        if (RM.lenis) RM.lenis.scrollTo(y, { duration: .6 }); else scrollTo({ top: y, behavior: 'smooth' });
      } else view.scrollBy({ left: dx, behavior: F.rm ? 'auto' : 'smooth' });
    }
    view.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); by(step()); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); by(-step()); }
    });
    /* mouse drag */
    var down = false, sx = 0, sy = 0, moved = false;
    view.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sy = pinned() ? scrollY : view.scrollLeft;
    });
    addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = sx - e.clientX;
      if (Math.abs(dx) > 4) { moved = true; view.classList.add('is-drag'); }
      if (!moved) return;
      if (pinned()) { if (RM.lenis) RM.lenis.scrollTo(sy + dx, { immediate: true }); else scrollTo(0, sy + dx); }
      else view.scrollLeft = sy + dx;
    });
    addEventListener('pointerup', function () { if (!down) return; down = false; view.classList.remove('is-drag'); });
    view.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    view.addEventListener('dragstart', function (e) { e.preventDefault(); });
  })();

  /* ---------- service switcher state ---------- */
  (function () {
    var sw = $('#switch'); if (!sw) return;
    var panels = $$('.panel', sw), arts = $$('.stage-art', sw), dots = $$('#switchDots .dot'), count = $('#switchCount');
    var cur = -1, N = panels.length;
    function drawIn(art) {
      if (!F.motion) return;
      $$('.draw', art).forEach(function (p) {
        var L = p.getTotalLength ? p.getTotalLength() : 0; if (!L) return;
        gsap.fromTo(p, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: .8, ease: RM.ease });
      });
    }
    RM.setService = function (i) {
      i = Math.max(0, Math.min(N - 1, i)); if (i === cur) return;
      cur = i;
      panels.forEach(function (p, k) { p.classList.toggle('on', k === i); });
      arts.forEach(function (a, k) { a.classList.toggle('on', k === i); if (k === i) drawIn(a); });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); d.setAttribute('aria-selected', k === i); });
      if (count) count.textContent = '0' + (i + 1) + ' / 0' + N;
    };
    /* agent loop progress (panel 04), p in 0..1 */
    RM.setLoop = function (p) {
      $$('.motif-loop', sw).forEach(function (svg) {
        var prog = $('.loop-prog', svg), len = +prog.getAttribute('data-len');
        prog.setAttribute('stroke-dashoffset', (len * (1 - p)).toFixed(1));
        var nodes = $$('.loop-node', svg), lit = Math.floor(p * nodes.length - .001);
        nodes.forEach(function (n, k) { n.classList.toggle('on', k <= lit); });
        var name = RM.LOOP[Math.max(0, Math.min(RM.LOOP.length - 1, lit))];
        $('.loop-center', svg).textContent = p <= 0 ? RM.LOOP[0] : name;
      });
    };
    RM.setService(0); RM.setLoop(F.motion ? 0 : 1);

    /* mobile carousel: dots + nearest slide */
    var col = $('#switchPanels');
    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { col.scrollTo({ left: panels[k].offsetLeft - col.offsetLeft - parseFloat(getComputedStyle(col).paddingLeft), behavior: F.rm ? 'auto' : 'smooth' }); });
    });
    var st;
    col.addEventListener('scroll', function () {
      if (!narrow()) return;
      clearTimeout(st); st = setTimeout(function () {
        var best = 0, bd = 1e9;
        panels.forEach(function (p, k) { var d = Math.abs(p.getBoundingClientRect().left - col.getBoundingClientRect().left); if (d < bd) { bd = d; best = k; } });
        RM.setService(best); if (best === 3) RM.setLoop(1);
      }, 60);
    }, { passive: true });
    col.addEventListener('keydown', function (e) {
      if (!narrow()) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var k = cur + (e.key === 'ArrowRight' ? 1 : -1); if (dots[k]) dots[k].click(); }
    });
    col.setAttribute('tabindex', '0'); col.setAttribute('aria-label', 'Services, use left and right arrow keys to move');

    /* no pin (no motion, desktop): left column is CSS sticky, active panel by position */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (sw.classList.contains('is-pinned') || narrow()) return;
        es.forEach(function (e) { if (e.isIntersecting) { var k = +e.target.dataset.i; RM.setService(k); if (k === 3) RM.setLoop(1); } });
      }, { rootMargin: '-45% 0px -45% 0px' });
      panels.forEach(function (p) { io.observe(p); });
    }

    /* anchors to a service (#svc-0X) */
    RM.goTo = function (id) {
      var m = /^#svc-0(\d)$/.exec(id); if (!m) return false;
      var k = +m[1] - 1;
      if (narrow()) {
        RM.scrollTo(sw, { offset: -60, done: function () { dots[k] && dots[k].click(); } });
      } else if (RM.switchScrollFor) {
        var y = RM.switchScrollFor(k);
        if (RM.lenis) RM.lenis.scrollTo(y, { duration: 1.2 }); else scrollTo({ top: y, behavior: 'smooth' });
      } else RM.scrollTo(panels[k], { offset: -(innerHeight * .3) });
      history.replaceState(null, '', id);
      return true;
    };
  })();

  /* ---------- start-here tiles: click / tap / Enter / Space; hover only previews ---------- */
  (function () {
    var tiles = $$('#tiles .tile');
    function open(t) {
      tiles.forEach(function (x) {
        var on = x === t;
        x.classList.toggle('open', on);
        $('.tile-head', x).setAttribute('aria-expanded', on);
        var cta = $('.tile-body .btn', x); if (on) cta.removeAttribute('tabindex'); else cta.setAttribute('tabindex', '-1');
      });
      RM.track('tile_open', { tile: t.dataset.id });
    }
    tiles.forEach(function (t) { $('.tile-head', t).addEventListener('click', function () { if (!t.classList.contains('open')) open(t); }); });
  })();

  /* ---------- FAQ analytics ---------- */
  $$('.qa').forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) RM.track('faq_open', { question: d.dataset.id }); }); });

  /* ---------- quotes: crossfade carousel, 7s, pause on hover/focus, swipe ---------- */
  (function () {
    var box = $('#quotes'); if (!box || $('#voices').hidden) return;
    var qs = $$('.quote', box), dots = $$('#quoteDots .dot'), cur = 0, timer = 0, paused = false;
    if (qs.length < 2) return;
    function show(i) {
      cur = (i + qs.length) % qs.length;
      qs.forEach(function (q, k) { q.classList.toggle('on', k === cur); q.setAttribute('aria-hidden', k !== cur); });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === cur); d.setAttribute('aria-selected', k === cur); });
    }
    function run() { clearInterval(timer); if (!F.rm && !paused) timer = setInterval(function () { show(cur + 1); }, RM.CONFIG.QUOTE_INTERVAL); }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); run(); }); });
    [box, $('#quoteDots')].forEach(function (el) {
      el.addEventListener('pointerenter', function () { paused = true; run(); });
      el.addEventListener('pointerleave', function () { paused = false; run(); });
      el.addEventListener('focusin', function () { paused = true; run(); });
      el.addEventListener('focusout', function () { paused = false; run(); });
    });
    box.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
    var tx = 0;
    box.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) { show(cur + (dx < 0 ? 1 : -1)); run(); } });
    RM.onScreen(box, function (v) { if (v) run(); else clearInterval(timer); });
  })();
})();
