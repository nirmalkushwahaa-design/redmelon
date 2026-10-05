/* =====================================================================
   FORM · global "Get a call back" behaviour, pre-fill, validation,
   submit, loading/error/success, ≤560px bottom sheet
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $ = RM.$, $$ = RM.$$, F = RM.FORM, root = document.documentElement;
  var form = $('#callback'), wrap = $('#formWrap'), view = $('#formView'), ok = $('#success');
  if (!form) return;
  var fields = { name: $('#f-name'), email: $('#f-email'), phone: $('#f-phone'), what: $('#f-what') };
  var stage = $('#f-stage'), note = $('#startNote'), btn = $('#submit'), formErr = $('#formErr');
  var isSheetSize = function () { return innerWidth <= 560; };
  var lastTrigger = null, started = false;

  /* ---------- defaults: phone country code + time zone ---------- */
  (function () {
    var lang = (navigator.language || 'en-GB').split('@')[0], code = RM.DIAL[lang] || RM.DIAL[lang.split('-')[0]] || '';
    if (code) {
      fields.phone.placeholder = code + ' ' + (code === '+44' ? '7700 900000' : code === '+1' ? '555 010 0000' : '000 000 000');
      fields.phone.addEventListener('focus', function () { if (!fields.phone.value) fields.phone.value = code + ' '; });
      fields.phone.addEventListener('blur', function () { if (fields.phone.value.trim() === code) fields.phone.value = ''; });
    }
    var tz = $('#f-tz'), here = 'UTC';
    try { here = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) {}
    var zones = ['America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York', 'America/Toronto', 'Europe/London', 'Europe/Dublin',
      'Europe/Lisbon', 'Europe/Paris', 'Europe/Berlin', 'Europe/Amsterdam', 'Europe/Madrid', 'Europe/Rome', 'Europe/Stockholm', 'Europe/Warsaw',
      'Europe/Athens', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Australia/Sydney', 'UTC'];
    if (zones.indexOf(here) < 0) zones.unshift(here);
    tz.innerHTML = zones.map(function (z) { return '<option' + (z === here ? ' selected' : '') + '>' + z + '</option>'; }).join('');
  })();

  /* ---------- validation ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, PHONE = /^\+\d[\d\s().-]{6,}$/;
  var FREE = /@(gmail|googlemail|yahoo|hotmail|outlook|live|icloud|me|aol|proton(mail)?|gmx|mail)\./i;
  function setErr(key, msg) {
    var f = fields[key], err = $('#e-' + key);
    f.closest('.field').classList.toggle('bad', !!msg);
    f.setAttribute('aria-invalid', msg ? 'true' : 'false');
    err.innerHTML = msg ? RM.txt(msg) : '';
  }
  function check(key) {
    var v = fields[key].value.trim();
    if (!v || (key === 'phone' && /^\+\d{1,3}$/.test(v))) { setErr(key, 'Add ' + F.empty[key] + ' so we can call you back.'); return false; }
    if (key === 'email' && !EMAIL.test(v)) { setErr(key, F.emailBad); return false; }
    if (key === 'phone' && !PHONE.test(v)) { setErr(key, F.phoneBad); return false; }
    setErr(key, ''); return true;
  }
  Object.keys(fields).forEach(function (k) {
    fields[k].addEventListener('blur', function () { if (fields[k].value.trim() || fields[k].closest('.field').classList.contains('bad')) check(k); });
    fields[k].addEventListener('input', function () { if (fields[k].closest('.field').classList.contains('bad')) check(k); });
  });
  fields.email.addEventListener('blur', function () {
    $('#h-email').textContent = FREE.test(fields.email.value) && EMAIL.test(fields.email.value.trim()) ? F.freeMail : '';
  });
  form.addEventListener('focusin', function () { if (!started) { started = true; RM.track('form_start'); } });

  /* ---------- submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formErr.textContent = '';
    var bad = Object.keys(fields).filter(function (k) { return !check(k); });
    RM.track('form_submit');
    if (bad.length) { RM.track('form_error', { fields: bad }); fields[bad[0]].focus(); return; }
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
    data.page = location.href; data.sent_at = new Date().toISOString();
    loading(true);
    send(data).then(function () { loading(false); success(data); }, function () {
      loading(false); formErr.innerHTML = RM.txt(F.sendFail); RM.track('form_error', { fields: ['send'] });
    });
  });
  function loading(on) {
    btn.disabled = on; btn.classList.toggle('is-loading', on);
    $('.submit-lab', btn).textContent = on ? 'Sending' : 'Request my call back';
  }
  function send(data) {
    var url = RM.CONFIG.FORM_ENDPOINT;
    if (!url) {                                         /* not wired yet: simulate and log */
      console.log('[rm] callback request (simulated, set CONFIG.FORM_ENDPOINT):', data);
      return new Promise(function (res) { setTimeout(res, 900); });
    }
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); });
  }
  function success(data) {
    var first = (data.name || '').split(/\s+/)[0];
    $('#successH').textContent = 'Thanks' + (first ? ', ' + first : '') + ". We've got it.";
    crossfade(view, ok, function () { ok.focus({ preventScroll: true }); });
    RM.track('form_success');
  }
  $('#again').addEventListener('click', function () {
    form.reset(); note.hidden = true; started = false;
    Object.keys(fields).forEach(function (k) { setErr(k, ''); });
    crossfade(ok, view, function () { fields.name.focus({ preventScroll: true }); });
  });
  function crossfade(a, b, done) {
    if (!RM.flags.motion) { a.hidden = true; b.hidden = false; done(); refresh(); return; }
    gsap.to(a, { opacity: 0, duration: .3, onComplete: function () {
      a.hidden = true; gsap.set(a, { opacity: 1 }); b.hidden = false;
      gsap.fromTo(b, { opacity: 0 }, { opacity: 1, duration: .3 }); done(); refresh();
    } });
  }
  function refresh() { if (window.ScrollTrigger) ScrollTrigger.refresh(); }

  /* ---------- ≤560px: bottom sheet ---------- */
  var backdrop = document.createElement('div'); backdrop.className = 'sheet-backdrop'; document.body.appendChild(backdrop);
  function openSheet() {
    wrap.classList.add('is-sheet'); backdrop.classList.add('on'); root.classList.add('sheet-open');
    wrap.setAttribute('role', 'dialog'); wrap.setAttribute('aria-modal', 'true'); wrap.setAttribute('aria-label', 'Get a call back');
    if (RM.lenis) RM.lenis.stop();
    setTimeout(function () { (view.hidden ? ok : fields.name).focus({ preventScroll: true }); }, 60);
  }
  function closeSheet() {
    if (!wrap.classList.contains('is-sheet')) return;
    wrap.classList.remove('is-sheet'); backdrop.classList.remove('on'); root.classList.remove('sheet-open');
    wrap.removeAttribute('role'); wrap.removeAttribute('aria-modal'); wrap.removeAttribute('aria-label');
    if (RM.lenis) RM.lenis.start();
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }
  $('#sheetClose').addEventListener('click', closeSheet);
  backdrop.addEventListener('click', closeSheet);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });
  addEventListener('resize', function () { if (!isSheetSize()) closeSheet(); });

  /* ---------- global CTA: every "Get a call back" reaches the form ---------- */
  RM.openForm = function (trigger, opts) {
    opts = opts || {};
    lastTrigger = trigger || null;
    if (opts.stage) {
      stage.value = opts.stage;
      note.textContent = 'Starting point: ' + opts.tile; note.hidden = false;
    }
    if (isSheetSize()) { openSheet(); return; }
    RM.scrollTo('#contact', { offset: -(parseInt(getComputedStyle(root).getPropertyValue('--nav-h'), 10) || 72) + 8,
      done: function () { if (!view.hidden) fields.name.focus({ preventScroll: true }); } });
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#contact"]');
    if (!a) return;
    e.preventDefault();
    RM.track('cta_click', { location: a.dataset.cta || 'link' });
    RM.openForm(a, a.dataset.stage ? { stage: a.dataset.stage, tile: a.dataset.tile } : null);
  });
})();
