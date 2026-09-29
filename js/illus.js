/* Redmelon v0.2 — Self-drawing line illustrations. */
/* ---------------- self-drawing line illustrations ----------------
   Measures each stroked shape, writes its length into --len, then arms the
   animation by adding .draw when the block first scrolls into view. No library
   involved: with the CDN blocked this still runs, and under reduced motion the
   CSS resolves every shape to its finished state. */
(function(){
  const blocks = document.querySelectorAll('.illus');
  if (!blocks.length) return;

  function arm(fig){
    const shapes = fig.querySelectorAll('.illus-line');
    let i = 0;
    shapes.forEach(el => {
      let len = 0;
      try { len = el.getTotalLength ? el.getTotalLength() : 0; } catch (e) { len = 0; }
      /* a shape we cannot measure simply appears — never hidden with no way back */
      if (!len) { el.classList.remove('illus-line'); el.classList.add('illus-line-static'); return; }
      el.style.setProperty('--len', len.toFixed(1));
      el.style.setProperty('--d', (i * 0.055).toFixed(3) + 's');
      i++;
    });
    /* labels and nodes fade in behind the lines that lead to them */
    fig.querySelectorAll('.illus-node, .illus-label').forEach((el, n) =>
      el.style.setProperty('--d', (0.34 + n * 0.045).toFixed(3) + 's'));
    fig.classList.add('is-drawing');
  }

  if (!('IntersectionObserver' in window)) { blocks.forEach(arm); return; }

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      arm(en.target);
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .15 });

  blocks.forEach(b => io.observe(b));
})();
