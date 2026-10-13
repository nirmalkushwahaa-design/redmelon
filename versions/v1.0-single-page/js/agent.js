/* =====================================================================
   AGENT · 04 Agentic AI illustration ("Loop with a brake").
   A red token goes round the agent loop lighting Knowledge, Reason and Plan.
   At Approve it stops: the node pulses green, a request card asks a person,
   the cursor approves, Approve turns green and the agent finishes Act, Learn.
   Desktop: driven by the existing RM.setLoop(p) (motion.js pick(): from 04
   switching in, finishing before 05). Phones: plays once on swipe.
   Colours come from the tokens, so it follows light and dark themes.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $$ = RM.$$;
  var cvs = $$('canvas.agent'); if (!cvs.length) return;

  var TAU = Math.PI * 2;
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var seg = function (t, a, d) { return clamp((t - a) / d); };
  var io = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var out = function (x) { return 1 - Math.pow(1 - x, 3); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };

  var probe = document.createElement('canvas').getContext('2d'), K = {};
  function rgb(c) { probe.fillStyle = '#000'; probe.fillStyle = c; var s = probe.fillStyle;
    if (s[0] === '#') return [1, 3, 5].map(function (i) { return parseInt(s.slice(i, i + 2), 16); });
    return s.replace(/[^\d.,]/g, '').split(',').slice(0, 3).map(Number); }
  function readTokens() {
    var cs = getComputedStyle(cvs[0]);
    ['ink', 'ink2', 'ink3', 'line', 'line2', 'red', 'surface', 'ok'].forEach(function (k) { K[k] = rgb(cs.getPropertyValue('--' + k).trim() || '#4E7D1E'); });
    K.font = cs.getPropertyValue('--sans').trim() || 'system-ui, sans-serif';
    K.disp = cs.getPropertyValue('--disp').trim() || K.font;
  }
  var css = function (c, a) { return 'rgba(' + c.join(',') + ',' + (a == null ? 1 : a) + ')'; };

  var fs = 1;
  function txt(x, s, px, py, w, size, col, align, ls, fam, noScale) {
    x.font = w + ' ' + (size * (noScale ? 1 : fs)).toFixed(1) + 'px ' + (fam || K.font); x.fillStyle = col; x.textAlign = align || 'left';
    if ('letterSpacing' in x) x.letterSpacing = (ls ? (fs > 1.2 ? ls / 2 : ls) : 0) + 'px';
    x.fillText(s, px, py); if ('letterSpacing' in x) x.letterSpacing = '0px';
  }
  function rr(x, px, py, w, h, r, fill, stroke, lw) {
    x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
    if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw || 2; x.stroke(); }
  }
  function circ(x, px, py, r, fill, stroke, lw) { x.beginPath(); x.arc(px, py, Math.max(0, r), 0, TAU); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw || 2; x.stroke(); } }
  function person(x, px, py, s, col) { x.fillStyle = col; x.beginPath(); x.arc(px, py - s * .55, s * .42, 0, TAU); x.fill(); x.beginPath(); x.arc(px, py + s * .75, s * .78, Math.PI, 0); x.fill(); }
  function cursorAt(x, px, py, press) { x.save(); x.translate(px, py); var s = (1 - press * .15) * 1.1; x.scale(s, s); x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 17); x.lineTo(4.5, 12.5); x.lineTo(8, 20); x.lineTo(11, 18.6); x.lineTo(7.6, 11.3); x.lineTo(14, 11.1); x.closePath(); x.fillStyle = css(K.ink); x.fill(); x.strokeStyle = css(K.surface); x.lineWidth = 1.3; x.stroke(); x.restore(); }
  function clickRing(x, px, py, t, at) { var p = seg(t, at, .45); if (p <= 0 || p >= 1) return; circ(x, px, py, lerp(4, 22, out(p)), null, css(K.ink, .5 * (1 - p)), 2); }

  var CX = 350, CY = 258, R = 168, END = 4.9;
  var N = [['KNOWLEDGE', -90], ['REASON', -30], ['PLAN', 30], ['APPROVE', 90], ['ACT', 150], ['LEARN', 210]];
  var P = function (a) { return [CX + R * Math.cos(a * Math.PI / 180), CY + R * Math.sin(a * Math.PI / 180)]; };

  function draw(x, t) {
    var ang = -90, on = t >= .3, wait = false, approved = t >= 2.85;
    if (on) { if (t < 1.9) ang = -90 + 180 * io(seg(t, .3, 1.6)); else if (t < 2.95) { ang = 90; wait = true; } else ang = 90 + 180 * io(seg(t, 2.95, 1.4)); }
    /* ring + progress */
    circ(x, CX, CY, R, null, css(K.line), 2.5);
    if (on) { x.beginPath(); x.arc(CX, CY, R, -Math.PI / 2, ang * Math.PI / 180); x.strokeStyle = css(K.red); x.lineWidth = 3.5; x.lineCap = 'round'; x.stroke(); }
    /* nodes */
    N.forEach(function (n) {
      var p = P(n[1]), passed = on && ang >= n[1] - .5, isA = n[0] === 'APPROVE';
      var fill = passed ? css(K.red) : css(K.surface), stroke = passed ? css(K.red) : css(K.ink3);
      if (isA) { if (wait) { fill = css(K.surface); stroke = css(K.ok); } if (approved) { fill = css(K.ok); stroke = css(K.ok); } }
      circ(x, p[0], p[1], isA ? 16 : 13, fill, stroke, 2.5);
      if (isA && wait) { var q = (t * 1.4) % 1; circ(x, p[0], p[1], lerp(16, 30, q), null, css(K.ok, .6 * (1 - q)), 2); }
      var dx = Math.cos(n[1] * Math.PI / 180), dy = Math.sin(n[1] * Math.PI / 180);
      txt(x, n[0], p[0] + dx * 34, isA ? p[1] + 46 : p[1] + dy * 30 + 4, 600, 12, passed || (isA && approved) ? css(K.ink) : css(K.ink3),
        Math.abs(dx) < .2 ? 'center' : dx > 0 ? 'left' : 'right', 2);
    });
    /* token */
    if (on && t <= 4.4) { var tp = P(ang); circ(x, tp[0], tp[1], 20, css(K.red, .15)); circ(x, tp[0], tp[1], 9, css(K.red), css(K.surface), 2.5); }
    /* centre */
    var phase = 'Ready'; N.forEach(function (n) { if (on && ang >= n[1] - 1) phase = n[0].charAt(0) + n[0].slice(1).toLowerCase(); });
    if (wait) phase = 'Asking you'; if (t > 4.4) phase = 'Done';
    txt(x, 'AGENT LOOP', CX, CY - 34, 600, 11, css(K.ink3), 'center', 2.5);
    txt(x, phase, CX, CY + 14, 400, 44, wait ? css(K.ok) : css(K.ink), 'center', 0, K.disp, true);
    txt(x, 'Refund ₹1,20,000 to Acme', CX, CY + 42, 400, 11, css(K.ink2), 'center');
    /* the person's approval card */
    var hb = out(seg(t, 1.95, .3)) * (1 - seg(t, 3.1, .3));
    if (hb > 0) {
      var bx = 430, by = 440, pr = t >= 2.75;
      x.globalAlpha = hb; rr(x, bx, by, 240, 70, 12, css(K.surface), css(K.ok), 1.8);
      person(x, bx + 24, by + 28, 10, css(K.ink)); txt(x, 'Refund ₹1,20,000 to Acme?', bx + 46, by + 26, 600, 12, css(K.ink), 'left', 0, null, true);
      rr(x, bx + 46, by + 38, 82, 22, 7, pr ? css(K.ink) : css(K.ok)); txt(x, 'Approve', bx + 87, by + 53, 600, 11, pr ? css(K.surface) : '#fff', 'center', 0, null, true);
      rr(x, bx + 136, by + 38, 64, 22, 7, css(K.surface), css(K.line), 1.2); txt(x, 'Decline', bx + 168, by + 53, 600, 11, css(K.ink), 'center', 0, null, true);
      x.globalAlpha = 1;
      if (t > 2.15 && t < 3.1) { var cp = io(seg(t, 2.15, .5)); cursorAt(x, lerp(640, bx + 80, cp), lerp(540, by + 52, cp), Math.abs(t - 2.75) < .1 ? 1 : 0); clickRing(x, bx + 87, by + 49, t, 2.75); }
    }
    var fin = seg(t, 4.45, .4); if (fin > 0) { x.globalAlpha = fin; txt(x, 'Done · paused once, approved by you', CX, CY + R + 66, 400, 11, css(K.ink), 'center'); x.globalAlpha = 1; }
  }

  var views = cvs.map(function (cv) {
    var ctx = cv.getContext('2d'), v = { t: 0, cv: cv };
    v.size = function () { var dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.round(cv.clientWidth * dpr); cv.height = Math.round(cv.clientHeight * dpr); };
    v.frame = function (t) {
      v.t = t; if (!cv.width || !cv.height) return;
      var s = Math.min(cv.width / 700, cv.height / 560);
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(s, 0, 0, s, (cv.width - 700 * s) / 2, (cv.height - 560 * s) / 2);
      var dpr = cv.width / Math.max(1, cv.clientWidth);
      fs = Math.min(1.5, Math.max(1, 8 * dpr / s / 12));
      draw(ctx, t);
    };
    if ('ResizeObserver' in window) new ResizeObserver(function () { v.size(); v.frame(v.t); }).observe(cv); else v.size();
    return v;
  });

  function setAgent(p, which) { var t = clamp(p) * END; views.forEach(function (v) { if (which == null || which === v.cv) v.frame(t); }); }
  RM.setAgent = setAgent;
  /* the switcher already reports 04's progress through RM.setLoop: drive the canvas with it */
  RM.setLoop = function (p) { setAgent(p); };
  RM.playAgent = function (which) { var t0 = performance.now();
    (function step(now) { var t = (now - t0) / 1000; setAgent(t / END, which); if (t < END) requestAnimationFrame(step); })(t0); };
  RM.agentCanvases = cvs;

  readTokens();
  var F = RM.flags || {};
  setAgent(F.motion ? 0 : 1);
  new MutationObserver(function () { readTokens(); views.forEach(function (v) { v.frame(v.t); }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-ui', 'class'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { views.forEach(function (v) { v.frame(v.t); }); });
})();
