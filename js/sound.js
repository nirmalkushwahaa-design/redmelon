/* =====================================================================
   SOUND · tiny UI sounds made with the Web Audio API (no audio files).
   Off by default; the speaker button in the nav turns it on (that click
   also unlocks audio in the browser). The choice is remembered.
   RM.sfx(name, n) plays a sound; other scripts call it at key moments.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, btn = document.getElementById('snd');
  var KEY = 'rm-sound', on = false, ctx = null, master = null, last = {};
  try { on = localStorage.getItem(KEY) === 'on'; } catch (e) {}
  if (btn && btn.hidden) on = false;   /* speaker switch hidden from the nav (Nirmal, 12 Oct): sounds stay off */
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) { if (btn) btn.hidden = true; RM.sfx = function () {}; return; }

  function init() {
    if (ctx) return;
    ctx = new AC();
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
    master = ctx.createGain(); master.gain.value = .6; master.connect(comp); comp.connect(ctx.destination);
    nbuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    var d = nbuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  var nbuf = null;
  function env(g, t, v, len) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .002); g.gain.exponentialRampToValueAtTime(.0001, t + len); }
  /* short tone: frequency, length (s), volume, type, glide-to, lowpass, delay */
  function tone(f, len, vol, type, glide, lp, delay) {
    var t = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain(), n = o;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + len * .8);
    if (lp) { var fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl); n = fl; }
    env(g, t, vol, len); n.connect(g); g.connect(master); o.start(t); o.stop(t + len + .05);
  }
  /* filtered noise burst = the "click": length, volume, filter type, frequency, Q, sweep-to, delay */
  function nz(len, vol, type, f, q, to, delay) {
    var t = ctx.currentTime + (delay || 0), s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = nbuf; fl.type = type; fl.Q.value = q || 1; fl.frequency.setValueAtTime(f, t);
    if (to) fl.frequency.exponentialRampToValueAtTime(to, t + len);
    env(g, t, vol, len); s.connect(fl); fl.connect(g); g.connect(master); s.start(t, Math.random() * .4); s.stop(t + len + .05);
  }
  var LOW = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33]; /* pentatonic notes for the industry rows */
  /* "Tactile Click" pack (D, picked in the Sound Lab): crisp keyboard/switch clicks */
  var SOUNDS = {
    tick:   function () { nz(.012, .09, 'highpass', 4200, .7); },
    pop:    function () { nz(.025, .08, 'bandpass', 1400, 2); tone(160, .035, .06, 'sine', 90); },
    note:   function (n) { nz(.012, .06, 'highpass', 3500); tone(LOW[(n || 0) % LOW.length], .08, .035, 'triangle', null, 2000); },
    whoosh: function () { nz(.18, .04, 'bandpass', 900, 1.5, 3000); },
    chime:  function () { nz(.015, .08, 'highpass', 3000); tone(1046.5, .12, .03, 'triangle', null, 3000, .03); },
    click:  function () { nz(.02, .1, 'bandpass', 800, 3); nz(.015, .06, 'bandpass', 1600, 3, null, .045); },
    cascade:function (n) { for (var i = 0; i < (n || 8); i++) nz(.015, .07, 'highpass', 2500 + i * 300, 1, null, i * .05); }
  };
  var GAP = { tick: 70, pop: 120, note: 60, whoosh: 250, chime: 200, click: 80, cascade: 800 };

  RM.sfx = function (name, n) {
    if (!on || !ctx || document.hidden) return;
    var now = performance.now(); if (last[name] && now - last[name] < GAP[name]) return; last[name] = now;
    if (ctx.state === 'suspended') ctx.resume();
    try { SOUNDS[name](n); } catch (e) {}
  };

  function paint() {
    if (!btn) return;
    btn.classList.toggle('is-on', on); btn.setAttribute('aria-pressed', on);
    btn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
  }
  if (btn) btn.addEventListener('click', function () {
    on = !on; init(); if (ctx.state === 'suspended') ctx.resume();
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
    paint(); if (on) RM.sfx('chime');
  });
  paint();
  /* a remembered "on" still needs one user gesture before the browser allows audio */
  if (on) ['pointerdown', 'keydown'].forEach(function (ev) {
    addEventListener(ev, function unlock() { init(); if (ctx.state === 'suspended') ctx.resume(); removeEventListener(ev, unlock, true); }, true);
  });

  /* hover sounds (mouse only): buttons and links tick, service cards pop */
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  var lastEl = null;
  document.addEventListener('pointerover', function (e) {
    var el = e.target.closest && e.target.closest('.card, .btn, .nav-links a, .text-link, .card-go, .ind-go, .foot li a, .tile-head, .qa summary');
    if (!el || el === lastEl) return; lastEl = el;
    RM.sfx(el.classList.contains('card') ? 'pop' : 'tick');
  });
  document.addEventListener('pointerout', function (e) { if (lastEl && !lastEl.contains(e.relatedTarget)) lastEl = null; });
  var tgl = document.getElementById('tgl'); if (tgl) tgl.addEventListener('click', function () { RM.sfx('click'); });
})();
