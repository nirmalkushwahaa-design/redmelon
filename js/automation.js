/* =====================================================================
   AUTOMATION · 05 AI automation illustration (concept A, "Before and after").
   Two lanes run on the same Intake, Decide, Act stations. In the manual lane
   people handle every item, so queues build and few finish. In the AI lane
   items flow through and only exceptions dip down to a person. Counters show
   the capacity gap.
   Desktop: scroll drives it, RM.setAutomation(p) with p 0..1 (motion.js).
   Phones: plays once when its card is swiped into view.
   Colours come from the tokens, so it follows light and dark themes.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $$ = RM.$$;
  var cvs = $$('canvas.auto'); if (!cvs.length) return;

  var TAU = Math.PI * 2;
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var seg = function (t, a, d) { return clamp((t - a) / d); };
  var io = function (x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var lerp = function (a, b, p) { return a + (b - a) * p; };

  var probe = document.createElement('canvas').getContext('2d'), K = {};
  function rgb(c) { probe.fillStyle = '#000'; probe.fillStyle = c; var s = probe.fillStyle;
    if (s[0] === '#') return [1, 3, 5].map(function (i) { return parseInt(s.slice(i, i + 2), 16); });
    return s.replace(/[^\d.,]/g, '').split(',').slice(0, 3).map(Number); }
  function readTokens() {
    var cs = getComputedStyle(cvs[0]);
    ['ink', 'ink2', 'ink3', 'line', 'line2', 'red', 'surface'].forEach(function (k) { K[k] = rgb(cs.getPropertyValue('--' + k).trim() || '#888'); });
    K.font = cs.getPropertyValue('--sans').trim() || 'system-ui, sans-serif';
    K.disp = cs.getPropertyValue('--disp').trim() || K.font;
  }
  var css = function (c, a) { return 'rgba(' + c.join(',') + ',' + (a == null ? 1 : a) + ')'; };

  var fs = 1;   /* label scale, set per frame */
  function txt(x, s, px, py, weight, size, col, align, ls, fam) {
    x.font = weight + ' ' + (size * fs).toFixed(1) + 'px ' + (fam || K.font); x.fillStyle = col; x.textAlign = align || 'left';
    if ('letterSpacing' in x) x.letterSpacing = (ls ? (fs > 1.2 ? ls / 2 : ls) : 0) + 'px';
    x.fillText(s, px, py); if ('letterSpacing' in x) x.letterSpacing = '0px';
  }
  function tw(x, s, weight, size, fam) { x.font = weight + ' ' + (size * fs).toFixed(1) + 'px ' + (fam || K.font); return x.measureText(s).width; }
  function rr(x, px, py, w, h, r, fill, stroke, lw) {
    x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
    if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw || 2; x.stroke(); }
  }
  function circ(x, px, py, r, fill, stroke, lw) { x.beginPath(); x.arc(px, py, Math.max(0, r), 0, TAU); if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw || 2; x.stroke(); } }
  function line(x, pts, col, lw) { x.beginPath(); pts.forEach(function (p, i) { if (i) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]); }); x.strokeStyle = col; x.lineWidth = lw || 2; x.lineCap = 'round'; x.stroke(); }
  function sparkle(x, px, py, s, col) { x.fillStyle = col; x.beginPath(); x.moveTo(px, py - s); x.quadraticCurveTo(px + s * .18, py - s * .18, px + s, py); x.quadraticCurveTo(px + s * .18, py + s * .18, px, py + s); x.quadraticCurveTo(px - s * .18, py + s * .18, px - s, py); x.quadraticCurveTo(px - s * .18, py - s * .18, px, py - s); x.fill(); }
  function person(x, px, py, s, col) { x.fillStyle = col; x.beginPath(); x.arc(px, py - s * .55, s * .42, 0, TAU); x.fill(); x.beginPath(); x.arc(px, py + s * .75, s * .78, Math.PI, 0); x.fill(); }
  function spinner(x, px, py, r, t, col, lw) { x.beginPath(); x.arc(px, py, r, t * 7, t * 7 + 4.2); x.strokeStyle = col; x.lineWidth = lw || 2.5; x.lineCap = 'round'; x.stroke(); }

  /* deterministic queue simulation for one lane */
  function simLane(n, gap, durs, travel, X, exitX, exc) {
    var items = [], free = [0, 0, 0];
    for (var i = 0; i < n; i++) {
      var ev = [], tt = i * gap;
      ev.push(['move', tt, tt + travel, 30, X[0] - 62]); tt += travel;
      for (var k = 0; k < 3; k++) {
        if (k > 0) { ev.push(['move', tt, tt + travel, X[k - 1] + 62, X[k] - 62]); tt += travel; }
        var st = Math.max(tt, free[k]); if (st > tt) ev.push(['wait', tt, st, k]);
        var isExc = !!(exc && k === 1 && exc(i)), d = durs[k] + (isExc ? .7 : 0);
        ev.push(['in', st, st + d, k, isExc]); free[k] = st + (isExc ? durs[k] : d); tt = st + d;
      }
      ev.push(['move', tt, tt + travel, X[2] + 62, exitX]); items.push({ i: i, ev: ev, done: tt + travel });
    }
    return items;
  }
  var LX = [200, 360, 520];
  var MAN = simLane(6, 1.25, [1.0, 1.5, 1.0], .45, LX, 690, null);
  var AIL = simLane(30, .19, [.12, .16, .12], .32, LX, 690, function (i) { return i % 7 === 3; });
  var END = 6.2;

  function drawItems(x, t, items, floor, ai) {
    var waiting = [[], [], []];
    items.forEach(function (it) { it.ev.forEach(function (e) { if (e[0] === 'wait' && t >= e[1] && t < e[2]) waiting[e[3]].push(it.i); }); });
    items.forEach(function (it) {
      var pos = null, inside = null, exc = false;
      for (var j = 0; j < it.ev.length; j++) { var e = it.ev[j];
        if (t >= e[1] && t < e[2]) {
          if (e[0] === 'move') pos = lerp(e[3], e[4], io(seg(t, e[1], e[2] - e[1])));
          else if (e[0] === 'wait') pos = LX[e[3]] - 74 - waiting[e[3]].indexOf(it.i) * 20;
          else { inside = e[3]; exc = e[4]; pos = LX[e[3]]; }
          break; } }
      if (pos === null || (inside !== null && !exc)) return;
      var y = floor - 16;
      if (inside !== null && exc) { var ev = it.ev.filter(function (e) { return e[0] === 'in' && e[3] === 1; })[0]; var p = seg(t, ev[1], ev[2] - ev[1]); y += Math.sin(Math.min(1, p * 1.25) * Math.PI) * 70; }
      rr(x, pos - 8, y, 16, 16, 3, ai ? css(K.red) : css(K.red, .55));
    });
  }

  function draw(x, t) {
    ['INTAKE', 'DECIDE', 'ACT'].forEach(function (s, k) { txt(x, s, LX[k], 34, 600, 12, css(K.ink2), 'center', 2); });
    function lane(y0, label, items, ai) {
      txt(x, label, 30, y0 - 4, 600, 10, ai ? css(K.red) : css(K.ink3), 'left', 2);
      var floor = y0 + 86; line(x, [[30, floor], [670, floor]], css(K.line2), 2);
      LX.forEach(function (cx, k) {
        rr(x, cx - 48, y0 + 10, 96, 76, 10, css(K.surface), css(K.line2), 1.8);
        var busy = items.some(function (it) { return it.ev.some(function (e) { return e[0] === 'in' && e[3] === k && t >= e[1] && t < e[2]; }); });
        if (ai) { sparkle(x, cx, y0 + 40, 7, busy ? css(K.red) : css(K.red, .4)); if (busy && k === 1) spinner(x, cx, y0 + 40, 15, t, css(K.red), 2); }
        else { person(x, cx, y0 + 44, 10, busy ? css(K.ink) : css(K.line)); if (busy) spinner(x, cx, y0 + 44, 20, t * .4, css(K.ink3), 2); }
      });
      drawItems(x, t, items, floor, ai);
      var done = items.filter(function (it) { return t >= it.done; }).length, n = String(done);
      txt(x, n, 670, y0 + 2, 600, 22, ai ? css(K.red) : css(K.ink), 'right', 0, K.disp);
      txt(x, 'done', 670 - tw(x, n, 600, 22, K.disp) - 6, y0 + 2, 400, 10, css(K.ink3), 'right');
      return done;
    }
    var m = lane(70, 'BEFORE · MANUAL HANDOFFS', MAN, false);
    txt(x, 'queue', LX[1] - 74, 140, 400, 9, css(K.ink3), 'center');
    var a = lane(250, 'AFTER · REBUILT AROUND AI', AIL, true);
    /* exceptions go to a person */
    circ(x, LX[1], 414, 14, css(K.surface), css(K.ink), 1.6); person(x, LX[1], 415, 7, css(K.ink));
    txt(x, 'exceptions go to a person', LX[1] + 24, 418, 400, 10, css(K.ink2));
    /* metrics */
    line(x, [[30, 460], [670, 460]], css(K.line), 1);
    txt(x, 'FRICTION ↓', 30, 492, 600, 12, css(K.ink), 'left', 2); txt(x, 'handoffs 3 → 1', 30, 512, 400, 11, css(K.ink2));
    txt(x, 'CAPACITY ↑', 360, 492, 600, 12, css(K.ink), 'left', 2);
    txt(x, m > 0 ? '×' + (a / m).toFixed(1) + ' items in the same time' : a + ' vs ' + m + ' items', 360, 512, 400, 11, m > 0 ? css(K.red) : css(K.ink2));
    txt(x, 'WORKFLOWS, REDESIGNED AROUND AI', 30, 548, 600, 11, css(K.ink3), 'left', 2.5);
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
      fs = Math.max(1, 7.5 * dpr / s / 11);   /* small labels never below 7.5px */
      draw(ctx, t);
    };
    if ('ResizeObserver' in window) new ResizeObserver(function () { v.size(); v.frame(v.t); }).observe(cv); else v.size();
    return v;
  });

  RM.setAutomation = function (p, which) {
    var t = clamp(p) * END;
    views.forEach(function (v) { if (which == null || which === v.cv) v.frame(t); });
  };
  RM.playAutomation = function (which) {
    var t0 = performance.now();
    (function step(now) { var t = (now - t0) / 1000; RM.setAutomation(t / END, which); if (t < END) requestAnimationFrame(step); })(t0);
  };
  RM.automationCanvases = cvs;

  readTokens();
  var F = RM.flags || {};
  RM.setAutomation(F.motion ? 0 : 1);
  new MutationObserver(function () { readTokens(); views.forEach(function (v) { v.frame(v.t); }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-ui', 'class'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { views.forEach(function (v) { v.frame(v.t); }); });
})();
