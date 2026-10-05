/* =====================================================================
   BRIEF · the three-step guided brief, restored from v0.2 unchanged.
   Validates only the active step and never transmits preview data.
   The CTA handler at the bottom routes every "Get a call back" here.
   ===================================================================== */
(function(){
  const RM=window.RM;
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
    if(focus){steps[step].querySelector('h3').focus({preventScroll:true});RM.scrollTo(document.querySelector('.brief-shell'));}
    if(focus&&!RM.flags.rm)
      steps[step].animate([{opacity:.4,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:250});
    refresh();
  }
  back.addEventListener('click',()=>show(step-1));
  form.addEventListener('input',()=>{error.textContent='';});
  form.addEventListener('focusin',function once(){RM.track('form_start');form.removeEventListener('focusin',once);});
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(step===0&&!form.querySelector('input[name="service"]:checked')){
      error.textContent='Choose a service, or select “Let’s figure it out together.”';RM.track('form_error',{fields:['service']});return;
    }
    for(const input of steps[step].querySelectorAll('[required]')){
      if(!input.value.trim()||!input.checkValidity()){
        error.textContent='Please complete the required fields with valid details.';input.focus();input.reportValidity();RM.track('form_error',{fields:[input.id]});return;
      }
    }
    if(step<2){show(step+1);return;}
    RM.track('form_submit');
    const summary=document.getElementById('brief-summary');summary.replaceChildren();
    const rows=[['Focus',[...form.querySelectorAll('[name="service"]:checked')].map(el=>el.value).join(', ')],['Stage',document.getElementById('f-stage').value],['Project',document.getElementById('f-what').value],['Name',document.getElementById('f-name').value],['Email',document.getElementById('f-email').value],['Company',document.getElementById('f-co').value]];
    if(document.getElementById('f-more').value.trim())rows.push(['Context',document.getElementById('f-more').value]);
    rows.forEach(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;summary.append(dt,dd);});
    form.hidden=true;result.hidden=false;refresh();result.focus({preventScroll:true});RM.scrollTo(result);
    RM.track('form_success');
  });
  document.getElementById('resetForm').addEventListener('click',()=>{result.hidden=true;form.hidden=false;show(0);});
  show(0,false);

  /* work-email hint (as in v0.2) */
  const email=document.getElementById('f-email'),hint=document.getElementById('emailHint');
  const FREE=/@(gmail|yahoo|hotmail|outlook|icloud|proton(mail)?)\./i;
  email.addEventListener('blur',()=>{hint.textContent=FREE.test(email.value)?'A work address helps us route this — not required.':'';});

  /* every "Get a call back" scrolls to the brief and focuses the active step */
  RM.openForm=function(){
    RM.scrollTo('#contact',{done:function(){
      const h=result.hidden?steps[step].querySelector('h3'):result;
      h.focus({preventScroll:true});
    }});
  };
  document.addEventListener('click',e=>{
    const a=e.target.closest&&e.target.closest('a[href="#contact"]');
    if(!a)return;
    e.preventDefault();
    RM.track('cta_click',{location:a.dataset.cta||'link'});
    RM.openForm(a);
  });
})();
