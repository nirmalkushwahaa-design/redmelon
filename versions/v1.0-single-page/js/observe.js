/* =====================================================================
   OBSERVE · 03 AI engineering illustration (concept C, "Observable").
   The engineering diagram (Docs, Data, APIs -> LLM -> Agents, Apps, Systems)
   with data flowing and a live metric under every node. A load gauge circles
   the LLM. Midway the APIs line times out, retries and recovers, 0 lost.
   Desktop: scroll drives it, RM.setObserve(p) with p 0..1 (motion.js).
   Phones: plays once when its card is swiped into view.
   Colours come from the tokens, so it follows light and dark themes.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $$ = RM.$$;
  var cvs = $$('canvas.obs'); if (!cvs.length) return;

  var TAU = Math.PI * 2;
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var seg = function (t, a, d) { return clamp((t - a) / d); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };

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
  var mix = function (a, b, p) { p = clamp(p); return 'rgb(' + a.map(function (v, i) { return Math.round(lerp(v, b[i], p)); }).join(',') + ')'; };

  var fs = 1;   /* scale for the small live-metric labels on narrow screens */
  function setFont(x, w, size, scale) { x.font = w + ' ' + (size * (scale ? fs : 1)).toFixed(1) + 'px ' + K.font; }
  function ls(x, px) { if ('letterSpacing' in x) x.letterSpacing = px + 'px'; }
  function txt(x, s, px, py, w, size, col, align, spacing, scale) { setFont(x, w, size, scale); x.fillStyle = col; x.textAlign = align || 'left'; ls(x, spacing || 0); x.fillText(s, px, py); ls(x, 0); }
  function tw(x, s, w, size, spacing, scale) { setFont(x, w, size, scale); ls(x, spacing || 0); var m = x.measureText(s).width; ls(x, 0); return m; }
  function rr(x, px, py, w, h, r, fill, stroke, lw) {
    x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
    if (fill) { x.fillStyle = fill; x.fill(); } if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw || 2; x.stroke(); }
  }
  function circ(x, px, py, r, fill) { x.beginPath(); x.arc(px, py, Math.max(0, r), 0, TAU); x.fillStyle = fill; x.fill(); }
  function line(x, a, b, col, lw, dash) { x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.strokeStyle = col; x.lineWidth = lw; x.lineCap = 'round'; if (dash) x.setLineDash(dash); x.stroke(); x.setLineDash([]); }
  function pkt(x, a, b, u, col, r) { if (u <= 0 || u >= 1) return; circ(x, lerp(a[0], b[0], u), lerp(a[1], b[1], u), r || 4.5, col); }

  /* diagram geometry (same layout as the old static image) */
  var IN = [['DOCS', 44, 40], ['DATA', 44, 216], ['APIS', 44, 393]];
  var OUTN = [['AGENTS', 503, 104], ['APPS', 503, 216], ['SYSTEMS', 503, 329]];
  var IW = 142, OW = 156, BH = 57, LC = [344, 245], LR = 60, END = 5.2;
  function inA(i) { return [IN[i][1] + IW, IN[i][2] + BH / 2]; }
  function outB(j) { return [OUTN[j][1], OUTN[j][2] + BH / 2]; }
  function edgeTo(p) { var dx = p[0] - LC[0], dy = p[1] - LC[1], d = Math.hypot(dx, dy); return [LC[0] + dx / d * LR, LC[1] + dy / d * LR]; }
  function box(x, name, bx, by, w, stroke) { rr(x, bx, by, w, BH, 6, css(K.surface), stroke || css(K.line2), 2.2); txt(x, name, bx + (w === IW ? 26 : 24), by + BH / 2 + 6, 600, 17, css(K.ink), 'left', 2.4); }
  function caption(x, t, times) {
    var parts = ['ORCHESTRATED, ', 'OBSERVABLE, ', 'IN PRODUCTION'], cx = 30;
    parts.forEach(function (s, i) { var on = seg(t, times[i], .25), fl = 1 - seg(t, times[i] + .25, .6);
      var col = on <= 0 ? css(K.line) : fl > 0 ? mix(K.ink3, K.red, fl) : css(K.ink3);
      txt(x, s, cx, 542, 600, 15, col, 'left', 2.6); cx += tw(x, s, 600, 15, 2.6); });
  }

  function draw(x, t) {
    var flowOn = function (s) { return s >= 0 && s <= 4.2; }, inc = t >= 2.0 && t < 3.1;
    /* input lines + data */
    IN.forEach(function (n, i) { var a = inA(i), b = edgeTo(a), bad = i === 2 && inc;
      line(x, a, b, bad ? css(K.red) : css(K.ink3), 2, bad ? [5, 5] : null);
      for (var k = 0; k < 26; k++) { var s = .1 + k * .17 + i * .05; if (!flowOn(s)) continue; if (i === 2 && s > 1.75 && s < 3.1) continue; pkt(x, a, b, seg(t, s, .5), css(K.ink3), 3.6); } });
    /* output lines + data */
    OUTN.forEach(function (n, j) { var b = outB(j), a = edgeTo(b); line(x, a, b, css(K.red), 3);
      for (var k = 0; k < 24; k++) { var s = .55 + k * .17 + j * .05; if (!flowOn(s)) continue; pkt(x, a, b, seg(t, s, .45), css(K.red), 3.6); } });
    /* load gauge + LLM */
    var ld = t < .2 ? 0 : (.62 + .08 * Math.sin(t * 3.1)) * (1 - seg(t, 4.4, .6)) * seg(t, .2, .4);
    if (ld > 0) { x.beginPath(); x.arc(LC[0], LC[1], LR + 10, -Math.PI / 2, -Math.PI / 2 + TAU * ld); x.strokeStyle = css(K.red, .35); x.lineWidth = 4; x.lineCap = 'round'; x.stroke(); }
    circ(x, LC[0], LC[1], LR, css(K.red)); txt(x, 'LLM', LC[0], LC[1] + 6, 600, 17, '#fff', 'center', 2);
    var calls = Math.round(lerp(0, 1240, seg(t, .2, .6))), ca = seg(t, .3, .3);
    if (ca > 0) { x.globalAlpha = ca; txt(x, calls.toLocaleString('en-IN') + ' calls/min', LC[0], LC[1] + LR + 34, 400, 11, css(K.ink2), 'center', 0, true); x.globalAlpha = 1; }
    /* nodes + live metrics */
    var MI = [function () { return Math.round(lerp(12000, 12480, seg(t, .3, 3.5))).toLocaleString('en-IN') + ' chunks indexed'; },
      function () { return 'synced ' + (t < 2.5 ? 4 : 1) + ' min ago'; },
      function () { return inc ? '3 sources · 1 retrying' : '3 sources · 200 OK'; }];
    var MO = [function () { return (t < 1.5 ? 1 : 2) + ' agents running'; }, function () { return 'p95 ' + (1.1 + (inc ? .08 : 0)).toFixed(2) + ' s'; }, function () { return 'ERP · CRM · in sync'; }];
    IN.forEach(function (n, i) { var bad = i === 2 && inc; box(x, n[0], n[1], n[2], IW, bad ? css(K.red) : null);
      var p = seg(t, .3 + i * .12, .3); if (p > 0) { x.globalAlpha = p; circ(x, n[1] + 5, n[2] + BH + 16, 3.5, bad ? css(K.red) : css(K.ink)); txt(x, MI[i](), n[1] + 14, n[2] + BH + 20, 400, 11, bad ? css(K.red) : css(K.ink2), 'left', 0, true); x.globalAlpha = 1; } });
    OUTN.forEach(function (n, j) { box(x, n[0], n[1], n[2], OW);
      var p = seg(t, .7 + j * .12, .3); if (p > 0) { x.globalAlpha = p; circ(x, n[1] + 5, n[2] + BH + 16, 3.5, css(K.red)); txt(x, MO[j](), n[1] + 14, n[2] + BH + 20, 400, 11, css(K.ink2), 'left', 0, true); x.globalAlpha = 1; } });
    /* incident tag on the APIs line */
    var a = inA(2), b = edgeTo(a), mid = [lerp(a[0], b[0], .45), lerp(a[1], b[1], .45)];
    var tg = seg(t, 2.0, .2) * (1 - seg(t, 4.0, .4));
    if (tg > 0) { x.globalAlpha = tg; var s = t < 2.65 ? 'TIMEOUT · RETRYING' : t < 3.1 ? 'RETRY 2/3 · OK' : 'RECOVERED · 0 LOST', red = t < 3.1;
      var w = tw(x, s, 600, 10, 1.2, true) + 20, h = 22 * Math.max(1, fs * .9);
      rr(x, mid[0] + 14, mid[1] - 34, w, h, h / 2, red ? css(K.red, .12) : css(K.surface), red ? css(K.red) : css(K.ink), 1.5);
      txt(x, s, mid[0] + 14 + w / 2, mid[1] - 34 + h / 2 + 4 * Math.max(1, fs * .9), 600, 10, red ? css(K.red) : css(K.ink), 'center', 1.2, true); x.globalAlpha = 1; }
    caption(x, t, [.3, 1.0, 3.2]);
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
      fs = Math.min(1.6, Math.max(1, 7.5 * dpr / s / 11));   /* metrics never below ~7.5px, capped so they still fit */
      draw(ctx, t);
    };
    if ('ResizeObserver' in window) new ResizeObserver(function () { v.size(); v.frame(v.t); }).observe(cv); else v.size();
    return v;
  });

  RM.setObserve = function (p, which) { var t = clamp(p) * END; views.forEach(function (v) { if (which == null || which === v.cv) v.frame(t); }); };
  RM.playObserve = function (which) { var t0 = performance.now();
    (function step(now) { var t = (now - t0) / 1000; RM.setObserve(t / END, which); if (t < END) requestAnimationFrame(step); })(t0); };
  RM.observeCanvases = cvs;

  readTokens();
  var F = RM.flags || {};
  RM.setObserve(F.motion ? 0 : 1);
  new MutationObserver(function () { readTokens(); views.forEach(function (v) { v.frame(v.t); }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-ui', 'class'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { views.forEach(function (v) { v.frame(v.t); }); });
})();
