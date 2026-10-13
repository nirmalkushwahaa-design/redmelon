/* =====================================================================
   HERO · ripple grid canvas. Quiet resting fill, hover lifts a cell,
   click starts a ripple. The loop sleeps when idle, off-screen or hidden.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, cv = RM.$('#grid');
  var ctx = cv && cv.getContext ? cv.getContext('2d') : null;
  if (!ctx) return;
  var hero = cv.parentElement, W = 0, H = 0, DPR = 1, cell = 56, cols = 0, rows = 0;
  var LINE = '', HOT = '', hover = null, ripples = [], vis = false, raf = 0, auto = 0;
  var still = RM.flags.rm;

  function colors() {
    var s = getComputedStyle(document.documentElement);
    LINE = s.getPropertyValue('--hairline').trim();
    HOT = s.getPropertyValue('--red').trim();
  }
  function size() {
    W = hero.clientWidth; H = hero.clientHeight; DPR = RM.dpr();
    cell = W < 620 ? 40 : 56;
    cols = Math.ceil(W / cell) + 1; rows = Math.ceil(H / cell) + 1;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function tri(t, d) { if (t < 0 || t > d) return 0; var k = t / d; return k < .5 ? k * 2 : 2 - k * 2; }

  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    /* resting fill .011 */
    ctx.globalAlpha = .011; ctx.fillStyle = HOT; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath();
    for (var c = 0; c <= cols; c++) { ctx.moveTo(c * cell + .5, 0); ctx.lineTo(c * cell + .5, H); }
    for (var r = 0; r <= rows; r++) { ctx.moveTo(0, r * cell + .5); ctx.lineTo(W, r * cell + .5); }
    ctx.stroke();
    var busy = false;
    ctx.fillStyle = HOT;
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
      var heat = 0;
      if (hover) { var hd = Math.hypot(hover.c - c, hover.r - r); if (hd < 1.6) heat = (1 - hd / 1.6) * .5; }
      for (var i = 0; i < ripples.length; i++) {
        var rp = ripples[i], d = Math.hypot(rp.c - c, rp.r - r);
        heat = Math.max(heat, tri(now - rp.t0 - d * 55, 200 + d * 80) * (1 - Math.min(d / 18, 1)) * rp.s);
      }
      if (heat > .01) { ctx.globalAlpha = heat * .42; ctx.fillRect(c * cell + 1, r * cell + 1, cell - 1, cell - 1); }
    }
    ctx.globalAlpha = 1;
    ripples = ripples.filter(function (rp) { return now - rp.t0 < 4200; });
    busy = ripples.length > 0 || !!hover;
    return busy;
  }
  function tick(now) {
    raf = 0;
    if (!vis) return;
    if (draw(now)) raf = requestAnimationFrame(tick);   /* sleeps when nothing moves */
  }
  function wake() { if (!raf && vis && !still) raf = requestAnimationFrame(tick); }
  function at(e) { var b = cv.getBoundingClientRect(); return { c: Math.floor((e.clientX - b.left) / cell), r: Math.floor((e.clientY - b.top) / cell) }; }
  function ripple(c, r, s) { ripples.push({ c: c, r: r, t0: performance.now(), s: s }); if (ripples.length > 5) ripples.shift(); wake(); }

  colors(); size(); draw(performance.now());
  RM.themeHooks.push(function () { colors(); draw(performance.now()); wake(); });
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); draw(performance.now()); }, 120); });
  if (still) return;                                     /* reduced motion: one still frame */

  cv.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') { hover = at(e); wake(); } });
  cv.addEventListener('pointerleave', function () { hover = null; wake(); });
  cv.addEventListener('pointerdown', function (e) { var p = at(e); ripple(p.c, p.r, 1); });

  RM.onScreen(hero, function (v) {
    vis = v;
    if (v) {
      wake();
      if (!auto) auto = setInterval(function () { if (!hover) ripple(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows * .45), .55); }, 4200);
    } else {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      clearInterval(auto); auto = 0;
    }
  }, '0px');
  RM.afterPreload(function () { ripple(Math.round(cols * .72), Math.round(rows * .22), 1); });
})();
