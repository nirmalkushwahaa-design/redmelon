/* Redmelon v0.2 — Templates and the engagement-mode switch. */
/* Five names is not enough to fill a wide track, so the list repeats until it
   is wider than any viewport, then the whole thing is doubled — the -50%
   keyframe then loops seamlessly whatever the screen. */
(function(){
  const base = [];
  for (let i = 0; i < 4; i++) base.push(...WALL);
  const list = base.concat(base);
  const cell = (w,i) => `<span class="marquee-cell"${i>=WALL.length ? ' aria-hidden="true"' : ''}><span class="marquee-name">${w.n}</span><span class="marquee-dot" aria-hidden="true">✳</span></span>`;
  document.querySelectorAll('[data-wall]').forEach(el => {
    el.innerHTML = list.map(cell).join('');
  });
})();
document.querySelector('[data-cards]').innerHTML = OUTCOMES.map(([i,ic,t,b,hold]) => `
  <article class="outcome rv">
    <div class="outcome-top"><span class="outcome-num">${i}</span><span class="outcome-symbol" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[ic]}</svg></span></div>
    <h3>${t}</h3>
    <p>${b}</p>
    <div class="outcome-foot">
      <span class="outcome-hold">${hold}</span>
    </div>
  </article>`).join('');

document.querySelector('[data-moves]').innerHTML = MOVES.map((m, i) => `
  <article class="move-card" data-k="${m.k}">
    <div class="move-card-grid"></div>
    <div class="move-card-in">
      <div>
        <span class="move-num">${m.n}</span>
        <h4>${m.t}</h4>
        <div class="move-role"><span class="move-role-dot" aria-hidden="true"></span>${EXPERIENCE.roles[i]}</div>
        <p class="move-desc"></p>
      </div>
      <div class="move-card-side">
        <div class="move-split">
          <div class="move-split-heading"><span>${EXPERIENCE.splitTitle}</span><span>${EXPERIENCE.splitNote}</span></div>
          <div class="move-split-labels"><span class="move-split-human">${EXPERIENCE.humanLabel} <strong data-human></strong></span><span class="move-split-ai">${EXPERIENCE.aiLabel} <strong data-ai></strong></span></div>
          <div class="move-split-track" aria-hidden="true"><span class="move-split-fill"></span></div>
        </div>
        <div class="move-check"><span><b>${EXPERIENCE.checkpoint}</b> <span class="move-check-title"></span><br><span class="move-check-sub"></span></span></div>
      </div>
    </div>
  </article>`).join('');

/* mode switch */
(function(){
  const bar = document.getElementById('modes');
  const moveEls = [...document.querySelectorAll('.move')];

  bar.innerHTML = Object.entries(MODES).map(([k,v],i) =>
    `<button class="mode${k===MODE?' on':''}" role="tab" id="mode-${k}" aria-controls="modePanel" tabindex="${k===MODE?0:-1}" aria-selected="${k===MODE}" data-m="${k}">${v.label}</button>`).join('');

  function paint(k, animate) {
    MODE = k;
    const m = MODES[k];
    document.getElementById("modePanel").setAttribute("aria-labelledby", "mode-"+k);
    bar.querySelectorAll('.mode').forEach(b => {
      const on = b.dataset.m === k;
      b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
    });

    MOVES.forEach((def, i) => {

      const d   = def.k === 'frame' ? m.frame : def.k === 'prove' ? m.prove : def.d;
      const chk = def.k === 'prove' ? m.proveChk : def.chk;
      const sub = def.k === 'prove' ? m.proveSub : def.sub;
      document.querySelectorAll('[data-k="' + def.k + '"]').forEach(el => {
        if (!el.classList.contains('move-card')) return;

        const dd = el.querySelector('.move-desc');       if (dd) dd.textContent = d;
        const ct = el.querySelector('.move-check-title');   if (ct) ct.textContent = chk;
        const cs = el.querySelector('.move-check-sub');   if (cs) cs.textContent = sub;
        const human = 100 - m.ai[def.k];
        el.querySelector('[data-human]').textContent = human + '%';
        el.querySelector('[data-ai]').textContent = (100 - human) + '%';
        el.querySelector('.move-split-fill').style.width = human + '%';
      });
    });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  bar.addEventListener('click', e => { const b = e.target.closest('.mode'); if (b) paint(b.dataset.m, true); });
  bar.addEventListener('keydown', e => {
    const keys = Object.keys(MODES), at = keys.indexOf(MODE);
    let next;
    if (e.key === 'ArrowRight') next=(at+1)%keys.length;
    if (e.key === 'ArrowLeft') next=(at+keys.length-1)%keys.length;
    if (e.key === 'Home') next=0;
    if (e.key === 'End') next=keys.length-1;
    if (next !== undefined) { e.preventDefault(); paint(keys[next],true); document.getElementById('mode-'+keys[next]).focus(); }
  });
  let touch;
  const panel = document.getElementById('modePanel');
  panel.addEventListener('touchstart', e => {touch=e.touches.length===1 ? {x:e.touches[0].clientX,y:e.touches[0].clientY} : null;}, {passive:true});
  panel.addEventListener('touchend', e => {
    if (!touch || !e.changedTouches.length) return;
    const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;
    if (Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.5) {
      const keys=Object.keys(MODES),at=keys.indexOf(MODE);
      paint(keys[(at+(dx<0?1:keys.length-1))%keys.length],true);
    }
    touch=null;
  },{passive:true});
  paint(MODE, false);
})();

document.querySelector('[data-caps]').innerHTML = CAPS.map(([n,ic,t,d,q]) => `
  <article class="cap rv${q ? ' cap-quiet' : ''}">
    <div class="cap-top">
      <span class="cap-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[ic]}</svg></span>
      <span class="cap-n">${n}</span>
    </div>
    <h3>${t}</h3>
    <p class="cap-d">${d}</p>
    ${q ? '<span class="cap-tag">By introduction</span>' : ''}
  </article>`).join('');

/* Keep the headline as accessible, naturally wrapping text. */
document.getElementById('headline').innerHTML = `<span class="hero-line">${EXPERIENCE.headlineLead}</span><span class="hero-human">${EXPERIENCE.headlineMiddle}<br>${EXPERIENCE.headlineEnd}</span>`;
document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = EXPERIENCE[el.dataset.copy] || ''; });

/* rail */
const SECTIONS = [...document.querySelectorAll('[data-rail]')];
document.getElementById('rail').innerHTML = SECTIONS.map((s,i) =>
  `<div class="rail-item${i===0?' on':''}" data-i="${i}"><span class="rail-dot"></span><span class="rail-lab">${s.dataset.rail}</span></div>`).join('');
