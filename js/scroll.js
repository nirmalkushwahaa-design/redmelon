/* ScrollSmoother starts only after the intro has finished. Native scrolling is
   retained when motion is paused, reduced motion is requested, or GSAP fails. */
(function(){
  'use strict';
  const root=document.documentElement;
  let media=null, smoother=null, ready=false;
  const effects=[...document.querySelectorAll('[data-speed],[data-lag],[data-speed-x]')];

  function stop(){
    if(media){media.revert();media=null;}
    if(smoother){smoother.kill();smoother=null;}
    root.classList.remove('has-smoother');
  }
  function start(){
    if(!ready||root.dataset.motion==='paused'||media)return;
    if(!window.gsap||!window.ScrollTrigger||!window.ScrollSmoother)return;
    try{
      gsap.registerPlugin(ScrollTrigger,ScrollSmoother);
      media=gsap.matchMedia();
      media.add({wide:'(min-width:1200px)',compact:'(max-width:1199px)'},context=>{
        const wide=context.conditions.wide;
        root.classList.add('has-smoother');
        smoother=ScrollSmoother.create({
          wrapper:'#smooth-wrapper',content:'#smooth-content',
          smooth:1.35,smoothTouch:1.35,effects:wide,
          onUpdate:self=>{
            document.querySelector('#scrollProgress').style.transform='scaleX('+self.progress+')';
          }
        });
        if(wide){
          document.querySelectorAll('[data-speed-x]').forEach(el=>{
            const distance=Number(el.dataset.speedX)||0;
            gsap.fromTo(el,{x:-distance},{x:distance,ease:'none',scrollTrigger:{
              trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:true,
              invalidateOnRefresh:true
            }});
          });
          // CSS sticky cannot follow a transformed smooth-content container.
          const cards=[...document.querySelectorAll('.move-card')];
          cards.slice(0,-1).forEach((card,i)=>ScrollTrigger.create({
            trigger:card,start:'top '+(110+i*20),endTrigger:'#modePanel',
            end:()=> 'bottom '+(card.offsetHeight+110+i*20),
            pin:true,pinSpacing:false,invalidateOnRefresh:true
          }));
        }
        ScrollTrigger.refresh();
        return ()=>{
          if(smoother){smoother.kill();smoother=null;}
          // Clear both vertical lag and horizontal drift at the breakpoint.
          gsap.set(effects,{clearProps:'transform,translate'});
          root.classList.remove('has-smoother');
        };
      });
    }catch(error){stop();console.warn('Smooth scrolling unavailable; using native scrolling.',error);}
  }
  document.addEventListener('redmelon:ready',()=>{
    ready=true;start();
    const target=document.getElementById(location.hash.slice(1));
    if(target)goTo(target,false);
  },{once:true});
  document.addEventListener('redmelon:motion',event=>{if(event.detail.paused)stop();else start();});

  // Keep anchor links, history, and keyboard focus aligned with the visual scroll.
  function goTo(target,smooth){
    if(!smoother)return false;
    smoother.scrollTo(target,smooth,'top 100px');
    return true;
  }
  window.redmelonScrollTo=(target,smooth=true)=>{
    if(!goTo(target,smooth))target.scrollIntoView({
      behavior:smooth&&root.dataset.motion!=='paused'?'smooth':'auto',block:'start'
    });
  };
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link||!smoother||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const target=document.getElementById(link.hash.slice(1));
    if(!target)return;
    event.preventDefault();
    history.pushState(null,'',link.hash);
    goTo(target,true);
    if(link.classList.contains('skip')){
      target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
    }
  });
  addEventListener('hashchange',()=>{
    const target=document.getElementById(location.hash.slice(1));
    if(target)goTo(target,false);
  });
  document.fonts?.ready.then(()=>{if(smoother)ScrollTrigger.refresh();});
})();
