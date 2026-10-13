/* =====================================================================
   CHECKPOINT · 02 AI experience illustration (concept C).
   AI actions leave the AI node in orange, stop at a human checkpoint where a
   review ring fills, then go through approved, get an edit mark, or are sent
   back along a loop to the AI. A tally keeps the record.
   Desktop: scroll drives it, RM.setCheckpoint(p) with p 0..1 (motion.js).
   Phones: plays once when its card is swiped into view.
   Colours come from the tokens, so it follows light and dark themes.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $$ = RM.$$;
  var cvs = $$('canvas.ckpt'); if (!cvs.length) return;

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
    ['ink', 'ink3', 'line', 'line2', 'red', 'surface'].forEach(function (k) { K[k] = rgb(cs.getPropertyValue('--' + k).trim() || '#888'); });
    K.font = cs.getPropertyValue('--sans').trim() || 'system-ui, sans-serif';
  }
  var css = function (c, a) { return 'rgba(' + c.join(',') + ',' + (a == null ? 1 : a) + ')'; };
  function spacing(ctx, px) { if ('letterSpacing' in ctx) ctx.letterSpacing = px + 'px'; }
  function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  /* scene: 700 x 560 */
  var AX = 78, GX = 350, DX = 622, Y = 230;
  var OUT = ['a', 'a', 'e', 'a', 'r', 'a', 'e', 'a', 'a'];   /* approve · edit · sent back */
  var items = OUT.map(function (o, i) { var r = .2 + i * .4, a = r + .6, d = a + .32; return { o: o, r: r, a: a, d: d, end: d + (o === 'r' ? .85 : .55) }; });
  var END = Math.max.apply(null, items.map(function (i) { return i.end; })) + .4;
  var rItem = items.filter(function (i) { return i.o === 'r'; })[0];

  function sparkle(ctx, x, y, s, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x + s * .18, y - s * .18, x + s, y); ctx.quadraticCurveTo(x + s * .18, y + s * .18, x, y + s); ctx.quadraticCurveTo(x - s * .18, y + s * .18, x - s, y); ctx.quadraticCurveTo(x - s * .18, y - s * .18, x, y - s); ctx.fill(); }
  function loop(u) { var P0 = [GX - 6, Y + 22], P1 = [(GX + AX) / 2, Y + 175], P2 = [AX + 10, Y + 30], v = 1 - u;
    return [v * v * P0[0] + 2 * v * u * P1[0] + u * u * P2[0], v * v * P0[1] + 2 * v * u * P1[1] + u * u * P2[1]]; }
  function card(ctx, x, y, state, a, sc) {
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(sc, sc);
    var w = 40, h = 28;
    ctx.fillStyle = css(K.surface); ctx.strokeStyle = css(state === 'ai' ? K.red : state === 'r' ? K.ink3 : K.ink); ctx.lineWidth = 2;
    if (state === 'r') ctx.setLineDash([4, 3]);
    rrect(ctx, -w / 2, -h / 2, w, h, 6); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = state === 'ai' ? css(K.red, .4) : css(K.line2, state === 'r' ? .35 : .6);
    ctx.fillRect(-12, -5, 24, 3); ctx.fillRect(-12, 2, 16, 3);
    if (state === 'ai') sparkle(ctx, w / 2 - 7, -h / 2 + 7, 4, css(K.red));
    if (state === 'e') { ctx.fillStyle = css(K.ink); ctx.beginPath(); ctx.arc(w / 2, -h / 2, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = css(K.surface); ctx.font = '700 8px ' + K.font; ctx.textAlign = 'center'; ctx.fillText('✎', w / 2, -h / 2 + 3); }
    ctx.restore();
  }

  function draw(ctx, t, fs) {
    fs = fs || 1;
    /* track */
    ctx.strokeStyle = css(K.line); ctx.lineWidth = 2; ctx.setLineDash([2, 7]); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(AX + 30, Y); ctx.lineTo(DX - 30, Y); ctx.stroke();
    /* return loop, stronger once the first send-back happens */
    var lp = seg(t, rItem.d - .05, .3);
    ctx.strokeStyle = css(K.red, .15 + .5 * lp); ctx.beginPath();
    for (var u = 0; u <= 1.001; u += .02) { var q = loop(u); if (u === 0) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]); }
    ctx.stroke(); ctx.setLineDash([]);
    ctx.font = '400 ' + (12 * fs).toFixed(1) + 'px ' + K.font; ctx.textAlign = 'center'; ctx.fillStyle = css(K.ink3, .5 + .5 * lp);
    ctx.fillText('sent back', (GX + AX) / 2, Y + 118);
    /* AI node and system node */
    ctx.fillStyle = css(K.red); ctx.beginPath(); ctx.arc(AX, Y, 30, 0, Math.PI * 2); ctx.fill(); sparkle(ctx, AX, Y, 13, '#fff');
    ctx.fillStyle = css(K.surface); ctx.strokeStyle = css(K.ink); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(DX, Y, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(DX - 10, Y); ctx.lineTo(DX - 3, Y + 8); ctx.lineTo(DX + 11, Y - 8); ctx.stroke();
    /* human checkpoint + review ring */
    var rev = items.filter(function (i) { return t >= i.a && t < i.d; })[0];
    ctx.fillStyle = css(K.surface); ctx.strokeStyle = css(K.line); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(GX, Y, 44, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (rev) { var rp = seg(t, rev.a, rev.d - rev.a); ctx.strokeStyle = css(rev.o === 'r' && rp > .7 ? K.red : K.ink); ctx.beginPath(); ctx.arc(GX, Y, 44, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * out(rp)); ctx.stroke(); }
    ctx.fillStyle = css(K.ink); ctx.beginPath(); ctx.arc(GX, Y - 72, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(GX, Y - 50, 16, Math.PI, 0); ctx.fill();
    /* decision flashes above the checkpoint */
    items.forEach(function (it) { var p = seg(t, it.d - .04, .5); if (p <= 0 || p >= 1) return;
      ctx.globalAlpha = 1 - p; ctx.font = '600 ' + (13 * fs).toFixed(1) + 'px ' + K.font; ctx.textAlign = 'center';
      ctx.fillStyle = css(it.o === 'r' ? K.red : K.ink); spacing(ctx, 1);
      ctx.fillText(it.o === 'a' ? 'APPROVED' : it.o === 'e' ? 'EDITED' : 'SENT BACK', GX, Y - 118 - out(p) * 14);
      spacing(ctx, 0); ctx.globalAlpha = 1; });
    /* actions travelling */
    items.forEach(function (it) {
      if (t < it.r || t > it.end) return;
      var x, y = Y, state = 'ai', a = 1, sc = 1, p;
      if (t < it.a) { p = io(seg(t, it.r, it.a - it.r)); x = lerp(AX + 44, GX - 48, p); sc = lerp(.6, 1, clamp(p * 3)); }
      else if (t < it.d) { p = seg(t, it.a, it.d - it.a); x = GX - 48 + Math.sin(p * Math.PI * 2) * 1.2; }
      else {
        state = it.o === 'r' ? 'r' : it.o === 'e' ? 'e' : 'ok';
        p = seg(t, it.d, it.end - it.d);
        if (it.o === 'r') { var b = loop(io(p)); x = b[0]; y = b[1]; a = 1 - seg(p, .75, .25); sc = lerp(1, .6, seg(p, .6, .4)); }
        else { x = lerp(GX + 48, DX - 26, io(p)); a = 1 - seg(p, .8, .2); sc = lerp(1, .6, seg(p, .75, .25)); }
        if (p < .18) x = lerp(GX - 48, x, p / .18);
      }
      card(ctx, x, y, state, a, sc);
    });
    /* stage labels */
    [[AX, 'AI PROPOSES', 'drafts an action'], [GX, 'YOU REVIEW', 'approve · edit · send back'], [DX, 'SYSTEM ACTS', 'only after review']].forEach(function (l) {
      ctx.textAlign = 'center'; ctx.font = '600 ' + (14 * fs).toFixed(1) + 'px ' + K.font; ctx.fillStyle = css(K.ink); spacing(ctx, fs > 1.2 ? 1 : 2);
      ctx.fillText(l[1], l[0], Y + 80); spacing(ctx, 0);
      ctx.font = '400 ' + (12 * fs).toFixed(1) + 'px ' + K.font; ctx.fillStyle = css(K.ink3); ctx.fillText(l[2], l[0], Y + 80 + 20 * fs);
    });
    /* tally */
    var done = items.filter(function (i) { return t >= i.d; }), cnt = function (o) { return done.filter(function (i) { return i.o === o; }).length; };
    var prop = items.filter(function (i) { return t >= i.r; }).length;
    var parts = [[prop + ' proposed', K.red], [cnt('a') + ' approved', K.ink], [cnt('e') + ' edited', K.ink], [cnt('r') + ' sent back', K.red]];
    var yy = 470, x = 40;
    ctx.strokeStyle = css(K.line); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(40, yy - 30); ctx.lineTo(660, yy - 30); ctx.stroke();
    ctx.textAlign = 'left'; ctx.font = '500 ' + (14 * fs).toFixed(1) + 'px ' + K.font;
    parts.forEach(function (pt, i) { ctx.fillStyle = css(pt[1]); ctx.fillText(pt[0], x, yy); x += ctx.measureText(pt[0]).width + 22;
      if (i < 3) { ctx.fillStyle = css(K.ink3); ctx.fillText('·', x - 14, yy); } });
    ctx.font = '600 ' + (12 * fs).toFixed(1) + 'px ' + K.font; spacing(ctx, 2); ctx.fillStyle = css(K.ink3);
    ctx.fillText('PEOPLE + INTELLIGENT SYSTEMS', 40, 520); spacing(ctx, 0);
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
      draw(ctx, t, Math.max(1, 8.5 * dpr / s / 14));   /* labels never smaller than 8.5px */
    };
    if ('ResizeObserver' in window) new ResizeObserver(function () { v.size(); v.frame(v.t); }).observe(cv); else v.size();
    return v;
  });

  RM.setCheckpoint = function (p, which) {
    var t = clamp(p) * END;
    views.forEach(function (v) { if (which == null || which === v.cv) v.frame(t); });
  };
  /* time-based play (phones): runs once from the start */
  RM.playCheckpoint = function (which) {
    var t0 = performance.now();
    (function step(now) { var t = (now - t0) / 1000; RM.setCheckpoint(t / END, which); if (t < END) requestAnimationFrame(step); })(t0);
  };
  RM.checkpointCanvases = cvs;

  readTokens();
  var F = RM.flags || {};
  RM.setCheckpoint(F.motion ? 0 : 1);
  new MutationObserver(function () { readTokens(); views.forEach(function (v) { v.frame(v.t); }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-ui', 'class'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { views.forEach(function (v) { v.frame(v.t); }); });
})();
