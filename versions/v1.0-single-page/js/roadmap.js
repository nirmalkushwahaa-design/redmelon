/* =====================================================================
   ROADMAP · 01 AI strategy illustration ("Signal from noise", concept B).
   Faint, jittery experiments; one line draws through them, calms down,
   turns from grey to orange at Pilot and lands on the orange Scale dot.
   Scroll drives it: RM.setRoadmap(p) with p 0..1 (motion.js scrubs it).
   Colours come from the tokens, so it follows light and dark themes.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $$ = RM.$$;
  var cvs = $$('canvas.rmap'); if (!cvs.length) return;

  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var seg = function (t, a, d) { return clamp((t - a) / d); };
  var io = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var out = function (x) { return 1 - Math.pow(1 - x, 3); };
  var back = function (x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };
  var sm = function (a, b, x) { var u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };

  /* token colours, read from CSS and normalised to rgb triples */
  var probe = document.createElement('canvas').getContext('2d'), K = {};
  function rgb(c) { probe.fillStyle = '#000'; probe.fillStyle = c; var s = probe.fillStyle;
    if (s[0] === '#') return [1, 3, 5].map(function (i) { return parseInt(s.slice(i, i + 2), 16); });
    return s.replace(/[^\d.,]/g, '').split(',').slice(0, 3).map(Number); }
  function readTokens() {
    var cs = getComputedStyle(cvs[0]);
    ['ink', 'ink2', 'ink3', 'line', 'line2', 'red', 'surface'].forEach(function (k) { K[k] = rgb(cs.getPropertyValue('--' + k).trim() || '#888'); });
    K.font = cs.getPropertyValue('--sans').trim() || 'system-ui, sans-serif';
  }
  var css = function (c, a) { return 'rgba(' + c.join(',') + ',' + (a == null ? 1 : a) + ')'; };
  var mix = function (a, b, p) { return 'rgb(' + a.map(function (v, i) { return Math.round(lerp(v, b[i], p)); }).join(',') + ')'; };

  /* scene in a 700 x 600 box: drawing 700 x 560 + caption */
  var X0 = 60, X1 = 640, BOUNDS = [.28, .55, .8];
  var xu = function (u) { return X0 + (X1 - X0) * u; };
  var base = function (u) { return 470 - 360 * sm(0, 1, u); };
  var amp = function (u) { return 42 * Math.pow(1 - sm(0, .78, u), 1.6); };
  var n = function (x, t) { return .55 * Math.sin(x * .071 + t * 2.6) + .3 * Math.sin(x * .19 - t * 4.1 + 1.3) + .15 * Math.sin(x * .43 + t * 6.3 + 2.1); };
  var STAGES = [['EXPERIMENT', 'many tries', .14], ['PRIORITISE', 'ranked', .415], ['PILOT', 'proven', .675], ['SCALE', 'rolled out', .9]];
  var T = { draw: 0, dur: 2600, settle: 2600, sdur: 1200, ring: 2750, end: 4400 };
  function inv(b) { var lo = 0, hi = 1; for (var i = 0; i < 30; i++) { var m = (lo + hi) / 2; if (io(m) < b) lo = m; else hi = m; } return lo; }
  var NODE_T = BOUNDS.map(inv);

  function draw(ctx, t, fs) {
    fs = fs || 1;   /* label scale: >1 keeps labels readable on small screens */
    var nt = Math.min(t, T.settle + T.sdur) / 1000;
    var p = io(seg(t, T.draw, T.dur)), k = out(seg(t, T.settle, T.sdur));
    var yAt = function (u, m) { return base(u) + amp(u) * m * n(xu(u), nt); };
    /* stage separators */
    ctx.setLineDash([2, 6]); ctx.strokeStyle = css(K.line); ctx.lineWidth = 1.2;
    BOUNDS.forEach(function (b) { ctx.beginPath(); ctx.moveTo(xu(b), 70); ctx.lineTo(xu(b), 490); ctx.stroke(); });
    ctx.setLineDash([]);
    /* ghost experiments */
    var ga = lerp(.9, .2, out(seg(t, 1200, 1800)));
    for (var g = 0; g < 5; g++) {
      var gr = ctx.createLinearGradient(X0, 0, xu(.42), 0);
      gr.addColorStop(0, css(K.ink3, ga)); gr.addColorStop(1, css(K.ink3, 0));
      ctx.strokeStyle = gr; ctx.lineWidth = 1.4; ctx.beginPath();
      for (var u = 0; u <= .42; u += .004) { var x = xu(u), y = base(u) + amp(u) * 1.6 * n(x * 1.13 + g * 41, nt * .8 + g * 1.7) + (g - 2) * 16 * (1 - sm(0, .42, u)); if (u === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke();
    }
    if (p > 0) {
      /* the main line: grey, then orange from Pilot */
      var lg = ctx.createLinearGradient(X0, 0, X1, 0);
      lg.addColorStop(0, css(K.line2)); lg.addColorStop(.38, css(K.ink3)); lg.addColorStop(.62, css(K.red)); lg.addColorStop(1, css(K.red));
      ctx.strokeStyle = lg; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath();
      var m = lerp(1, .4, k);
      for (var v = 0; v <= p + 1e-6; v += .003) { var vx = xu(v), vy = yAt(v, m); if (v === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy); }
      ctx.stroke();
      if (p < 1) { ctx.fillStyle = mix(K.ink3, K.red, sm(.4, .65, p)); ctx.beginPath(); ctx.arc(xu(p), yAt(p, m), 4, 0, Math.PI * 2); ctx.fill(); }
      /* stage nodes */
      BOUNDS.forEach(function (b, i) {
        var pop = back(seg(t, T.draw + T.dur * NODE_T[i], 320)); if (pop <= 0) return;
        ctx.fillStyle = css(K.surface); ctx.strokeStyle = css(i === 2 ? K.red : K.ink3); ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.arc(xu(b), yAt(b, m), Math.max(0, 9 * pop), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      /* Scale dot + rings */
      var e = back(seg(t, T.draw + T.dur - 60, 420));
      if (e > 0) {
        [0, 1].forEach(function (i) { var q = out(seg(t, T.ring + i * 240, 1100)); if (q > 0 && q < 1) { ctx.strokeStyle = css(K.red, .5 * (1 - q)); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(X1, base(1), lerp(14, 62, q), 0, Math.PI * 2); ctx.stroke(); } });
        ctx.fillStyle = css(K.red, .12); ctx.beginPath(); ctx.arc(X1, base(1), 26 * out(seg(t, T.ring, 600)), 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = css(K.red); ctx.beginPath(); ctx.arc(X1, base(1), Math.max(0, 14 * e), 0, Math.PI * 2); ctx.fill();
      }
    }
    /* stage labels light up as the line reaches them */
    ctx.textAlign = 'center';
    STAGES.forEach(function (s, i) {
      var on = i === 0 ? 1 : sm(0, 1, (p - BOUNDS[i - 1]) / .06);
      ctx.font = '600 ' + (16 * fs).toFixed(1) + 'px ' + K.font; ctx.fillStyle = i === 3 ? mix(K.ink3, K.red, on) : mix(K.ink3, K.ink, on);
      if ('letterSpacing' in ctx) ctx.letterSpacing = (fs > 1.2 ? 1 : 2) + 'px';
      ctx.fillText(s[0], xu(s[2]), 528);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      ctx.font = '400 ' + (14 * fs).toFixed(1) + 'px ' + K.font; ctx.fillStyle = css(K.ink3, on); ctx.fillText(s[1], xu(s[2]), 528 + 22 * fs);
    });
  }

  var views = cvs.map(function (cv) {
    var ctx = cv.getContext('2d'), v = { t: 0 };
    v.size = function () { var dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.round(cv.clientWidth * dpr); cv.height = Math.round(cv.clientHeight * dpr); };
    v.frame = function (t) {
      v.t = t; if (!cv.width || !cv.height) return;
      var s = Math.min(cv.width / 700, cv.height / 580);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(s, 0, 0, s, (cv.width - 700 * s) / 2, (cv.height - 580 * s) / 2 - 20 * s);
      var dpr = cv.width / Math.max(1, cv.clientWidth);
      draw(ctx, t, Math.max(1, 8.5 * dpr / s / 16));   /* stage names never smaller than 8.5px */
    };
    if ('ResizeObserver' in window) new ResizeObserver(function () { v.size(); v.frame(v.t); }).observe(cv); else v.size();
    return v;
  });

  /* p: 0..1 scroll progress; a stage's progress can also be set alone (mobile) */
  RM.setRoadmap = function (p, which) {
    var t = clamp(p) * T.end;
    views.forEach(function (v, i) { if (which == null || which === cvs[i]) v.frame(t); });
  };
  RM.roadmapCanvases = cvs;

  readTokens();
  var F = RM.flags || {};
  RM.setRoadmap(F.motion ? 0 : 1);
  /* re-read colours when the theme flips */
  new MutationObserver(function () { readTokens(); views.forEach(function (v) { v.frame(v.t); }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-ui', 'class'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { views.forEach(function (v) { v.frame(v.t); }); });
})();
