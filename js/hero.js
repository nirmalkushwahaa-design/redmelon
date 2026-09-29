/* Interactive particle loop. Decorative; drag gestures never gate page content. */
(function(){
  'use strict';
  const canvas=document.getElementById('gl'), area=document.getElementById('heroArt');
  const ctx=canvas.getContext('2d'), pause=document.getElementById('artPause');
  if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,visible=true,localPause=false,globalPause=root.dataset.motion?root.dataset.motion==='paused':reduced.matches,raf=0,last=0,time=0;
  let angle=.38,target=.38,tilt=.95,targetTilt=.95,drag=null;
  let bright,faint,line;
  const points=[];
  for(let u=0;u<116;u++){
    for(let v=0;v<34;v++){
      const a=u/116*Math.PI*2,b=v/34*Math.PI*2;
      const ripple=1+.065*Math.sin(a*3);
      const radius=.65+.225*Math.cos(b)*ripple;
      points.push({x:radius*Math.cos(a),y:radius*Math.sin(a),z:.225*Math.sin(b)*ripple,lit:(u*13+v*7)%19===0});
    }
  }
  function colors(){
    const style=getComputedStyle(root);bright=style.getPropertyValue('--art-particle').trim();faint=style.getPropertyValue('--art-particle-faint').trim();line=style.getPropertyValue('--line').trim();draw();
  }
  onTheme=colors;
  function size(){
    width=area.clientWidth;height=area.clientHeight;
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function draw(){
    if(!width||!bright)return;
    ctx.clearRect(0,0,width,height);
    const scale=Math.min(width,height)*.44;
    const ca=Math.cos(angle),sa=Math.sin(angle),ct=Math.cos(tilt),st=Math.sin(tilt);
    const twist=-.48,cz=Math.cos(twist),sz=Math.sin(twist);
    const transformed=points.map(p=>{
      const x=p.x*ca+p.z*sa,z=-p.x*sa+p.z*ca;
      const y=p.y*ct-z*st,depth=p.y*st+z*ct;
      const px=x*cz-y*sz,py=x*sz+y*cz;
      const perspective=3/(3-depth*.45);
      return {x:width*.5+px*scale*perspective,y:height*.51+py*scale*perspective,z:depth,lit:p.lit,p:perspective};
    }).sort((a,b)=>a.z-b.z);
    for(const p of transformed){
      const alpha=.18+(p.z+1)/2*.78;
      ctx.globalAlpha=Math.min(1,alpha);ctx.fillStyle=p.lit?bright:(p.z>0?bright:faint);
      const r=(p.lit?1.15:.76)*p.p*(width<450?.87:1);
      ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    canvas.dataset.rendered='true';
  }
  function running(){return visible&&!document.hidden&&!localPause&&!globalPause;}
  function tick(now){
    raf=0;if(!running())return;
    if(now-last>30){
      const delta=Math.min(now-last,80);last=now;time+=delta;
      if(!drag)target+=delta*.000065;
      angle+=(target-angle)*.1;tilt+=(targetTilt-tilt)*.08;
      draw();
    }
    raf=requestAnimationFrame(tick);
  }
  function sync(){
    if(running()&&!raf){last=performance.now();raf=requestAnimationFrame(tick);}
    else if(!running()&&raf){cancelAnimationFrame(raf);raf=0;}
    pause.textContent=localPause||globalPause?'▷':'Ⅱ';pause.setAttribute('aria-label',globalPause?'Motion paused by page preference':localPause?'Resume particle animation':'Pause particle animation');
    pause.disabled=globalPause;
    pause.setAttribute('aria-pressed',String(localPause||globalPause));
  }
  pause.addEventListener('click',()=>{
    if(globalPause){localPause=false;return;}
    localPause=!localPause;sync();
  });
  area.addEventListener('pointerdown',e=>{
    if(e.target.closest('button')||globalPause||localPause)return;
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,start:target,tilt:targetTilt};
    area.classList.add('is-dragging');area.setPointerCapture(e.pointerId);
  });
  area.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    target=drag.start+(e.clientX-drag.x)*.012;targetTilt=drag.tilt+(e.clientY-drag.y)*.004;
  });
  function release(e){if(drag&&drag.id===e.pointerId){drag=null;area.classList.remove('is-dragging');}}
  area.addEventListener('pointerup',release);area.addEventListener('pointercancel',release);area.addEventListener('lostpointercapture',release);
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('redmelon:motion',e=>{globalPause=e.detail.paused;sync();draw();});
  if('IntersectionObserver' in window)new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();}).observe(area);
  if('ResizeObserver' in window)new ResizeObserver(size).observe(area);
  else addEventListener('resize',size);
  colors();size();sync();
})();
