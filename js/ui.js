/* Redmelon v0.2 — WhatsApp widget, contact form, scroll state, pointer gestures. */
(function(){
  const fab = document.getElementById('waFab'), panel = document.getElementById('waPanel');
  const body = document.getElementById('waBody'), opts = document.getElementById('waOpts');
  const badge = document.getElementById('waBadge');
  let open = false;

  function bubble(text, mine) {
    const d = document.createElement('div');
    d.className = 'wa-msg ' + (mine ? 'wa-out' : 'wa-in');
    d.textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    if (M.animate && !RM) M.animate(d, { opacity:[0,1], transform:['translateY(8px) scale(.97)','none'] }, { duration:.28 });
    return d;
  }
  function step(key) {
    if (key === 'book' || key === 'brief') {
      bubble(key === 'book' ? 'Book a call' : 'Send a brief', true);
      setTimeout(() => { bubble('Taking you there now.'); setOpts([['Start over','start_over']]); toggle(false);
        window.redmelonScrollTo(document.getElementById('contact'),!RM);
        setTimeout(() => document.querySelector('.brief-step:not([hidden]) h3, #sent:not([hidden])').focus({ preventScroll:true }), 700); }, 380);
      return;
    }
    if (key === 'start_over') { body.innerHTML = ''; step('hello'); return; }
    const node = WA_FLOW[key]; if (!node) return;
    if (key !== 'hello') {
      const label = [...opts.querySelectorAll('.wa-opt')].find(b => b.dataset.k === key);
      if (label) bubble(label.textContent, true);
    }
    setOpts([]);
    setTimeout(() => { bubble(node.msg); setOpts(node.opts); }, key === 'hello' ? 250 : 480);
  }
  function setOpts(list) {
    opts.innerHTML = list.map(([t,k],i) =>
      `<button class="wa-opt${i===0 && list.length>1 ? ' go' : ''}" data-k="${k}">${t}</button>`).join('');
  }
  opts.addEventListener('click', e => { const b = e.target.closest('.wa-opt'); if (b) step(b.dataset.k); });

  function toggle(v) {
    open = v;
    panel.classList.toggle('open', v);
    fab.setAttribute('aria-expanded',String(v));
    badge.style.display = v ? 'none' : 'block';
    if (v) {
      if (!body.children.length) step('hello');
      if (M.animate && !RM) M.animate(panel, { opacity:[0,1], transform:['translateY(14px) scale(.94)','none'] }, { duration:.34, easing:[.2,.8,.2,1] });
      panel.querySelector('.wa-x').focus({ preventScroll:true });
    }
  }
  fab.addEventListener('click', () => toggle(!open));
  document.getElementById('waClose').addEventListener('click', () => { toggle(false); fab.focus({ preventScroll:true }); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) { toggle(false); fab.focus({ preventScroll:true }); } });
})();

/* Scroll effects are initialized after the preloader by scroll.js. */

/* ---------------- library-independent scroll state ----------------
   Nav background, the gutter rail and the model counter must work even if a
   CDN is blocked, so they use plain listeners rather than ScrollTrigger. */
(function(){
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-stuck', scrollY > 50);
  addEventListener('scroll', onScroll, { passive:true }); onScroll();

  const items = [...document.querySelectorAll('.rail-item')];
  if (items.length && 'IntersectionObserver' in window) {
    SECTIONS.forEach(sec => new IntersectionObserver(entries => {
      entries.forEach(en => { if (!en.isIntersecting) return;
        const i = SECTIONS.indexOf(en.target);
        if (i > -1) items.forEach((it,k) => it.classList.toggle('on', k === i)); });
    }, { rootMargin:'-45% 0px -45% 0px' }).observe(sec));
  }

  const count = document.getElementById('mCount');
  const cards = [...document.querySelectorAll('.move-card')];
  if (count && cards.length && 'IntersectionObserver' in window) {
    cards.forEach((c,i) => new IntersectionObserver(es => {
      es.forEach(en => { if (en.isIntersecting) count.textContent = String(i+1).padStart(2,'0') + ' / 04'; });
    }, { rootMargin:'-35% 0px -35% 0px' }).observe(c));
  }
})();

/* ---------------- pointer gestures ---------------- */
try {
if (M.animate && !RM && matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.btn-1').forEach(b => {
    const sheen = b.querySelector('.sheen');
    b.addEventListener('mouseenter', () => {
      M.animate(b, { scale:1.035 }, { duration:.4 });
      if (sheen) M.animate(sheen, { transform:['translateX(-120%)','translateX(120%)'] }, { duration:.85, easing:'ease-in-out' });
    });
    b.addEventListener('mouseleave', () => M.animate(b, { scale:1 }, { duration:.4 }));
  });
  document.querySelectorAll('.magnet').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      M.animate(b, { x:(e.clientX - r.left - r.width/2) * .16, y:(e.clientY - r.top - r.height/2) * .28 }, { duration:.35 });
    });
    b.addEventListener('mouseleave', () => M.animate(b, { x:0, y:0 }, { duration:.5 }));
  });
}
} catch (e) { console.warn('pointer gestures skipped:', e); }

onTheme();
