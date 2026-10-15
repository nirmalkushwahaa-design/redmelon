/* =====================================================================
   PROJECT DETAIL · project.html?p=<slug>
   One template for every project. Reads RM.WORK (js/data.js): the card
   fields (client, line, img, tags) plus an optional `detail` block.
   Missing fields: dashed [NEED] placeholders in review mode; hidden in production.
   Runs after core.js and before motion.js, so headings still animate.
   ===================================================================== */
(function () {
  'use strict';
  var RM = window.RM, $ = RM.$, C = RM.CONFIG;
  if (!$('#pjStory')) return;
  if (!C.SHOW_PROJECT_PAGES) { location.replace('work.html'); return; }   /* detail pages hidden for now (RM.CONFIG) */

  var slug = null; try { slug = new URL(location.href).searchParams.get('p'); } catch (e) {}
  var list = RM.WORK || [], idx = -1;
  list.forEach(function (w, i) { if (w.slug === slug) idx = i; });
  if (idx < 0 && !slug && list.length) idx = 0;            /* project.html with no ?p= : show the first, for review */

  if (idx < 0) {                                           /* unknown project: friendly dead end */
    $('#heroH1').textContent = 'Project not found';
    $('#pjSummary').innerHTML = 'That project may have moved. <a class="link" href="work.html">See all work</a>.';
    ['#pjMeta', '#pjTags', '.pj-cover-sec', '#story', '#gallery', '#scope', '#quote', '#more', '.pj-next-sec'].forEach(function (s) { var el = $(s); if (el) el.hidden = true; });
    return;
  }

  var w = list[idx], d = w.detail || {}, review = C.REVIEW_MODE;
  var tagLabel = function (id) { var t = (RM.WORK_TAGS || []).filter(function (x) { return x.id === id; })[0]; return t ? t.label : id; };
  /* value, or a placeholder in review mode, or '' in production */
  function val(v, need) { return v ? RM.txt(v) : review ? '<span class="need">[NEED: ' + RM.esc(need) + ']</span>' : ''; }
  function hide(sel) { var el = $(sel); if (el) el.hidden = true; }

  /* ---------- head ---------- */
  var title = d.title || w.line;
  document.title = (d.title ? w.client + ': ' + d.title : w.client + ' case study') + ' | Redmelon';
  var md = document.querySelector('meta[name="description"]'); if (md && (d.summary || w.line)) md.setAttribute('content', d.summary || w.line);
  $('#pjCrumb').textContent = w.client;
  $('#heroH1').innerHTML = RM.txt(title);
  $('#pjSummary').innerHTML = val(d.summary, 'two or three sentence summary');
  $('#pjTags').innerHTML = (w.tags || []).map(function (t) { return '<li><a href="work.html?tag=' + encodeURIComponent(t) + '">' + RM.esc(tagLabel(t)) + '</a></li>'; }).join('');

  var meta = [
    ['Client', RM.txt(w.client)],
    ['Industry', val(d.industry, 'industry')],
    ['Services', d.services && d.services.length ? RM.esc(d.services.join(', ')) : val('', 'services')],
    ['Year', val(d.year, 'year')],
    ['Timeline', val(d.duration, 'duration')],
    ['Platform', val(d.platform, 'platform')]
  ].filter(function (m) { return m[1]; });
  $('#pjMeta').innerHTML = meta.map(function (m) { return '<div><dt>' + m[0] + '</dt><dd>' + m[1] + '</dd></div>'; }).join('') +
    (d.url ? '<div class="pj-live"><a class="btn btn-1 btn-s" href="' + RM.esc(d.url) + '" target="_blank" rel="noopener"><span class="sheen"></span>Visit live site ' + RM.icon('arrowUpRight', 'arrow') + '</a></div>' : '');

  /* ---------- cover ---------- */
  var cover = $('#pjCover'), src = d.cover || w.img;
  if (src) { cover.dataset.src = src; cover.dataset.alt = w.client + ': ' + title; }
  /* core.js already drew this slot as a placeholder; reset it so the real picture can render */
  cover.className = 'ph pj-cover'; cover.removeAttribute('aria-hidden'); cover.innerHTML = '';
  RM.renderSlots(cover.parentNode);

  /* ---------- story ---------- */
  var story = [['01', 'The challenge', d.challenge, 'what was wrong or missing before'],
               ['02', 'Our approach', d.approach, 'how we tackled it; where AI and the human expert came in'],
               ['03', 'The outcome', d.outcome, 'what changed for the client']]
    .filter(function (s) { return s[2] || review; });
  if (story.length) {
    $('#pjStory').innerHTML = story.map(function (s) {
      return '<article class="pj-block"><p class="pj-n">' + s[0] + '</p><h2 class="pj-bh" data-split>' + s[1] + '</h2><p class="pj-bt">' + val(s[2], s[3]) + '</p></article>';
    }).join('');
  } else hide('#story');

  /* ---------- gallery: wide pictures span the full row, the rest sit two-up ---------- */
  var gal = d.gallery && d.gallery.length ? d.gallery : review ? [{ wide: true, label: 'Key screen, full width', size: '2400 × 1350' }, { label: 'Detail', size: '1200 × 1200' }, { label: 'Detail', size: '1200 × 1200' }, { wide: true, label: 'Mobile screens or flow', size: '2400 × 1350' }] : [];
  if (gal.length) {
    $('#pjGallery').innerHTML = gal.map(function (g) {
      return '<figure class="ph pj-shot' + (g.wide ? ' is-wide' : '') + '" data-ph="photo"' + (g.src ? ' data-src="' + RM.esc(g.src) + '" data-alt="' + RM.esc(g.alt || '') + '"' : '') +
        ' data-ph-label="' + RM.esc(g.label || 'Project image') + '" data-ph-size="' + RM.esc(g.size || '') + ' · JPG/WebP"></figure>';
    }).join('');
    RM.renderSlots($('#pjGallery'));
  } else hide('#gallery');

  /* ---------- scope ---------- */
  var scope = d.scope && d.scope.length ? d.scope : (d.services && d.services.length ? d.services : null);
  if (scope) $('#pjScope').innerHTML = scope.map(function (s, i) { return '<li><span>' + (i < 9 ? '0' : '') + (i + 1) + '</span>' + RM.esc(s) + '</li>'; }).join('');
  else if (review) $('#pjScope').innerHTML = '<li><span>01</span>' + val('', 'the deliverables, one per line') + '</li>';
  else hide('#scope');

  /* ---------- quote ---------- */
  var q = d.quote;
  if (q || review) {
    $('#pjQuote').innerHTML = '<span class="say-mark" aria-hidden="true">“</span><blockquote>' + val(q && q.quote, 'a line from the client') + '</blockquote>' +
      '<figcaption><b>' + val(q && q.name, 'name') + '</b><span>' + val(q && q.role, 'role') + ', ' + RM.txt(w.client) + '</span></figcaption>';
  } else hide('#quote');

  /* ---------- more work: up to three other projects, starting after this one ---------- */
  var others = list.slice(idx + 1).concat(list.slice(0, idx)).slice(0, 3);
  if (others.length) {
    $('#pjMore').innerHTML = others.map(function (o) {
      var href = 'project.html?p=' + encodeURIComponent(o.slug);
      return '<article class="pj-card"><div class="pj-card-img">' +
        (o.img ? '<img src="' + RM.esc(o.img) + '" alt="" width="756" height="500" loading="lazy" decoding="async">' : '<span class="work-ph work-ph-1" aria-hidden="true"></span>') +
        '</div><p class="pj-card-tags">' + (o.tags || []).map(function (t) { return RM.esc(tagLabel(t)); }).join(' · ') + '</p>' +
        '<h3><a class="pj-card-link" href="' + href + '">' + RM.txt(o.client) + '</a></h3><p class="pj-card-line">' + RM.txt(o.line) + '</p></article>';
    }).join('');
  } else hide('#more');

  /* ---------- next project (loops back to the first) ---------- */
  if (list.length > 1) {
    var n = list[(idx + 1) % list.length];
    var nx = $('#pjNext');
    nx.href = 'project.html?p=' + encodeURIComponent(n.slug);
    nx.innerHTML = '<span class="eyebrow">Next project</span><span class="pj-next-name">' + RM.txt(n.client) + ' ' + RM.icon('arrowRight', 'arrow') + '</span>' +
      (n.img ? '<img class="pj-next-img" src="' + RM.esc(n.img) + '" alt="" loading="lazy" decoding="async">' : '');
  } else hide('.pj-next-sec');
})();
