/* Load decorative canvas modules only when their section approaches the viewport.
   The document, navigation and form remain usable while modules load or fail. */
(function(){
  'use strict';
  const regions=[...document.querySelectorAll('[data-lazy-script]')];
  function load(region){
    if(region.dataset.visualState)return;
    region.dataset.visualState='loading';
    const placeholder=region.querySelector('.visual-loader');
    if(placeholder)placeholder.hidden=false;
    const control=region.querySelector('#artPause');
    if(control)control.disabled=true;
    const script=document.createElement('script');
    let settled=false;
    function finish(ready){
      if(settled&&!ready)return;
      settled=true;clearTimeout(timeout);
      region.dataset.visualState=ready?'ready':'unavailable';
      if(placeholder)placeholder.hidden=true;
      if(control)control.hidden=!ready;
    }
    const timeout=setTimeout(()=>finish(false),10000);
    script.src=region.dataset.lazyScript;
    script.async=true;
    script.onload=()=>finish(region.querySelector('canvas')?.dataset.rendered==='true');
    script.onerror=()=>finish(false);
    document.body.appendChild(script);
  }
  function start(){
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      observer.unobserve(entry.target);load(entry.target);
    }),{rootMargin:'180px 0px',threshold:0});
    regions.forEach(region=>observer.observe(region));
  }else regions.forEach(load);
  }
  if(document.documentElement.dataset.experienceReady==='true')start();
  else document.addEventListener('redmelon:ready',start,{once:true});
})();
