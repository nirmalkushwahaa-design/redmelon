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
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) { if (btn) btn.hidden = true; RM.sfx = function () {}; return; }

  function init() {
    if (ctx) return;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = .5; master.connect(ctx.destination);
  }
  /* one short tone: frequency, length (s), type, volume, optional pitch glide */
  function tone(f, len, type, vol, glide, delay) {
    var t = ctx.currentTime + (delay || 0), o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + len);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + len + .02);
  }
  function noise(len, vol, from, to) {   /* filtered noise sweep = soft whoosh */
    var t = ctx.currentTime, b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * len), ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = b; f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + len);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + len * .3); g.gain.exponentialRampToValueAtTime(.0001, t + len);
    s.connect(f); f.connect(g); g.connect(master); s.start(t);
  }
  var SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66]; /* C major pentatonic-ish, bright and friendly */
  var SOUNDS = {
    tick:   function () { tone(1800, .035, 'triangle', .05); },
    pop:    function () { tone(420, .09, 'sine', .09, 260); },
    note:   function (n) { tone(SCALE[(n || 0) % SCALE.length], .18, 'sine', .07); tone(SCALE[(n || 0) % SCALE.length] * 2, .12, 'sine', .02); },
    whoosh: function () { noise(.35, .05, 400, 2400); },
    chime:  function () { tone(880, .22, 'sine', .07); tone(1318.5, .3, 'sine', .05, null, .07); },
    click:  function () { tone(240, .05, 'square', .03, 120); },
    cascade:function (n) { for (var i = 0; i < (n || 8); i++) tone(SCALE[i % SCALE.length], .14, 'sine', .035, null, i * .06); }
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
