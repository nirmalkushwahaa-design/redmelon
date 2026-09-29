/* Redmelon v0.2 — Contact: ordered-dither brand field on canvas. */
/* ---------------- contact: ordered-dither brand field ----------------
   A smooth scalar field quantised to the four --art-* tokens through a 4x4
   Bayer matrix, drawn at 1/4 resolution and scaled up with image-rendering:
   pixelated. That is what gives the halftone grain — no image asset, nothing
   fetched, and the ramp lives in tokens.css so it changes globally. */
(function(){
  const cv  = document.getElementById('dither');
  const ctx = cv && cv.getContext ? cv.getContext('2d', { alpha:false }) : null;
  if (!ctx) { if (cv) cv.style.display = 'none'; return; }

  const BAYER = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
  const PX = 4;                       /* on-screen size of one dither cell */
  let W = 0, H = 0, img = null, pal = [], t = 0, raf = 0, vis = true, paused = root.dataset.motion?root.dataset.motion==='paused':RM;

  function rgb(v){
    v = v.trim();
    const n = parseInt(v.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  function palette(){
    const s = getComputedStyle(document.documentElement);
    pal = [0,1,2,3].map(i => rgb(s.getPropertyValue('--art-' + i) || '#000000'));
  }
  function size(){
    const r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    W = Math.max(1, Math.round(r.width  / PX));
    H = Math.max(1, Math.round(r.height / PX));
    cv.width = W; cv.height = H;
    img = ctx.createImageData(W, H);
    return true;
  }

  /* layered sines: a vertical ramp with slow drift, so the bands read as
     terrain rather than a plain gradient */
  function field(u, v, tm){
    let f = .80 - v * .66;
    f += .24 * Math.sin(u * 2.6 + tm * .45);
    f += .18 * Math.sin(v * 4.3 - tm * .31 + u * 2.4);
    f += .12 * Math.sin((u + v) * 6.2 + tm * .22);
    return f;
  }

  function draw(){
    if (!img) return;
    const d = img.data, N = pal.length - 1;
    for (let y = 0; y < H; y++){
      const v = y / H, row = BAYER[y & 3];
      for (let x = 0; x < W; x++){
        let f = field(x / W, v, t);
        f = f < 0 ? 0 : f > 1 ? 1 : f;
        const s = f * N, b = Math.floor(s);
        const c = pal[Math.min(N, b + ((s - b) > (row[x & 3] + .5) / 16 ? 1 : 0))];
        const i = (y * W + x) * 4;
        d[i] = c[0]; d[i+1] = c[1]; d[i+2] = c[2]; d[i+3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    cv.dataset.rendered='true';
  }

  function tick(){
    raf = 0;
    if (!vis || paused || document.hidden) return;
    t += .006;
    draw();
    raf = requestAnimationFrame(tick);
  }
  function start(){ if (!raf && !paused && vis && !document.hidden) raf = requestAnimationFrame(tick); }
  function stop(){ if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  document.addEventListener('redmelon:motion', e => { paused=e.detail.paused; paused ? stop() : start(); });
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });

  palette();
  if (!size()) { requestAnimationFrame(() => { if (size()) draw(); }); } else { draw(); }

  if (window.IntersectionObserver) {
    new IntersectionObserver(es => {
      vis = es[0].isIntersecting;
      vis ? start() : stop();
    }, { threshold:.01 }).observe(cv);
  } else { start(); }

  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { if (size()) draw(); }, 140);
  });
})();
