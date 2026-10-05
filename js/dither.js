/* =====================================================================
   DITHER · shared ordered-dither renderer (Studio + contact panel).
   A drifting scalar field quantised to the four --art-* tokens through a
   4x4 Bayer matrix, drawn at low resolution and scaled up pixelated.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM;
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  function hex(v) { var n = parseInt(v.trim().slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function palette() {
    var s = getComputedStyle(document.documentElement);
    return [0, 1, 2, 3].map(function (i) { var v = s.getPropertyValue('--art-' + i); return v ? hex(v) : [0, 0, 0]; });
  }

  RM.$$('canvas.dither').forEach(function (cv, idx) {
    var ctx = cv.getContext ? cv.getContext('2d', { alpha: false }) : null;
    if (!ctx) return;
    var pal = palette(), W = 0, H = 0, img = null, t = Math.random() * 10, raf = 0, vis = false;
    var studio = idx === 0;                              /* studio: left-to-right ramp; contact: vertical */

    function px() { return innerWidth <= 900 ? 6 : 4; }
    function size() {
      var r = cv.getBoundingClientRect(); if (!r.width || !r.height) return false;
      var P = px(); W = Math.max(1, Math.round(r.width / P)); H = Math.max(1, Math.round(r.height / P));
      cv.width = W; cv.height = H; img = ctx.createImageData(W, H); return true;
    }
    function field(u, v) {
      var f = studio ? .16 + .62 * u * (1 - .35 * v) : .8 - v * .66;
      f += .2 * Math.sin(u * 7 + t) + .16 * Math.sin(v * 9 - t * .8) + .12 * Math.sin((u + v) * 11 + t * .55);
      if (studio) f += .1 * Math.sin(Math.hypot(u - .75, v - .4) * 22 - t * 1.4);
      return f;
    }
    function draw() {
      if (!img) return;
      var d = img.data, i = 0;
      for (var y = 0; y < H; y++) {
        var v = y / H;
        for (var x = 0; x < W; x++) {
          var f = field(x / W, v), q = Math.floor(f * 3.2 + (BAYER[(y & 3) * 4 + (x & 3)] / 16 - .5));
          q = q < 0 ? 0 : q > 3 ? 3 : q;
          var c = pal[q]; d[i++] = c[0]; d[i++] = c[1]; d[i++] = c[2]; d[i++] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    }
    function tick() { raf = 0; if (!vis) return; t += .01; draw(); raf = requestAnimationFrame(tick); }

    if (size()) draw(); else requestAnimationFrame(function () { if (size()) draw(); });
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (size()) draw(); }, 140); });
    if (RM.flags.rm) return;                             /* reduced motion: one still frame */
    RM.onScreen(cv, function (v) {
      vis = v;
      if (v && !raf) raf = requestAnimationFrame(tick);
      if (!v && raf) { cancelAnimationFrame(raf); raf = 0; }
    }, '0px');
  });
})();
