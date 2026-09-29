/* Progressive native motion; content never depends on this file to be visible. */
(function(){
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reduced.matches;
  const animations=new Set();
  const intro=document.getElementById('intro');
  let ready=false, introTimer;
  function finishIntro(){
    if(ready)return;
    ready=true;clearTimeout(introTimer);intro.hidden=true;
    root.dataset.experienceReady='true';
    document.dispatchEvent(new Event('redmelon:ready'));
    startReveals();
  }
  intro.addEventListener('animationend',e=>{if(e.animationName==='preloader-out')finishIntro();});
  document.addEventListener('keydown',finishIntro,{once:true});

  function animate(el,frames,options){
    if(paused||!el.animate)return;
    try{const a=el.animate(frames,options);animations.add(a);a.finished.then(()=>animations.delete(a)).catch(()=>animations.delete(a));}catch(e){}
  }
  function startReveals(){
  if('IntersectionObserver' in window){
    const reveals=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      reveals.unobserve(entry.target);
      animate(entry.target,[{opacity:.25,transform:'translateY(25px)'},{opacity:1,transform:'none'}],{duration:750,easing:'cubic-bezier(.16,1,.3,1)'});
    }),{threshold:.09});
    document.querySelectorAll('.rv,.cap,.move-card-in').forEach(el=>reveals.observe(el));
  }
  animate(document.querySelector('.hero-copy'),[{opacity:.5,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{duration:950,delay:0,easing:'cubic-bezier(.16,1,.3,1)'});

  }

  let scrollPending=false;
  const progress=document.getElementById('scrollProgress');
  function updateScroll(){
    const range=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform='scaleX('+(range>0?Math.min(1,Math.max(0,scrollY/range)):0)+')';
    scrollPending=false;
  }
  addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScroll);}},{passive:true});
  addEventListener('resize',updateScroll);updateScroll();

  const menu=document.getElementById('navMenu'), mobile=document.getElementById('mobileNav');
  function toggleMenu(open){
    mobile.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    if(open)animate(mobile,[{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'none'}],{duration:250});
  }
  menu.addEventListener('click',()=>toggleMenu(mobile.hidden));
  mobile.addEventListener('click',e=>{if(e.target.closest('a'))toggleMenu(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobile.hidden){toggleMenu(false);menu.focus();}});
  document.addEventListener('click',e=>{if(!mobile.hidden&&!e.target.closest('#nav'))toggleMenu(false);});
  matchMedia('(min-width:881px)').addEventListener('change',e=>{if(e.matches)toggleMenu(false);});
  const links=[...document.querySelectorAll('.nav-links>a[href^="#"]')];
  if('IntersectionObserver' in window){
    const sections=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting)links.forEach(a=>a.classList.toggle('is-active',a.hash==='#'+e.target.id));
    }),{rootMargin:'-20% 0px -55% 0px'});
    document.querySelectorAll('main section').forEach(el=>sections.observe(el));
  }

  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  document.querySelectorAll('.magnet').forEach(el=>{
    el.addEventListener('pointermove',e=>{
      if(paused||!fine.matches)return;
      const r=el.getBoundingClientRect();
      el.style.translate=((e.clientX-r.left-r.width/2)*.10)+'px '+((e.clientY-r.top-r.height/2)*.16)+'px';
    });
    el.addEventListener('pointerleave',()=>{el.style.translate='';});
    el.addEventListener('blur',()=>{el.style.translate='';});
  });
  document.querySelectorAll('.outcome,.cap').forEach(el=>el.addEventListener('pointermove',e=>{
    if(paused||!fine.matches)return;
    const r=el.getBoundingClientRect();el.style.setProperty('--pointer-x',(e.clientX-r.left)+'px');el.style.setProperty('--pointer-y',(e.clientY-r.top)+'px');
  }));

  const control=document.createElement('button');control.className='motion-control';control.type='button';
  document.querySelector('.foot-base').appendChild(control);
  function setMotion(value){
    paused=value;root.dataset.motion=paused?'paused':'running';
    control.textContent=paused?EXPERIENCE.motionResume:EXPERIENCE.motionPause;
    control.setAttribute('aria-pressed',String(paused));
    if(paused){finishIntro();animations.forEach(a=>a.cancel());document.querySelectorAll('.magnet').forEach(el=>el.style.translate='');}
    document.dispatchEvent(new CustomEvent('redmelon:motion',{detail:{paused}}));
  }
  control.addEventListener('click',()=>setMotion(!paused));
  reduced.addEventListener('change',e=>setMotion(e.matches));
  setMotion(paused);
  if(!ready){
    intro.hidden=false;
    // The CSS animation holds for 1.5 seconds, then fades over 300ms.
    introTimer=setTimeout(finishIntro,1900);
  }
})();
