/* =====================================================================
   WHATSAPP · fab, panel and guided flow. Hidden until WHATSAPP_NUMBER is
   set (the review build shows it so the flow can be checked).
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $ = RM.$, C = RM.CONFIG;
  var wa = $('#wa'); if (!wa) return;
  var num = String(C.WHATSAPP_NUMBER || '').replace(/\D/g, '');
  if (!num && !C.REVIEW_MODE) return;
  wa.hidden = false;
  if (num) {
    RM.$$('.wa-only').forEach(function (n) { n.hidden = false; });
    var fw = $('#footWa'); if (fw) { fw.href = 'https://wa.me/' + num + '?text=Hi%20Redmelon'; fw.target = '_blank'; fw.rel = 'noopener'; }
  }

  var fab = $('#waFab'), panel = $('#waPanel'), body = $('#waBody'), opts = $('#waOpts'), open = false;

  function bubble(text, mine) {
    var d = document.createElement('div');
    d.className = 'wa-msg ' + (mine ? 'wa-out' : 'wa-in');
    d.innerHTML = RM.txt(text);
    body.appendChild(d); body.scrollTop = body.scrollHeight;
  }
  function setOpts(list) {
    opts.innerHTML = list.map(function (o, i) {
      return '<button type="button" class="wa-opt' + (i === 0 && list.length > 1 ? ' go' : '') + '" data-k="' + o[1] + '">' + RM.esc(o[0]) + '</button>';
    }).join('');
  }
  function step(key, label) {
    if (label) bubble(label, true);
    if (key === 'restart') { body.innerHTML = ''; step('hello'); return; }
    if (key === 'callback') { toggle(false); RM.openForm(fab); return; }
    var node = RM.WA_FLOW[key]; if (!node) return;
    setOpts([]);
    setTimeout(function () {
      bubble(node.msg); setOpts(node.opts);
      if (key === 'human') {
        RM.track('wa_handoff');
        if (num) window.open('https://wa.me/' + num + '?text=Hi%20Redmelon', '_blank', 'noopener');
        else bubble('Leave a message here or get a call back, and a person from the team will reply soon.');
      }
    }, key === 'hello' ? 200 : 420);
  }
  opts.addEventListener('click', function (e) { var b = e.target.closest('.wa-opt'); if (b) step(b.dataset.k, b.textContent); });

  function toggle(v) {
    open = v; panel.hidden = !v; fab.setAttribute('aria-expanded', v);
    if (v) {
      panel.classList.remove('opening'); void panel.offsetWidth; panel.classList.add('opening');
      if (!body.children.length) step('hello');
      $('#waClose').focus({ preventScroll: true });
      RM.track('wa_open');
    }
  }
  fab.addEventListener('click', function () { toggle(!open); });
  $('#waClose').addEventListener('click', function () { toggle(false); fab.focus({ preventScroll: true }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) { toggle(false); fab.focus({ preventScroll: true }); } });
})();
