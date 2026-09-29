/* Guided brief: validate only the active step; never transmit preview data. */
(function(){
  const form=document.getElementById('brief'),steps=[...form.querySelectorAll('.brief-step')];
  const back=document.getElementById('brief-back'),next=document.getElementById('brief-next');
  const error=document.getElementById('brief-error'),result=document.getElementById('sent');
  let step=0;
  function refresh(){if(window.ScrollTrigger)ScrollTrigger.refresh();}
  function show(index,focus=true){
    step=index;error.textContent='';
    steps.forEach((el,i)=>el.hidden=i!==step);
    document.querySelectorAll('.brief-progress li').forEach((el,i)=>{
      if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');
      el.classList.toggle('is-complete',i<step);
    });
    back.hidden=step===0;next.textContent=step===2?'Review brief ↗':'Continue ↗';
    if(focus){steps[step].querySelector('h3').focus({preventScroll:true});window.redmelonScrollTo(document.querySelector('.brief-shell'),false);}
    if(focus&&document.documentElement.dataset.motion!=='paused'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
      steps[step].animate([{opacity:.4,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:250});
    refresh();
  }
  back.addEventListener('click',()=>show(step-1));
  form.addEventListener('input',()=>{error.textContent='';});
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(step===0&&!form.querySelector('input[name="service"]:checked')){
      error.textContent='Choose a service, or select “Let’s figure it out together.”';return;
    }
    for(const input of steps[step].querySelectorAll('[required]')){
      if(!input.value.trim()||!input.checkValidity()){
        error.textContent='Please complete the required fields with valid details.';input.focus();input.reportValidity();return;
      }
    }
    if(step<2){show(step+1);return;}
    const summary=document.getElementById('brief-summary');summary.replaceChildren();
    const rows=[['Focus',[...form.querySelectorAll('[name="service"]:checked')].map(el=>el.value).join(', ')],['Stage',document.getElementById('f-stage').value],['Project',document.getElementById('f-what').value],['Name',document.getElementById('f-name').value],['Email',document.getElementById('f-email').value],['Company',document.getElementById('f-co').value]];
    if(document.getElementById('f-more').value.trim())rows.push(['Context',document.getElementById('f-more').value]);
    rows.forEach(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;summary.append(dt,dd);});
    form.hidden=true;result.hidden=false;refresh();result.focus({preventScroll:true});window.redmelonScrollTo(result,false);
  });
  document.getElementById('resetForm').addEventListener('click',()=>{result.hidden=true;form.hidden=false;show(0);});
  show(0,false);
})();
