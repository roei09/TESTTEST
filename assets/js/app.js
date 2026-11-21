/* OdedSVR hub — behaviour. Content lives in data.js (loaded first). */

document.documentElement.classList.add('js');addEventListener('error',()=>document.documentElement.classList.add('js-err'));
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RMQ=matchMedia('(prefers-reduced-motion: reduce)');
let RM=RMQ.matches; /* true for reduced-motion users AND while "עצירת אנימציות" is on (kept in sync by the a11y panel) */
const FINE=matchMedia('(hover: hover) and (pointer: fine)').matches;
/* performance tier: full / balanced / lite (html[data-perf]; .lite kept for older rules).
   ?perf=full|balanced|lite forces a tier for testing; the auto-downgrade below may lower it for this tab. */
const PERF=(()=>{let q=null,st=null;try{q=new URLSearchParams(location.search).get('perf');st=sessionStorage.getItem('osvr-perf')}catch(_){}
  if(/^(full|balanced|lite)$/.test(q||''))return q;
  const c=navigator.hardwareConcurrency||8,m=navigator.deviceMemory||8,sd=!!(navigator.connection&&navigator.connection.saveData);
  let t=(RM||sd||c<=2||m<=2)?'lite':(c<=4||m<=4||matchMedia('(pointer: coarse)').matches)?'balanced':'full';
  const rank={full:0,balanced:1,lite:2};if(/^(balanced|lite)$/.test(st||'')&&rank[st]>rank[t])t=st;return t})();
document.documentElement.dataset.perf=PERF;
const LITE=PERF==='lite';
if(LITE)document.documentElement.classList.add('lite');
const fmt=n=>Number(n).toLocaleString('he-IL');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=s=>s.replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase()||s.slice(0,2);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
$('#yr').textContent=new Date().getFullYear();

const ICONS={
  arrow:'<svg class="link__arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 17 7 7M7 17V7h10"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>'
};
/* brand app-icon tiles: tile fill, side colour, glyph */
const APP={
  kick:{tile:'linear-gradient(160deg,#7dff4d,#3fd60f)',side:'#2a9b09',sh:'rgba(83,252,24,.55)',g:'<svg viewBox="0 0 24 24"><path fill="#061100" d="M4.5 3h5.2v5.2h1.75V6.45h1.75V4.7h1.75V3h5.1v5.25h-1.75V10h-1.75v4h1.75v1.75h1.75V21h-5.1v-1.7h-1.75v-1.75h-1.75V15.8H9.7V21H4.5z"/></svg>'},
  youtube:{tile:'linear-gradient(160deg,#ff3b4f,#d9001b)',side:'#8a0012',sh:'rgba(255,0,51,.5)',g:'<svg viewBox="0 0 24 24"><path fill="#fff" d="M23.5 6.19a3 3 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3 3 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3 3 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3 3 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>'},
  clips:{tile:'linear-gradient(160deg,#ff8a5c,#e2482a)',side:'#93290f',sh:'rgba(255,122,89,.5)',g:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="14" rx="3"/><path d="m3 10 18-0M7 6l2 4M12 6l2 4M17 6l2 4"/><path d="M10.5 13v4l3.5-2z" fill="#fff" stroke="none"/></svg>'},
  tiktok:{tile:'linear-gradient(160deg,#2a2a2e,#050506)',side:'#000',sh:'rgba(37,244,238,.35)',g:(()=>{const p='M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z';return `<svg viewBox="-1 -1 26 26"><path fill="#25f4ee" transform="translate(-.9 -.7)" d="${p}"/><path fill="#fe2c55" transform="translate(.9 .7)" d="${p}"/><path fill="#fff" d="${p}"/></svg>`})()},
  instagram:{tile:'radial-gradient(circle at 30% 107%,#fdf497 0%,#fdf497 5%,#fd5949 45%,#d6249f 60%,#285aeb 90%)',side:'#7a1460',sh:'rgba(214,36,159,.5)',g:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.2" fill="#fff" stroke="none"/></svg>'},
  discord:{tile:'linear-gradient(160deg,#7b86ff,#4d5bf0)',side:'#2c35a3',sh:'rgba(88,101,242,.55)',g:'<svg viewBox="0 0 24 24"><path fill="#fff" d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.61 1.25a18.27 18.27 0 0 0-5.49 0 12.64 12.64 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .09-.03c.46-.63.87-1.3 1.22-1.99a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.87-.89.08.08 0 0 1-.01-.13c.13-.09.25-.19.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08.01c.12.1.25.2.37.29a.08.08 0 0 1-.01.13c-.6.35-1.22.64-1.87.89a.08.08 0 0 0-.04.11c.36.7.77 1.36 1.22 1.99a.08.08 0 0 0 .09.03 19.84 19.84 0 0 0 6-3.03.08.08 0 0 0 .03-.06c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.15-1.09-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.42-2.16 2.42z"/></svg>'},
  reddit:{tile:'linear-gradient(160deg,#ff6a2a,#ff3d00)',side:'#9a2400',sh:'rgba(255,69,0,.5)',g:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="14.5" rx="8.2" ry="5.8" fill="#fff"/><circle cx="4.3" cy="11.6" r="2" fill="#fff"/><circle cx="19.7" cy="11.6" r="2" fill="#fff"/><path d="M12 8.8 13.2 3.6l3.6.8" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><circle cx="17.9" cy="4.6" r="1.6" fill="#fff"/><circle cx="8.9" cy="13.6" r="1.35" fill="#ff4500"/><circle cx="15.1" cy="13.6" r="1.35" fill="#ff4500"/><path d="M8.9 16.7c1.8 1.3 4.4 1.3 6.2 0" fill="none" stroke="#ff4500" stroke-width="1.1" stroke-linecap="round"/></svg>'}
};

/* ---------- smooth scroll (Lenis) ---------- */
/* load a third-party library only when needed, pinned with Subresource Integrity */
const LIBS={lenis:['https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js','sha384-B2WBjDzEjJpYvhmi2UyEn7rektqkf5suS6sNoyyrf0EBAwBHdkiXxIlU0V5Ru2ed']};
const _lib={};
function loadLib(k){return _lib[k]||(_lib[k]=new Promise((ok,no)=>{const s=document.createElement('script');s.src=LIBS[k][0];s.integrity=LIBS[k][1];s.crossOrigin='anonymous';s.referrerPolicy='no-referrer';s.async=true;s.onload=ok;s.onerror=no;document.head.appendChild(s)}))}
const idle=cb=>('requestIdleCallback' in window)?requestIdleCallback(cb,{timeout:2500}):setTimeout(cb,1200);
let lenis=null;
/* buttery inertial scrolling (Lenis). Its loop runs only while the page is actually moving */
if(!RM&&!LITE&&FINE){loadLib('lenis').then(()=>{
  lenis=new Lenis({lerp:.1,smoothWheel:true,wheelMultiplier:1,touchMultiplier:1.2,syncTouch:false});
  document.documentElement.classList.add('lenis');
  let r=0,still=0;const loop=t=>{lenis.raf(t);still=lenis.isScrolling?0:still+1;r=still>30?0:requestAnimationFrame(loop)};
  const wake=()=>{still=0;if(!r)r=requestAnimationFrame(loop)};
  ['wheel','touchstart','keydown','pointerdown'].forEach(e=>addEventListener(e,wake,{passive:true}));
  const st=lenis.scrollTo.bind(lenis);lenis.scrollTo=(...a)=>{wake();return st(...a)};wake();
}).catch(()=>{})}
function goTo(hash){ const el=$(hash); if(!el) return;
  try{history.replaceState(null,'',hash==='#top'?location.pathname+location.search:hash)}catch(_){}
  if(el.classList.contains('spw')&&window.__tourGo){window.__tourGo(+el.dataset.i);return}
  if(lenis) lenis.scrollTo(el,{offset:el.id==='collabs'?0:-84}); else el.scrollIntoView({behavior:RM?'auto':'smooth'});
  /* move keyboard focus with the jump, so Tab continues from the new section */
  if(el.tagName==='SECTION'||el.tagName==='MAIN'){if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','-1');el.focus({preventScroll:true})} }
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const h=a.getAttribute('href');if(h.length>1&&$(h)){e.preventDefault();goTo(h)}}));

/* ---------- toast / copy ---------- */
let toastT;
function toast(m){const t=$('#toast');t.textContent='';t.classList.add('is-on');setTimeout(()=>{t.textContent=m},40);clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('is-on'),2600)}
function sparks(el){ if(RM) return; for(let i=0;i<10;i++){const s=document.createElement('span');s.className='spark';el.appendChild(s);const a=Math.random()*Math.PI*2,d=24+Math.random()*26;s.style.left='50%';s.style.top='50%';s.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px)) scale(0)`,opacity:0}],{duration:700,easing:'cubic-bezier(.22,1,.36,1)'}).onfinish=()=>s.remove()} }
async function copyText(txt,btn,label){
  let ok=false;
  try{await navigator.clipboard.writeText(txt);ok=true}catch(e){try{const ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();ok=document.execCommand('copy');ta.remove()}catch(_){}}
  if(ok){toast(label||'הועתק!');if(btn){sparks(btn);const o=btn.textContent;btn.classList.add('is-done');btn.textContent='הועתק ✓';setTimeout(()=>{btn.textContent=o;btn.classList.remove('is-done')},1800)}}
  else toast('לא הצלחנו להעתיק: '+txt);
}

/* ---------- nav ---------- */
const nav=$('#nav'),burger=$('#burger');
burger.addEventListener('click',()=>{const o=nav.classList.toggle('is-open');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'סגירת תפריט':'פתיחת תפריט')});
$$('#navLinks a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('is-open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','פתיחת תפריט')}));
const navClose=()=>{nav.classList.remove('is-open');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','פתיחת תפריט')};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){navClose();burger.focus()}});

/* =========================================================
   LIVE DATA — everything below updates by itself.
   Sources (same ones odedsvr.com already uses):
   • Kick channel API (direct) → live / title / category
   • Worker  links.odedlink26.workers.dev → kickChannel, BotRix watch-time, chat top, /youtube latest videos
   • /data.json (same origin) → gifters week / month / all-time
   All responses are validated; nothing from the network is ever inserted as HTML.
   ========================================================= */
const WORKER_URL='https://links.odedlink26.workers.dev';
const SAME=u=>u.startsWith('/');
async function getJSON(u,ms=7000){const c=new AbortController();const tm=setTimeout(()=>c.abort(),ms);
  try{const r=await fetch(u,{signal:c.signal,cache:'no-store',credentials:SAME(u)?'same-origin':'omit',referrerPolicy:'no-referrer',headers:{accept:'application/json'}});
    if(!r.ok)throw new Error(r.status);return await r.json()}finally{clearTimeout(tm)}}
const str=(v,max=140)=>typeof v==='string'?v.replace(/[\u0000-\u001f‪-‮]/g,'').trim().slice(0,max):'';
const HIDDEN=new Set((DATA.hiddenNames||[]).map(n=>String(n).toLowerCase()));
const okName=n=>typeof n==='string'&&/^[\w.\-]{1,32}$/.test(n)&&!HIDDEN.has(n.toLowerCase());
const dh=min=>{min=Math.max(0,Math.floor(+min||0));const d=Math.floor(min/1440),h=Math.floor(min%1440/60);return `${d}d ${h}h`};
let LIVE=null,liveOK=0,boardOK=0;
function setStatus(live,known=true){
  document.body.classList.toggle('is-live-mode',live);
  $$('.status').forEach(el=>{el.classList.toggle('is-live',live);el.classList.toggle('is-unknown',!known);const t=$('.status__txt',el);if(t)t.textContent=!known?'KICK':live?'ONLINE':'OFFLINE'});
  const hs=$('#heroStatus'); if(hs) hs.textContent= !known ? 'Kick' : live ? 'בשידור עכשיו' : 'לא בשידור';
  $$('.js-watch').forEach(el=>el.textContent=live?'צפו עכשיו בלייב':'לשידור ב-Kick');
  $('#liveInfo').hidden=!live;
  const hl=$('#heroLive'),he=$('#heroEyebrow');if(hl){hl.hidden=true;if(he)he.hidden=live}
  $$('.nav-watch__t').forEach(el=>el.textContent=live?'LIVE עכשיו':'צפו ב-Kick');
  const ds=$('#dockSt');if(ds)ds.textContent=!known?', צפייה בערוץ':live?', בשידור עכשיו':', לא בשידור';
  setTab(live);
}
(function(){const c=document.getElementById('livecard');if(!c)return;const go=()=>window.open('https://kick.com/odedsvr','_blank','noopener');
  c.addEventListener('click',e=>{if(e.target.closest('button,a'))return;go()});
})();
function applyLive(ls){
  const was=!!LIVE; LIVE=ls&&typeof ls==='object'?ls:null;
  setStatus(!!LIVE);
  if(LIVE){
    $('#liveTitle').textContent=str(LIVE.session_title)||'OdedSVR בשידור חי';
    const cat=(Array.isArray(LIVE.categories)&&LIVE.categories[0]&&LIVE.categories[0].name)||(LIVE.category&&LIVE.category.name)||'Kick';
    $('#liveCat').textContent=str(cat,40);
    const hc=$('#heroLiveCat');if(hc)hc.textContent=str(cat,40);
    const th=LIVE.thumbnail&&(LIVE.thumbnail.url||LIVE.thumbnail.src),im=$('#liveThumb');
    if(im){im.onerror=()=>{im.hidden=true};im.onload=()=>{im.hidden=false};if(typeof th==='string'&&/^https:\/\/[\w.-]*kick\.com\//.test(th)){if(im.getAttribute('src')!==th)im.src=th}else im.hidden=true}
    if(!was) notifyLive();
  }
  tickUp();
}
function tickUp(){const el=$('#liveUp');if(!LIVE){el.textContent='';return}
  const t=Date.parse(String(LIVE.start_time||LIVE.created_at||'').replace(' ','T')+(/[zZ+]/.test(String(LIVE.start_time||''))?'':'Z'));
  if(!Number.isFinite(t)){el.textContent='LIVE';return}
  const m=Math.max(0,Math.floor((Date.now()-t)/6e4));el.textContent=`${Math.floor(m/60)}:${String(m%60).padStart(2,'0')} בשידור`;const hu=$('#heroLiveUp');if(hu)hu.textContent=el.textContent}
setInterval(()=>{if(LIVE&&!document.hidden)tickUp()},30000);
/* tab title + favicon reflect live state */
const BASE_TITLE=document.title;
function setTab(live){document.title=(live?'🔴 LIVE · ':'')+BASE_TITLE;
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='#3fd2ff'/><stop offset='1' stop-color='#a06bff'/></linearGradient></defs><circle cx='32' cy='32' r='30' fill='url(#g)'/><text x='32' y='43' font-family='Arial' font-weight='900' font-size='30' text-anchor='middle' fill='#05080f'>O</text>${live?"<circle cx='52' cy='12' r='11' fill='#ff2d55' stroke='#05080f' stroke-width='3'/>":''}</svg>`;
  let l=$('link[rel="icon"]');if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l)}l.href='data:image/svg+xml,'+encodeURIComponent(svg)}
/* worker: watch-time, chat top, and live as a fallback */
function applyWorker(w){
  if(!w||typeof w!=='object')return;
  if(Array.isArray(w.botrix)){const rows=w.botrix.filter(x=>x&&okName(x.name)&&Number.isFinite(+x.watchtime)).sort((a,b)=>b.watchtime-a.watchtime).slice(0,10).map(x=>[x.name,dh(x.watchtime)]);if(rows.length>=3)DATA.board.watch=rows}
  const k=w.kicklogz;if(k&&Array.isArray(k.labels)&&Array.isArray(k.data)){const rows=k.labels.map((n,i)=>[n,Math.floor(+k.data[i])]).filter(r=>okName(r[0])&&Number.isFinite(r[1])&&!/^botrix$/i.test(r[0])).slice(0,10);if(rows.length>=3)DATA.board.chat=rows}
}
/* network policy
   • live status: Kick v2 first; the worker and Kick v1 are asked only if Kick fails (before: all three, every 30s)
   • one request at a time per feed; every 60s while the tab is visible; on errors the wait doubles up to 5 min
   • if nothing succeeded for 3 min, the status goes back to neutral "KICK" instead of showing an old LIVE/OFFLINE
   • watch-time / chat boards come from the worker every 5 min */
const LIVE_EVERY=60e3,LIVE_MAX=5*60e3,LIVE_STALE=3*60e3,WORKER_EVERY=5*60e3,BOARD_STALE=10*60e3;
const isChannel=j=>j&&typeof j==='object'&&'livestream' in j;
let liveBusy=false,liveFails=0,liveTimer=0,liveTry=0,workerAt=0,workerBusy=null;
function refreshWorker(force){
  if(workerBusy)return workerBusy;
  if(!force&&Date.now()-workerAt<WORKER_EVERY)return Promise.resolve(null);
  return workerBusy=getJSON(WORKER_URL).then(w=>{workerAt=Date.now();applyWorker(w);rerender();boardOK=Date.now();fresh();return w}).catch(()=>null).finally(()=>{workerBusy=null})}
async function fetchChannel(){
  try{const j=await getJSON(`https://kick.com/api/v2/channels/${DATA.channel}`);if(isChannel(j))return j}catch(e){}
  const w=await refreshWorker(true);if(w&&isChannel(w.kickChannel))return w.kickChannel;
  try{const j=await getJSON(`https://kick.com/api/v1/channels/${DATA.channel}`);if(isChannel(j))return j}catch(e){}
  return null}
function scheduleLive(){clearTimeout(liveTimer);const d=liveFails?Math.min(LIVE_MAX,LIVE_EVERY*2**Math.min(liveFails,3)):LIVE_EVERY;
  liveTimer=setTimeout(()=>{if(document.hidden)scheduleLive();else refreshLive()},d)}
async function refreshLive(){
  if(location.hash==='#live-preview'){applyLive({session_title:'בדיקת תצוגת לייב — כך זה ייראה',categories:[{name:'Just Chatting'}],start_time:new Date(Date.now()-5040e3).toISOString()});return}
  if(liveBusy)return;liveBusy=true;liveTry=Date.now();
  try{const ch=await fetchChannel();
    if(ch){applyLive(ch.livestream);liveOK=Date.now();liveFails=0}
    else{liveFails++;if(!liveOK||Date.now()-liveOK>LIVE_STALE){LIVE=null;setStatus(false,false);tickUp()}} // unknown → neutral, never a stale LIVE/OFFLINE
  }finally{liveBusy=false;scheduleLive()}}
/* leaderboard freshness: only the leaderboard's own fetches count; old data says so */
const hhmm=t=>new Date(t).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'});
function fresh(){const f=$('#fresh'),t=$('#freshTxt');if(!f||!t)return;
  if(!boardOK){t.textContent='מוצגים נתונים שמורים';f.classList.remove('is-live');return}
  const age=Date.now()-boardOK,m=Math.floor(age/6e4);
  if(age>BOARD_STALE){t.textContent=`לא עודכן מאז ${hhmm(boardOK)}`;f.classList.remove('is-live');return}
  t.textContent=m<1?'עודכן עכשיו':`עודכן לפני ${m} דק׳`;f.classList.add('is-live')}
setInterval(fresh,30000);
/* notify (only while this tab is open; asked only on click) */
let wantNotify=false;
$('#notifyBtn').addEventListener('click',async()=>{
  if(!('Notification' in window)){toast('הדפדפן הזה לא תומך בהתראות');return}
  try{const p=Notification.permission==='granted'?'granted':await Notification.requestPermission();
    if(p!=='granted'){toast('לא אושרו התראות בדפדפן');return}
    wantNotify=!wantNotify;$('#notifyBtn').setAttribute('aria-pressed',wantNotify);
    $('#notifyBtn span').textContent=wantNotify?'נודיע לכם כשעודד עולה (כל עוד הדף פתוח)':'תודיעו לי כשעודד עולה';
    toast(wantNotify?'מעולה! נקפיץ התראה כשהלייב מתחיל':'ההתראה בוטלה');
  }catch(e){toast('לא ניתן להפעיל התראות כאן')}});
function notifyLive(){if(!wantNotify||!('Notification' in window)||Notification.permission!=='granted')return;
  try{const n=new Notification('OdedSVR עלה לשידור! 🔴',{body:$('#liveTitle').textContent,tag:'osvr-live'});n.onclick=()=>{window.open('https://kick.com/odedsvr','_blank','noopener');n.close()}}catch(e){}}

setStatus(false,false); refreshLive(); refreshWorker(true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-liveTry>20e3)refreshLive()});
addEventListener('hashchange',()=>{if(location.hash==='#live-preview')refreshLive()});



/* ---------- links with 3D icons ---------- */
$('#linksGrid').innerHTML=DATA.links.map(l=>{const a=APP[l.key];
  return `<a class="link reveal ${l.main?'link--main':''}" style="--lc:${l.color}" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer"><span class="led" aria-hidden="true" style="animation-delay:${-(DATA.links.indexOf(l)*.73).toFixed(2)}s"></span>
    <span class="app" aria-hidden="true" style="--tile:${a.tile};--side:${a.side};--shadow:${a.sh}"><span class="app__side"></span><span class="app__tile"></span><span class="app__glyph">${a.g}</span></span>
    <span><b>${esc(l.name)}</b><small>${esc(l.main?l.sub:l.handle)}</small></span>${ICONS.arrow}</a>`;
}).join('');
/* app tiles tilt toward the pointer, like a real object */
if(FINE&&!RM) $$('.link').forEach(el=>{const app=$('.app',el);let r=null;
  el.addEventListener('pointerenter',()=>{r=el.getBoundingClientRect()});
  let ax=null,q=0,ex=0,ey=0;el.addEventListener('pointerenter',()=>{ax=app.getBoundingClientRect()});
  el.addEventListener('pointermove',e=>{if(!r)r=el.getBoundingClientRect();if(!ax)ax=app.getBoundingClientRect();ex=e.clientX;ey=e.clientY;
    if(!q)q=requestAnimationFrame(()=>{q=0;if(!r||!ax)return;const dx=(ex-(ax.left+ax.width/2))/r.width,dy=(ey-(ax.top+ax.height/2))/r.height;
    app.style.transform=`perspective(420px) rotateX(${clamp(-dy*50,-22,22)}deg) rotateY(${clamp(dx*50,-28,28)}deg)`})},{passive:true});
  el.addEventListener('pointerleave',()=>{app.style.transform='';r=null;ax=null})});

/* ---------- videos (equal grid) ---------- */
function renderVideos(list){
  const box=$('#vids');const keepH=box.offsetHeight;if(keepH)box.style.minHeight=keepH+'px';box.textContent='';requestAnimationFrame(()=>box.style.minHeight='');
  list.slice(0,6).forEach((v,i)=>{
    const a=document.createElement('a');a.className='vid reveal is-in';a.href='https://www.youtube.com/watch?v='+v.id;a.target='_blank';a.rel='noopener noreferrer';
    const th=document.createElement('div');th.className='vid__thumb';
    const img=new Image();img.alt='';img.width=800;img.height=450;img.decoding='async';img.loading='lazy';
    th.classList.add('is-loading');img.addEventListener('load',()=>th.classList.remove('is-loading'),{once:true});
    if(DATA.thumbs[v.id])img.src='assets/img/thumbs/'+v.id+'.webp';
    else{const alts=[`https://i.ytimg.com/vi/${v.id}/hq720.jpg`,`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`];let k=0;img.src=alts[0];img.onerror=()=>{k++;if(k<alts.length)img.src=alts[k];else{img.remove();th.classList.add('is-missing')}}}
    th.appendChild(img);
    const pl=document.createElement('span');pl.className='vid__play';pl.innerHTML=ICONS.play;th.appendChild(pl);
    if(i===0&&v.fresh){const n=document.createElement('span');n.className='vid__new';n.textContent='חדש';th.appendChild(n)}
    const body=document.createElement('div');body.className='vid__body';const h=document.createElement('h3');h.textContent=v.t;const s2=document.createElement('span');s2.textContent='';
    body.append(h,s2);a.append(th,body);box.appendChild(a)});
}
renderVideos(DATA.videos);
/* ---------- business inquiries (address from DATA.business) ---------- */
(function(){
  const row=$('#bizRow'),em=String((DATA.business||{}).email||'').trim();if(!row)return;row.textContent='';
  if(/^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(em)){const a=document.createElement('a');a.className='btn btn--light';a.href='mailto:'+em+'?subject='+encodeURIComponent('פנייה עסקית – OdedSVR');a.textContent='שליחת מייל';
    const ad=document.createElement('span');ad.className='biz__addr';ad.textContent=em;
    const cp=document.createElement('button');cp.type='button';cp.className='copy';cp.textContent='העתק';cp.setAttribute('aria-label','העתקת כתובת המייל לפניות עסקיות');cp.addEventListener('click',()=>copyText(em,cp,'כתובת המייל הועתקה'));
    row.append(a,ad,cp)}
  else{const p=document.createElement('p');p.className='biz__todo';p.textContent='כתובת לפניות עסקיות תתווסף כאן בקרוב.';row.appendChild(p)}})();
/* videos: latest ↔ recommended for new visitors (only when DATA.featured has videos) */
let VMODE='latest',LATEST=null;
(function(){const tg=$('#vtog');const F=(DATA.featured||[]).filter(v=>v&&/^[\w-]{11}$/.test(v.id)&&typeof v.t==='string');if(!tg||!F.length)return;tg.hidden=false;
  tg.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.getAttribute('aria-pressed')==='true')return;VMODE=b.dataset.v;
    $$('button',tg).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    $('#vdEm').textContent=VMODE==='featured'?'מומלצים':'אחרונים';$('#vdIntro').textContent=VMODE==='featured'?'נקודת פתיחה טובה למי שרק מגיע לערוץ.':'קטעים מהלייבים, ישר מהערוץ ביוטיוב.';
    renderVideos(VMODE==='featured'?F:(LATEST||DATA.videos));$('#vdLive').textContent=VMODE==='featured'?`מוצגים ${Math.min(6,F.length)} סרטונים מומלצים`:'מוצגים הסרטונים האחרונים'})})();
/* Shorts are left out: a Short's original-aspect thumbnail (oardefault) is portrait; a regular video gets a 120×90 placeholder there */
const SHORT_KEY='osvr-shorts';let SHORTS={};try{SHORTS=JSON.parse(sessionStorage.getItem(SHORT_KEY)||'{}')||{}}catch(e){}
const KNOWN=new Set(DATA.videos.map(v=>v.id));
function isShort(id){if(KNOWN.has(id))return Promise.resolve(false);if(id in SHORTS)return Promise.resolve(SHORTS[id]);
  return new Promise(res=>{const i=new Image();let done=false;const end=v=>{if(done)return;done=true;clearTimeout(t);if(v!==null){SHORTS[id]=v;try{sessionStorage.setItem(SHORT_KEY,JSON.stringify(SHORTS))}catch(e){}}res(!!v)};
    const t=setTimeout(()=>end(null),5000);i.onload=()=>end(i.naturalHeight>i.naturalWidth);i.onerror=()=>end(false);i.src=`https://i.ytimg.com/vi/${id}/oardefault.jpg`})}
async function refreshVideos(){try{const y=await getJSON(WORKER_URL+'/youtube');if(!Array.isArray(y))return;
  const list=y.filter(v=>v&&/^[\w-]{11}$/.test(v.id)&&typeof v.title==='string').map(v=>({id:v.id,t:str(v.title,160)}));
  const flags=await Promise.all(list.map(v=>isShort(v.id)));
  const fresh=list.filter((v,i)=>!flags[i]);
  if(!fresh.length)return;const ids=new Set(fresh.map(v=>v.id));
  /* newest first; then the saved list continues from the oldest video the worker returned, so the order stays by upload date */
  let at=-1;fresh.forEach(v=>{const k=DATA.videos.findIndex(d=>d.id===v.id);if(k>at)at=k});
  const rest=(at>=0?DATA.videos.slice(at+1):DATA.videos).filter(v=>!ids.has(v.id));
  const merged=[...fresh,...rest].slice(0,6);
  if(merged[0].id!==DATA.videos[0].id)merged[0].fresh=true;
  LATEST=merged;if(VMODE==='latest')renderVideos(merged)}catch(e){}}
idle(refreshVideos);setInterval(()=>{if(!document.hidden)refreshVideos()},15*60e3);



/* ---------- leaderboard ---------- */
const toHours=s=>{const m=String(s).match(/(\d+)d\s*(\d+)h/);return m?(+m[1]*24+ +m[2]):+s};
function renderLB(range,animate=true){
  const data=(DATA.board[range]||[]).filter(r=>r&&!HIDDEN.has(String(r[0]).toLowerCase())), isW=range==='watch';
  if(!data||data.length<3)return;
  const unit={weekly:'גיפטים',month:'גיפטים',all:'גיפטים',chat:'הודעות',watch:''}[range];
  const val=v=>isW?v:fmt(v);
  const max=toHours(data[0][1]);
  const [a,b,c]=data;
  const mv=rankMoves(range,data);
  const pod=$('#podium');
  const srv=v=>`<span class="sr">${esc(String(val(v)))}${unit?' '+unit:' שעות צפייה'}</span>`;
  pod.innerHTML=[[a,1],[b,2],[c,3]].map(([p,r])=>`<li class="pod pod--${r}"><span class="sr">מקום ${r}: </span><div class="pod__av" aria-hidden="true">${esc(initials(p[0]))}</div><div class="pod__name">${esc(p[0])}</div><div class="pod__val"><span class="cnt" aria-hidden="true" data-n="${isW?'':p[1]}">${val(p[1])}</span><span aria-hidden="true"> ${unit}</span>${srv(p[1])}</div>${mvTag(mv[p[0]])}<div class="pod__block" aria-hidden="true">${r}</div></li>`).join('');
  $('#lbPanel').innerHTML=data.slice(3).map((p,i)=>`<li class="row ${animate?'lb-anim':''}" style="animation-delay:${i*45}ms"><span class="row__rank"><span class="sr">מקום </span>${i+4}</span><span class="row__name">${esc(p[0])}${mvTag(mv[p[0]])}</span><span class="row__val"><span class="cnt" aria-hidden="true" data-n="${isW?'':p[1]}">${val(p[1])}</span>${srv(p[1])}</span><span class="row__bar" data-p="${(toHours(p[1])/max).toFixed(3)}"></span></li>`).join('');
  if(animate&&!RM){pod.classList.remove('pod-anim');void pod.offsetWidth;pod.classList.add('pod-anim')}
  requestAnimationFrame(()=>requestAnimationFrame(()=>$$('#lbPanel .row__bar').forEach(x=>x.style.setProperty('--p',x.dataset.p))));
  if(animate)countUp();else{const w=$('.lb');if(w&&!RM){w.classList.remove('lb-swap');void w.offsetWidth;w.classList.add('lb-swap')}}
}
/* rank movement: compared with the last *different* snapshot this browser saw */
function rankMoves(range,data){const out={};let st=null;const names=data.slice(0,10).map(r=>r[0]);
  try{st=JSON.parse(localStorage.getItem('osvr-rank-'+range)||'null')}catch(e){}
  if(!st||!Array.isArray(st.cur))st={prev:null,cur:names};
  else if(st.cur.join('|')!==names.join('|'))st={prev:st.cur,cur:names};
  try{localStorage.setItem('osvr-rank-'+range,JSON.stringify(st))}catch(e){}
  if(Array.isArray(st.prev))names.forEach((n,i)=>{const j=st.prev.indexOf(n);out[n]=j<0?'new':j>i?'up':j<i?'down':''});
  return out}
function mvTag(m){return m==='up'?'<span class="mv mv--up" aria-hidden="true">▲</span><span class="sr">, עלה בדירוג</span>':m==='down'?'<span class="mv mv--down" aria-hidden="true">▼</span><span class="sr">, ירד בדירוג</span>':''}
/* numbers count up from zero (once per render, only when visible) */
function countUp(){if(RM)return;$$('#leaderboard .cnt').forEach(el=>{const n=+el.dataset.n;if(!el.dataset.n||!Number.isFinite(n)||n<=0)return;
  const t0=performance.now(),D=1100;el.textContent=fmt(0);
  (function f(t){const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);el.textContent=fmt(Math.round(n*e));if(k<1)requestAnimationFrame(f)})(t0)})}
{const sec=$('#leaderboard');if(sec&&'IntersectionObserver' in window){const io2=new IntersectionObserver(es=>{if(es[0].isIntersecting){countUp();io2.disconnect()}},{threshold:.35});io2.observe(sec)}}
let boardBusy=false,boardTry=0;
async function loadLive(){if(boardBusy)return;boardBusy=true;boardTry=Date.now();try{await loadBoards()}finally{boardBusy=false}}
async function loadBoards(){ // live gifters straight from Kick, then the worker, then /data.json on odedsvr.com
  const ok=x=>x&&typeof x.username==='string'&&/^[\w.\-]{1,32}$/.test(x.username)&&!HIDDEN.has(x.username.toLowerCase())&&Number.isFinite(+x.quantity)&&+x.quantity>=0;
  const map=a=>(Array.isArray(a)?a:[]).filter(ok).slice(0,10).map(x=>[x.username,Math.floor(+x.quantity)]);
  const valid=j=>j&&typeof j==='object'&&(Array.isArray(j.gifts)||Array.isArray(j.gifts_week)||Array.isArray(j.gifts_month));
  const srcs=[`https://kick.com/api/v2/channels/${DATA.channel}/leaderboards`,WORKER_URL+'/leaderboards','/data.json?t='+Date.now()];
  let j=null;
  for(const u of srcs){try{const d=await getJSON(u);if(valid(d)){j=d;break}}catch(e){}}
  if(!j){fresh();return}
  if(j.gifts_week_enabled!==false&&Array.isArray(j.gifts_week)) DATA.board.weekly=map(j.gifts_week);
  if(j.gifts_enabled!==false&&Array.isArray(j.gifts)) DATA.board.all=map(j.gifts);
  if(j.gifts_month_enabled!==false&&Array.isArray(j.gifts_month)) DATA.board.month=map(j.gifts_month);
  boardOK=Date.now();fresh();
  const t=$('.tab[aria-selected="true"]');if(t&&/^(weekly|month|all)$/.test(t.dataset.r))renderLB(t.dataset.r,false);
}
const tabs=$$('.tab'),pill=$('.tabs__pill');var repill;
function movePill(t){const r=t.getBoundingClientRect(),pr=t.parentElement.getBoundingClientRect();pill.style.width=r.width+'px';pill.style.right=(pr.right-r.right)+'px';pill.style.top=(r.top-pr.top)+'px'}
function selectTab(t){tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1});$('#lbTab').setAttribute('aria-labelledby',t.id);movePill(t);renderLB(t.dataset.r)}
tabs.forEach(t=>{t.addEventListener('click',()=>selectTab(t));t.addEventListener('keydown',e=>{const v=tabs.filter(x=>!x.hidden),i=v.indexOf(t);let j=null;if(e.key==='ArrowLeft')j=(i+1)%v.length;if(e.key==='ArrowRight')j=(i-1+v.length)%v.length;if(e.key==='Home')j=0;if(e.key==='End')j=v.length-1;if(j!==null){e.preventDefault();v[j].focus();selectTab(v[j])}})});
renderLB('weekly',false); loadLive(); setInterval(()=>{if(!document.hidden){loadLive();refreshWorker()}},120e3);document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-boardTry>30e3)loadLive()});
function rerender(){const t=$('.tab[aria-selected="true"]');if(t&&(t.dataset.r==='watch'||t.dataset.r==='chat'))renderLB(t.dataset.r,false)}
repill=()=>movePill($('.tab[aria-selected="true"]'));
requestAnimationFrame(repill);addEventListener('resize',repill);document.fonts&&document.fonts.ready.then(repill);

/* ---------- info ---------- */
$('#specs').innerHTML=DATA.specs.map(([k,v])=>`<li><span class="k">${k}</span><span class="v">${esc(v)}</span></li>`).join('');
$('#cmds').innerHTML=DATA.commands.map(([c,d])=>`<div class="cmd"><span class="mono">${c}</span><span>${esc(d)}</span><button class="copy" type="button" data-code="${c}" aria-label="העתקת הפקודה ${c}">העתק</button></div>`).join('');
$$('.copy[data-code]').forEach(b=>b.addEventListener('click',()=>copyText(b.dataset.code,b,`${b.dataset.code} הועתק`)));

/* magnetic buttons */
if(FINE&&!RM) $$('.magnetic').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.28}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});

/* reveals */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('is-in');io.unobserve(e.target)}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
$$('.reveal').forEach(el=>{const sib=[...el.parentElement.children].filter(x=>x.classList.contains('reveal'));el.style.transitionDelay=(sib.indexOf(el)%6)*80+'ms';io.observe(el)});

/* scroll-bound UI */
const prog=$('.progress'),totop=$('#totop'),foot=$('#footBig'),secs=$$('main section[id]'),navA=$$('#navLinks a');
let ticking=false;
let footNear=false,lastActive='';
new IntersectionObserver(es=>{footNear=es[0].isIntersecting;requestAnimationFrame(onScroll)},{rootMargin:'200px 0px'}).observe(foot);
const inBand=new Set();
const secIO=new IntersectionObserver(es=>{es.forEach(e=>{e.isIntersecting?inBand.add(e.target):inBand.delete(e.target)});{const t=bizSeen?$('#business'):[...inBand].find(s=>![...inBand].some(o=>o!==s&&s.contains(o)));if(t){const id=t.id;if(id!==lastActive){lastActive=id;navA.forEach(a=>{const on=a.getAttribute('href')==='#'+id;a.classList.toggle('is-active',on);on?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')});
  $$('#dock [data-sec]').forEach(a=>{a.dataset.sec===id?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')})}}}},{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>secIO.observe(s));
/* the contact card is short and sits at the end: once most of it is on screen it is the current stop */
let bizSeen=false;{const bz=$('#business');if(bz)new IntersectionObserver(es=>{bizSeen=es[0].intersectionRatio>=.6;secIO.takeRecords();lastActive='';secs.forEach(s=>{secIO.unobserve(s);secIO.observe(s)})},{threshold:[0,.6,1]}).observe(bz)}
let maxY=0;const measure=()=>{maxY=document.documentElement.scrollHeight-innerHeight};measure();addEventListener('resize',measure,{passive:true});new ResizeObserver(measure).observe(document.body);
let st1=null,st2=null,st3=null,st4=null;const dock=$('#dock'),dockMore=$('#dockMore'),dockPop=$('#dockPop'),scene_=$('#top'),tour_=$('#collabs'),foot_=$('.foot2');
function onScroll(){ticking=false;const y=scrollY;
  const fr=footNear?foot.getBoundingClientRect():null;            // read
  prog.style.transform=`scaleX(${maxY>0?Math.min(1,y/maxY):0})`;  // writes
  {const tr=tour_?tour_.getBoundingClientRect():null,inTour=tr&&!H_.classList.contains('tour-stack')&&tr.top<innerHeight*.55&&tr.bottom>innerHeight*.45,
    heroDone=y>(scene_?Math.max(1,scene_.offsetHeight-innerHeight)*.24:innerHeight*.5),atFoot=foot_&&foot_.getBoundingClientRect().top<innerHeight*.9,
    keep=dock&&(dock.contains(document.activeElement)||(dockPop&&!dockPop.hidden));
    const d=keep||(heroDone&&!inTour&&!atFoot);if(d!==st4){st4=d;H_.classList.toggle('dock-on',d)}}
  const a=y>40,b=y>innerHeight*.9;if(a!==st1){st1=a;nav.classList.toggle('is-scrolled',a)}if(b!==st2){st2=b;totop.classList.toggle('is-on',b)}
  if(fr){const p=clamp((innerHeight-fr.top)/(fr.height+innerHeight*.3),0,1);const v=Math.round(p*50)*2;if(v!==st3){st3=v;foot.style.setProperty('--fill',v+'%')}if(p>.8)$('#thanks').classList.add('is-in')}}
/* while the page is moving, decorative loops rest so every frame goes to scrolling */
let scrollT=0;const H_=document.documentElement;
const AST_=document.querySelector('.astro');if(AST_)addEventListener('scroll',()=>{if(!AST_.classList.contains('scrolling'))AST_.classList.add('scrolling');clearTimeout(scrollT);scrollT=setTimeout(()=>AST_.classList.remove('scrolling'),160)},{passive:true});
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
totop.addEventListener('click',()=>{if(lenis)lenis.scrollTo(0,{duration:1.4});else scrollTo({top:0,behavior:RM?'auto':'smooth'})});
/* dock: the sections list (mobile) — a small disclosure, not a menu */
if(dockMore){const setPop=o=>{dockPop.hidden=!o;dockMore.setAttribute('aria-expanded',String(o))};
  dockMore.addEventListener('click',()=>setPop(dockPop.hidden));
  dockPop.addEventListener('click',e=>{if(e.target.closest('a'))setPop(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dockPop.hidden){setPop(false);dockMore.focus()}});
  document.addEventListener('pointerdown',e=>{if(!dockPop.hidden&&!dock.contains(e.target))setPop(false)});
  dock.addEventListener('focusout',e=>{if(!dockPop.hidden&&e.relatedTarget&&!dock.contains(e.relatedTarget))setPop(false)})}

/* accessibility panel */
(function(){
  const H=document.documentElement,btn=$('#a11yBtn'),pan=$('#a11yPanel');
  const TOG=['kbd','regions','voice','light','dark','mono','cmeter','sathi','satlo','readable','links','alt','heads','struct','magnify','cbig','mask','guide','mute','summary','vkbd','dict','tts','calm','quiet','hl'];
  const ONESHOT=['struct','summary'];             // open a sheet, never stay on
  const LIM={fs:[-3,6],ls:[0,5],ws:[0,5],lh:[0,5]};
  const DEF=()=>({on:[],fs:0,ls:0,ws:0,lh:0,hue:0,cur:''});
  let st=DEF();
  RMQ.addEventListener&&RMQ.addEventListener('change',()=>{RM=RMQ.matches||st.on.includes('calm')});
  try{const v=JSON.parse(localStorage.getItem('osvr-a11y2')||'{}');if(v&&typeof v==='object'){
    st.on=Array.isArray(v.on)?v.on.filter(k=>TOG.includes(k)&&!ONESHOT.includes(k)):[];
    for(const k in LIM)st[k]=clamp(Math.round(+v[k])||0,LIM[k][0],LIM[k][1]);
    st.hue=clamp(Math.round(+v.hue)||0,0,360);st.cur=['','black','white'].includes(v.cur)?v.cur:''}}catch(e){}
  const save=()=>{try{localStorage.setItem('osvr-a11y2',JSON.stringify(st))}catch(e){}};
  const has=k=>st.on.includes(k);
  const say=(t)=>{const v=$('.ax-voice');v.hidden=false;v.textContent=t;clearTimeout(say.t);say.t=setTimeout(()=>{if(!has('voice'))v.hidden=true},2600)};

  /* ---------- apply everything ---------- */
  function apply(){
    TOG.forEach(k=>H.classList.toggle('axon-'+k,has(k)));
    H.classList.toggle('a11y-contrast',has('dark'));H.classList.toggle('a11y-calm',has('calm'));H.classList.toggle('a11y-links',has('links'));
    $$('.ax__opt').forEach(b=>{if(ONESHOT.includes(b.dataset.ax))b.removeAttribute('aria-pressed');else b.setAttribute('aria-pressed',has(b.dataset.ax))});
    const f=[];if(has('light'))f.push('invert(1) hue-rotate(180deg)');if(has('mono'))f.push('grayscale(1)');if(has('cmeter'))f.push('contrast(1.45)');
    if(has('sathi'))f.push('saturate(2)');if(has('satlo'))f.push('saturate(.35)');if(st.hue)f.push(`hue-rotate(${st.hue}deg)`);
    H.style.filter=f.join(' ');
    const z=1+st.fs*.1;H.style.setProperty('--ax-tz',String(z));document.body.style.zoom='';
    RM=RMQ.matches||has('calm');H.classList.toggle('a11y-rm',RM);
    H.style.setProperty('--ax-ls',(st.ls*.04)+'em');H.style.setProperty('--ax-ws',(st.ws*.12)+'em');H.style.setProperty('--ax-lh',(1.5+st.lh*.25));
    H.classList.toggle('axon-ls',st.ls>0);H.classList.toggle('axon-ws',st.ws>0);H.classList.toggle('axon-lh',st.lh>0);
    const out=(k,t)=>{const o=$('#axo-'+k);if(o)o.textContent=t};
    out('fs',Math.round(z*100)+'%');['ls','ws','lh'].forEach(k=>out(k,st[k]?'+'+st[k]:'רגיל'));
    $('#axHue').value=st.hue;
    H.classList.toggle('axon-cur-black',st.cur==='black');H.classList.toggle('axon-cur-white',st.cur==='white');
    $$('.ax__seg [data-cur]').forEach(b=>b.setAttribute('aria-checked',b.dataset.cur===st.cur));
    // side effects
    altLabels(has('alt'));regions(has('regions'));voice(has('voice'));vkbd(has('vkbd'));
    if(has('mute'))muteAll();if(!has('tts')&&'speechSynthesis' in window)speechSynthesis.cancel();
    if(!has('magnify'))tip.style.display='none';
  }

  /* ---------- panel open / close ---------- */
  const open=o=>{pan.hidden=false;requestAnimationFrame(()=>pan.classList.toggle('is-open',o));btn.setAttribute('aria-expanded',o);
    if(o){let n=0;const f=()=>{const t=$('.ax__head',pan);if(!pan.classList.contains('is-open'))return;t.focus();if(document.activeElement!==t&&n++<12)setTimeout(f,40)};setTimeout(f,60)}else setTimeout(()=>{if(!pan.classList.contains('is-open'))pan.hidden=true},260)};
  btn.addEventListener('click',()=>open(!pan.classList.contains('is-open')));
  $('#axClose').addEventListener('click',()=>{open(false);btn.focus()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pan.classList.contains('is-open')&&!document.querySelector('dialog[open]')){open(false);btn.focus()}});
  document.addEventListener('pointerdown',e=>{if(pan.classList.contains('is-open')&&!pan.contains(e.target)&&!btn.contains(e.target)&&!e.target.closest('.ax-sheet,.ax-vkbd'))open(false)});
  $$('.ax__head',pan).forEach(h=>h.addEventListener('click',()=>{const s=h.closest('.ax__sec'),o=!s.classList.contains('is-open');s.classList.toggle('is-open',o);h.setAttribute('aria-expanded',o)}));

  /* ---------- controls ---------- */
  const EXCL={light:['dark'],dark:['light'],sathi:['satlo'],satlo:['sathi']};
  $$('.ax__opt').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.ax;
    if(k==='struct'){sheetStructure();return}
    if(k==='summary'){sheetSummary();return}
    if(k==='voice'&&!SR){say('הדפדפן הזה לא תומך בפקודות קוליות');return}
    st.on=has(k)?st.on.filter(x=>x!==k):[...st.on.filter(x=>!(EXCL[k]||[]).includes(x)),k];apply();save()}));
  $$('.ax__step').forEach(row=>$$('button',row).forEach(b=>b.addEventListener('click',()=>{const k=row.dataset.step;st[k]=clamp(st[k]+ +b.dataset.d,LIM[k][0],LIM[k][1]);apply();save()})));
  $('#axHue').addEventListener('input',e=>{st.hue=+e.target.value;apply();save()});
  $('#axColorReset').addEventListener('click',()=>{st.on=st.on.filter(k=>!['light','dark','mono','cmeter','sathi','satlo'].includes(k));st.hue=0;apply();save()});
  $$('.ax__seg [data-cur]').forEach(b=>b.addEventListener('click',()=>{st.cur=b.dataset.cur;apply();save()}));
  $('#a11yReset').addEventListener('click',()=>{st=DEF();apply();save();say('כל הגדרות הנגישות אופסו')});

  /* ---------- sheet (structure, summary, dictionary) ---------- */
  const sh=$('#axSheet'),shT=$('#axSheetT'),shB=$('.ax-sheet__body',sh);
  let shFrom=null;sh.addEventListener('close',()=>{const t=shFrom;shFrom=null;if(t&&t.isConnected&&document.activeElement===document.body&&!t.closest('[hidden]'))t.focus()});
  function sheet(title,node){shT.textContent=title;shB.replaceChildren(node);if(!sh.open){shFrom=document.activeElement;try{sh.showModal()}catch(e){sh.setAttribute('open','')}}}
  $('[data-close]',sh).addEventListener('click',()=>sh.close());
  sh.addEventListener('click',e=>{if(e.target===sh)sh.close()});
  const visible=el=>!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)&&!el.closest('[hidden],.ax,.ax-sheet,dialog:not([open])');
  const goTo=el=>{sh.close();open(false);const y=el.getBoundingClientRect().top+scrollY-90;(typeof lenis!=='undefined'&&lenis)?lenis.scrollTo(y,{duration:1}):scrollTo({top:y,behavior:'smooth'});el.setAttribute('tabindex','-1');setTimeout(()=>el.focus({preventScroll:true}),700)};
  function sheetStructure(){
    const ol=document.createElement('ol');ol.className='ax-list';
    $$('main h1,main h2,main h3,section h2,section h3,footer h2').filter(visible).forEach(h=>{const li=document.createElement('li');li.className='lv'+h.tagName[1];
      const b=document.createElement('button');b.type='button';b.textContent=h.textContent.replace(/\s+/g,' ').trim();b.addEventListener('click',()=>goTo(h));li.append(b);ol.append(li)});
    sheet('מבנה העמוד',ol)}
  function sheetSummary(){
    const d=document.createElement('div');d.className='ax-sum';
    const p=document.createElement('p');p.textContent='האתר הרשמי של OdedSVR, סטרימר ב-Kick. כאן תמצאו את:';d.append(p);
    const ul=document.createElement('ul');
    $$('main > section, main section[id], footer').filter(s=>s.id&&visible(s)).forEach(s=>{const h=$('h2,h3',s);if(!h)return;
      const intro=$('.sec__intro,p',s);const li=document.createElement('li');const b=document.createElement('button');b.type='button';
      b.innerHTML='';const t=document.createElement('strong');t.textContent=h.textContent.trim();b.append(t);
      if(intro&&intro.textContent.trim()){const sp=document.createElement('span');sp.textContent=' · '+intro.textContent.trim().slice(0,120);b.append(sp)}
      b.addEventListener('click',()=>goTo(s));li.append(b);ul.append(li)});
    d.append(ul);sheet('סיכום העמוד',d)}

  /* ---------- image descriptions ---------- */
  function altLabels(on){$$('.ax-alt').forEach(x=>x.remove());if(!on)return;
    $$('img[alt]').filter(i=>i.alt.trim()&&visible(i)).forEach(i=>{const s=document.createElement('span');s.className='ax-alt';s.textContent=i.alt;
      const p=i.parentElement;if(getComputedStyle(p).position==='static')p.style.position='relative';p.append(s)})}

  /* ---------- region navigation ---------- */
  const REG=[['#top','ראש הדף'],['#collabs','שיתופי פעולה'],['#links','לינקים'],['#videos','סרטונים'],['#leaderboard','לידרבורד'],['#info','סטאפ ופקודות'],['footer','סוף הדף']];
  const regBox=$('.ax-regions');
  REG.forEach(([sel,l],i)=>{const b=document.createElement('button');b.type='button';b.textContent=`${i+1}. ${l}`;b.addEventListener('click',()=>{const el=$(sel)||document.body;goTo(el)});regBox.append(b)});
  function regions(on){regBox.hidden=!on}
  document.addEventListener('keydown',e=>{if(!has('regions')&&!has('kbd'))return;if(e.altKey&&/^[1-7]$/.test(e.key)){e.preventDefault();const r=REG[+e.key-1];const el=$(r[0]);if(el)goTo(el)}});

  /* ---------- keyboard navigation: every card & tile focusable ---------- */
  const kbdTargets=()=>$$('.vid,.link,.spw__panel,.row,.pod,.cmd');
  H.addEventListener('ax-kbd',()=>{});
  new MutationObserver(()=>{if(has('kbd'))kbdTargets().forEach(el=>{if(!el.hasAttribute('tabindex')&&!/^(A|BUTTON)$/.test(el.tagName))el.tabIndex=0})}).observe(H,{attributes:true,attributeFilter:['class']});

  /* ---------- voice commands ---------- */
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
  const CMD=[[/למטה|גלול/,()=>scrollBy({top:innerHeight*.8,behavior:'smooth'})],[/למעלה/,()=>scrollBy({top:-innerHeight*.8,behavior:'smooth'})],
    [/התחלה|ראש/,()=>goTo($('#top')||document.body)],[/שיתופי|ספונסר|שותפ/,()=>goTo($('#collabs'))],[/לינק|קישור/,()=>goTo($('#links'))],
    [/סרטונ|וידאו/,()=>goTo($('#videos'))],[/לידרבורד|גיפט/,()=>goTo($('#leaderboard'))],[/סטאפ|פקוד/,()=>goTo($('#info'))],
    [/קיק|שידור/,()=>window.open('https://kick.com/'+DATA.channel,'_blank','noopener')],[/סגור|עצור/,()=>{st.on=st.on.filter(k=>k!=='voice');apply();save()}]];
  function voice(on){const box=$('.ax-voice');
    if(!SR){return}
    if(on&&!rec){rec=new SR();rec.lang='he-IL';rec.continuous=true;rec.interimResults=false;
      rec.onresult=e=>{const t=e.results[e.results.length-1][0].transcript.trim();const c=CMD.find(([r])=>r.test(t));say(c?'✓ '+t:'לא זוהה: '+t);if(c)c[1]()};
      rec.onend=()=>{if(has('voice')&&rec)try{rec.start()}catch(e){}};rec.onerror=()=>{};
      try{rec.start();box.hidden=false;box.textContent='מקשיב… אמרו "סרטונים", "למטה", "סגור"'}catch(e){}}
    if(!on&&rec){const r=rec;rec=null;try{r.stop()}catch(e){}box.hidden=true}}

  /* ---------- magnifier ---------- */
  const tip=$('.ax-tip');
  document.addEventListener('pointermove',e=>{
    if(has('mask')||has('guide')){H.style.setProperty('--ax-y',e.clientY+'px')}
    if(!has('magnify'))return;const el=e.target.closest('h1,h2,h3,h4,p,li,a,button,span,label,b,strong,small,output');
    if(!el||el.closest('.ax,.ax-tip')){tip.style.display='none';return}
    const t=(el.innerText||'').replace(/\s+/g,' ').trim();if(!t||t.length>220){tip.style.display='none';return}
    tip.textContent=t;tip.style.display='block';const x=Math.min(innerWidth-tip.offsetWidth-12,Math.max(12,e.clientX-tip.offsetWidth/2));
    tip.style.transform=`translate(${x}px,${Math.max(12,e.clientY-tip.offsetHeight-24)}px)`},{passive:true});

  /* ---------- media, TTS, dictionary ---------- */
  function muteAll(){$$('video,audio').forEach(m=>{m.muted=true;try{m.pause()}catch(e){}})}
  document.addEventListener('play',e=>{if(has('mute')&&e.target.matches('video,audio')){e.target.muted=true}},true);
  function speak(t){if(!('speechSynthesis' in window)||!t)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='he-IL';u.rate=1;
    const v=speechSynthesis.getVoices().find(v=>/^he/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}
  document.addEventListener('click',e=>{
    if(e.target.closest('.ax,.ax-sheet,#a11yBtn,.ax-vkbd'))return;
    if(has('tts')){const sel=String(getSelection()||'').trim();const el=e.target.closest('h1,h2,h3,p,li,a,button,.row,.pod,.vid,.link,span');
      const t=sel||(el&&(el.innerText||el.getAttribute('aria-label')||'').trim());if(t){speak(t.slice(0,600))}}
  },true);
  document.addEventListener('dblclick',e=>{if(!has('dict')||e.target.closest('.ax,.ax-sheet'))return;
    const w=String(getSelection()||'').trim().replace(/[^\p{L}\p{N}'"\-]/gu,'');if(!w)return;
    const d=document.createElement('div');d.className='ax-dict';const h=document.createElement('p');h.className='ax-dict__w';h.textContent=w;d.append(h);
    const heb=/[֐-׿]/.test(w);
    [[heb?'מורפיקס':'Morfix',`https://www.morfix.co.il/${encodeURIComponent(w)}`],['ויקימילון',`https://he.wiktionary.org/wiki/${encodeURIComponent(w)}`],['Google Translate',`https://translate.google.com/?sl=auto&tl=${heb?'en':'iw'}&text=${encodeURIComponent(w)}`]]
      .forEach(([l,u])=>{const a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener';a.textContent=l+' ↗';d.append(a)});
    if('speechSynthesis' in window){const b=document.createElement('button');b.type='button';b.textContent='🔊 השמעה';b.addEventListener('click',()=>speak(w));d.append(b)}
    sheet('מילון',d)});

  /* ---------- virtual keyboard ---------- */
  const kb=$('.ax-vkbd');let kbTarget=null;
  document.addEventListener('focusin',e=>{if(e.target.matches('input:not([type=range]):not([type=checkbox]),textarea,[contenteditable="true"]'))kbTarget=e.target});
  const ROWS=[["/","'","ק","ר","א","ט","ו","ן","ם","פ"],["ש","ד","ג","כ","ע","י","ח","ל","ך","ף"],["ז","ס","ב","ה","נ","מ","צ","ת","ץ","."],["⌫","רווח","↵","EN"]];
  const ROWS_EN=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l","@"],["z","x","c","v","b","n","m",",",".","-"],["⌫","רווח","↵","עב"]];
  let en=false;
  function drawKb(){kb.replaceChildren();const hd=document.createElement('div');hd.className='ax-vkbd__hd';hd.textContent=kbTarget?'מקלדת וירטואלית':'מקלדת וירטואלית — לחצו קודם על שדה טקסט';kb.append(hd);
    (en?ROWS_EN:ROWS).forEach(r=>{const row=document.createElement('div');row.className='ax-vkbd__r';r.forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=k;if(k.length>1)b.className='w';
      b.addEventListener('mousedown',e=>e.preventDefault());b.addEventListener('click',()=>key(k));row.append(b)});kb.append(row)})}
  function key(k){if(k==='EN'||k==='עב'){en=!en;drawKb();return}const t=kbTarget;if(!t)return;t.focus();
    const ins=s=>{if(typeof t.setRangeText==='function'){const a=t.selectionStart,b=t.selectionEnd;t.setRangeText(s,a,b,'end')}else document.execCommand('insertText',false,s);t.dispatchEvent(new Event('input',{bubbles:true}))};
    if(k==='⌫'){if(typeof t.setRangeText==='function'){const a=t.selectionStart,b=t.selectionEnd;if(a===b&&a>0)t.setRangeText('',a-1,a,'end');else t.setRangeText('',a,b,'end');t.dispatchEvent(new Event('input',{bubbles:true}))}return}
    if(k==='רווח')return ins(' ');if(k==='↵'){if(t.form)t.form.requestSubmit?t.form.requestSubmit():t.form.submit();else ins('\n');return}ins(k)}
  function vkbd(on){kb.hidden=!on;if(on)drawKb()}

  /* ---------- the button: one-time attention pulse ---------- */
  try{if(!localStorage.getItem('osvr-a11y-seen')){btn.classList.add('is-hint');setTimeout(()=>btn.classList.remove('is-hint'),6000);localStorage.setItem('osvr-a11y-seen','1')}}catch(e){}

  apply();
})();

/* size each LED layer to its card's diagonal */
(function(){const set=()=>$$('.link,.show').forEach(el=>{const w=el.offsetWidth,h=el.offsetHeight;el.style.setProperty('--dg',Math.ceil(Math.hypot(w,h))+4+'px')});set();let t;addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(set,150)},{passive:true})})();
/* pause hero + marquee loops off-screen */
(function(){const H=document.documentElement;const w=(el,c)=>el&&new IntersectionObserver(es=>H.classList.toggle(c,!es[0].isIntersecting)).observe(el);w($('.hero'),'hero-off');w($('.band'),'band-off')})();
/* pause LED loops while their section is off-screen */
(function(){const io2=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('led-off',!e.isIntersecting)),{rootMargin:'100px'});$$('#links .wrap,#collabs .show').forEach(el=>io2.observe(el))})();
/* accessibility statement / privacy policy (in-page, #accessibility / #privacy) */
(function(){
  let opener=null;
  const open=k=>{const d=$('#doc-'+k);if(!d||d.open)return;opener=document.activeElement&&document.activeElement!==document.body?document.activeElement:null;try{d.showModal()}catch(e){d.setAttribute('open','')}d.querySelector('.doc__x').focus()};
  const back=()=>{const t=opener;opener=null;const ok=t&&t.isConnected&&!t.closest('[hidden],.ax:not(.is-open)')&&(t.offsetWidth||t.offsetHeight);(ok?t:$('#a11yBtn')||document.body).focus({preventScroll:!ok})};
  $$('[data-doc]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const p=$('#a11yPanel');if(p&&p.classList.contains('is-open'))$('#a11yBtn').click();open(a.dataset.doc);try{history.replaceState(null,'','#'+a.dataset.doc)}catch(_){}}));
  $$('.doc').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d)d.close()});$('[data-close]',d).addEventListener('click',()=>d.close());
    d.addEventListener('close',()=>{setTimeout(back,0);if(/^#(accessibility|privacy)$/.test(location.hash))try{history.replaceState(null,'',location.pathname+location.search)}catch(_){}})});
  const h=location.hash.slice(1);if(h==='accessibility'||h==='privacy')open(h);
  addEventListener('hashchange',()=>{const k=location.hash.slice(1);if(k==='accessibility'||k==='privacy')open(k)});
})();
/* subathon countdown — the bar removes itself the moment the timer hits zero */
(function(){const bar=$('#subbar'),out=$('#subDays'),t=Date.parse(DATA.subathon);if(!bar)return;
  if(!Number.isFinite(t)){bar.remove();return}
  const il=new Intl.DateTimeFormat('he-IL',{timeZone:'Asia/Jerusalem',day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date(t)).reduce((o,p)=>(o[p.type]=p.value,o),{});
  $('#subLbl').textContent=`הסאבתון מתחיל ב-${il.day}.${il.month} בשעה ${il.hour}:${il.minute}`;
  const p2=n=>String(n).padStart(2,'0');let iv;
  const tick=()=>{const ms=t-Date.now();if(ms<=0){clearInterval(iv);bar.remove();return}
    const d=Math.floor(ms/864e5),h=Math.floor(ms/36e5)%24,m=Math.floor(ms/6e4)%60,s=Math.floor(ms/1e3)%60;
    out.textContent=(d>0?`עוד ${d===1?'יום':d+' ימים'} · `:'עוד ')+`${p2(h)}:${p2(m)}:${p2(s)}`};
  tick();iv=setInterval(()=>{if(!document.hidden)tick()},1000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
})();
/* share */
$('#shareBtn').addEventListener('click',async()=>{const url='https://odedsvr.com/';
  try{if(navigator.share){await navigator.share({title:'OdedSVR',text:'הבית הרשמי של OdedSVR',url});return}}catch(e){if(e&&e.name==='AbortError')return}
  copyText(url,null,'הקישור הועתק')});
/* easter egg: tap the dolphin 5x → splash */
(function(){
  let n=0,tm;const d=$('#dolphin');if(!d)return;
  const splash=()=>{toast('פיסטוקי פוסטקה 🐬');if(RM)return;
    const cols=['#3fd2ff','#a06bff','#eef2ff','#53fc18'];
    for(let i=0;i<70;i++){const c=document.createElement('i');c.className='drop';c.style.left=Math.random()*100+'vw';c.style.background=cols[i%4];document.body.appendChild(c);
      c.animate([{transform:'translateY(0)'},{transform:`translateY(${innerHeight+40}px) translateX(${(Math.random()-.5)*160}px)`}],{duration:1500+Math.random()*1300,easing:'cubic-bezier(.3,.1,.5,1)',delay:Math.random()*300}).onfinish=()=>c.remove()}};
  const hit=()=>{n++;clearTimeout(tm);tm=setTimeout(()=>n=0,1500);if(!RM)d.animate([{transform:'scale(.9) rotate(6deg)'},{transform:'none'}],{duration:350,easing:'cubic-bezier(.22,1,.36,1)'});if(n>=5){n=0;splash()}};
  d.addEventListener('click',hit);d.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();hit()}});
})();
const IDLE=window.requestIdleCallback?f=>requestIdleCallback(f,{timeout:1200}):f=>setTimeout(f,300);

/* =========================================================
   ILLUSTRATED SPACE — film grain, stars, the flight, the cockpit
   ========================================================= */
/* film grain: one tiny tile rendered once */
(function(){if(LITE)return;try{const c=document.createElement('canvas');c.width=c.height=180;const x=c.getContext('2d'),d=x.createImageData(180,180);
  for(let i=0;i<d.data.length;i+=4){const v=Math.random();if(v>.5){d.data[i]=d.data[i+1]=d.data[i+2]=255;d.data[i+3]=(v-.5)*46}else{d.data[i+3]=(.5-v)*60}}
  x.putImageData(d,0,0);document.body.style.setProperty('--grain',`url(${c.toDataURL('image/png')})`)}catch(e){}})();
/* stars: drawn once, static */
(function(){const s=$('#stars');if(!s)return;const W=1000,H=600;s.setAttribute('viewBox',`0 0 ${W} ${H}`);let h='';
  let seed=7;const r=()=>(seed=(seed*16807)%2147483647)/2147483647;
  for(let i=0;i<110;i++){const x=r()*W,y=r()*H,z=r();h+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(z*1.4+.3).toFixed(2)}" fill="#fff" opacity="${(.25+z*.6).toFixed(2)}"/>`}
  s.innerHTML=h;
  const t=document.createElement('div');t.className='twk';t.setAttribute('aria-hidden','true');let k='';
  for(let i=0;i<12;i++)k+=`<i style="left:${(r()*100).toFixed(1)}%;top:${(r()*100).toFixed(1)}%;animation-delay:${(-r()*3).toFixed(2)}s"></i>`;
  t.innerHTML=k;s.after(t)})();

/* hero entrance: letters rise, the field drifts in */
(function(){
  const h=$('#heroTitle');
  $$('.wl',h).forEach(r=>{r.innerHTML=[...r.textContent].map(c=>`<span class="ch">${c}</span>`).join('')});
  function run(){if(RM)return;const E='cubic-bezier(.22,1,.36,1)';
  $$('.ch',h).forEach((c,i)=>c.animate([{opacity:0,transform:'translate3d(0,.35em,0) scale(.96)',filter:'blur(14px)'},{opacity:1,transform:'none',filter:'blur(0)'}],{duration:1300,delay:120+i*45,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
  $$('.hero-in').forEach((el,i)=>el.animate([{opacity:0,transform:'translate3d(0,14px,0)'},{opacity:1,transform:'none'}],{duration:700,delay:600+i*120,easing:E,fill:'backwards'}));
  $$('#field .ast').forEach((a,i)=>a.firstElementChild.animate([{opacity:0,scale:.6},{opacity:1,scale:1}],{duration:1100,delay:80+i*40,easing:E,fill:'backwards'}));
  const pod=$('#pod .ship__bob');pod&&pod.animate([{opacity:0,translate:'0 24px'},{opacity:1,translate:'0 0'}],{duration:1200,delay:250,easing:'cubic-bezier(.34,1.3,.64,1)',fill:'backwards'});
}
  run();
})();

/* the flight: scroll moves the camera through the field, into the pod, into the cockpit */
(function(){
  const sc=$('#top');if(!sc)return;
  const asts=$$('#field .ast').map(el=>{const cs=el.style;return {el,x:parseFloat(cs.getPropertyValue('--x')),y:parseFloat(cs.getPropertyValue('--y')),z:+el.dataset.z||1}});
  const pod=$('#pod'),rings=$('#rings'),copy=$('#heroCopy'),warp=$('#warp'),live=$('#livecard'),cue=$('#cue');
  /* afterimages that trail the pod as it swoops away */
  const ghosts=RM?[]:[0,1,2].map(()=>{const g=pod.cloneNode(true);g.removeAttribute('id');g.classList.add('ship--ghost');$$('[id]',g).forEach(n=>n.removeAttribute('id'));g.style.opacity='0';pod.after(g);return g});
  const ss=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
  const lerp=(a,b,t)=>a+(b-a)*t;
  let top0=0,span=1,W=innerWidth,H=innerHeight,raf=0,lastP=-1,on=true;
  const measure=()=>{const r=sc.getBoundingClientRect();top0=r.top+scrollY;span=Math.max(1,sc.offsetHeight-innerHeight);W=innerWidth;H=innerHeight;lastP=-1;tick()};
  /* the swoop: right & slightly up → tight U-turn near the edge → long dive down-left toward the camera */
  const bz=(a,b,c,d,u)=>{const v=1-u;return v*v*v*a+3*v*v*u*b+3*v*u*u*c+u*u*u*d};
  function pos(t){t=clamp(t,0,1);const A=.4;
    if(t<A){const u=t/A;return[bz(0,.18*W,.31*W,.36*W,u),bz(0,-.02*H,-.12*H,-.06*H,u)]}
    const u=(t-A)/(1-A);return[bz(.36*W,.41*W,.04*W,-.72*W,u),bz(-.06*H,0,.6*H,.95*H,u)]}
  function at(t,s1,by){const p0=pos(t),p1=pos(t+.004),vx=p1[0]-p0[0],vy=p1[1]-p0[1],l=Math.hypot(vx,vy)||1,
      bank=20*(vx/l)+6*(vy/l)*(vx>=0?1:-1),sc=s1*(1-.14*Math.sin(Math.PI*clamp(t/.42,0,1))+.75*Math.pow(clamp((t-.45)/.55,0,1),1.6));
    return `translate3d(${p0[0].toFixed(1)}px,${(p0[1]+by).toFixed(1)}px,0) rotate(${(bank*Math.min(1,t*12)).toFixed(2)}deg) scale(${sc.toFixed(3)})`}
  function frame(){raf=0;const p=clamp((scrollY-top0)/span,0,1);if(Math.abs(p-lastP)<.0005)return;lastP=p;
    const fly=Math.pow(p,1.35),fade=1-ss(.78,.92,p);
    for(const a of asts){const k=a.z*fly;const dx=(a.x-50)/50*W*.62*k,dy=(a.y-50)/50*H*.62*k,s=1+k*1.9;
      a.el.style.transform=`translate3d(${dx.toFixed(1)}px,${dy.toFixed(1)}px,0) scale(${s.toFixed(3)})`;a.el.style.opacity=fade.toFixed(3);a.el.style.visibility=fade<.005?'hidden':''}
    const s1=lerp(1,1.35,ss(.06,.36,p)),lin=clamp((p-.36)/.5,0,1),t=lin*lin*(3-2*lin)*.35+lin*.65,by=lerp(-H*.03,0,ss(.06,.36,p));
    pod.style.transform=at(t,s1,by);pod.style.willChange=(p>.01&&p<.995)?'transform':'auto';
    ghosts.forEach((g,i)=>{const k=t-(i+1)*.03,on=t>.005&&t<.995&&k>0;g.style.opacity=on?(([.2,.11,.05][i])*Math.sin(Math.PI*t)).toFixed(3):'0';g.style.visibility=on?'':'hidden';if(on)g.style.transform=at(k,s1,by)});
    const c=copy.contains(document.activeElement)?0:ss(.04,.22,p);copy.style.opacity=(1-c).toFixed(3);copy.style.transform=`translate3d(0,${(-90*c).toFixed(1)}px,0) scale(${(1-.08*c).toFixed(3)})`;copy.style.visibility=c>.99?'hidden':'visible';
    const lc=live.contains(document.activeElement)?0:ss(.02,.16,p);live.style.opacity=(1-lc).toFixed(3);live.style.visibility=lc>.99?'hidden':'visible';
    cue.style.opacity=(1-ss(0,.05,p)).toFixed(3);
    const ro=ss(.16,.32,p)*(1-ss(.4,.5,p));rings.style.opacity=ro.toFixed(3);rings.style.transform=`scale(${(lerp(.55,1,ss(.14,.38,p))*(1+ss(.4,.56,p)*.5)).toFixed(3)})`;
    const wo=ss(.88,.98,p);warp.style.opacity=wo.toFixed(3);warp.style.visibility=wo>0?'':'hidden';if(window.__ws&&wo>0){const k=ss(.8,1,p);__ws[0].style.transform=`translate3d(0,${(-140*k).toFixed(1)}px,0)`;__ws[1].style.transform=`translate3d(0,${(-300*k).toFixed(1)}px,0)`}
  }
  const tick=()=>{if(on&&!raf)raf=requestAnimationFrame(frame)};
  addEventListener('scroll',tick,{passive:true});addEventListener('resize',measure,{passive:true});
  new ResizeObserver(measure).observe(document.body);
  const pin_=sc.querySelector('.scene__pin');
  new IntersectionObserver(es=>{on=es[0].isIntersecting;document.documentElement.classList.toggle('hero-off',!on);if(pin_)pin_.classList.toggle('is-off',!on);if(on)tick()}).observe(sc);
  measure();
})();

/* pointer parallax on the field (desktop only, transform on a wrapper) */
(function(){const f=$('#field'),pod=$('#pod .ship__bob');if(!f||!FINE||RM||LITE)return;let tx=0,ty=0,q=0;
  addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;if(!q)q=requestAnimationFrame(()=>{q=0;f.style.transform=`translate3d(${(-tx*22).toFixed(1)}px,${(-ty*16).toFixed(1)}px,0)`})},{passive:true});
})();

/* =========================================================
   SPONSOR TOUR — pinned full-screen worlds; one wheel notch = one sponsor
   ========================================================= */
(function(){
  const T=$('#collabs');if(!T||!T.classList.contains('tour'))return;
  const ws=$$('.spw',T),n=ws.length,dots=$$('.tdot',T);
  let cur=-1,top0=0,range=1,lockT=0,nav=-1,navT=0;
  const measure=()=>{top0=T.getBoundingClientRect().top+scrollY;range=Math.max(1,T.offsetHeight-innerHeight)};
  const SQ=matchMedia('(max-height:500px)');let stack=false;
  function setStack(){stack=SQ.matches;document.documentElement.classList.toggle('tour-stack',stack);ws.forEach((w,k)=>{const on=stack||k===cur;w.setAttribute('aria-hidden',String(!on));w.inert=!on});T.setAttribute('aria-roledescription',stack?'רשימת שותפים':'קרוסלה');ws.forEach(w=>stack?w.removeAttribute('aria-roledescription'):w.setAttribute('aria-roledescription','שקופית'))}
  SQ.addEventListener&&SQ.addEventListener('change',()=>{setStack();measure()});
  function set(i){if(i===cur)return;const old=cur;cur=i;
    ws.forEach((w,k)=>{const on=k===i;
      if(k===old&&!on){w.classList.add('is-leaving');setTimeout(()=>w.classList.remove('is-leaving'),500)}
      w.classList.toggle('is-on',on);w.classList.toggle('is-past',k<i);
      if(!stack){w.setAttribute('aria-hidden',String(!on));w.inert=!on}});
    dots.forEach((d,k)=>d.setAttribute('aria-current',String(k===i)));if(old>=0&&!stack){const lv=$('#tourLive');if(lv)lv.textContent=`שותף ${i+1} מתוך ${n}: ${dots[i]?dots[i].getAttribute('aria-label'):''}`}{const cb=T.querySelector('.tour__cnt b');if(cb)cb.textContent=i+1}if(i>0)T.classList.remove('is-new');
    T.classList.toggle('is-last',i===n-1);T.classList.toggle('is-first',i===0);T.classList.toggle('is-luz',i===0||i===n-1)}
  const prog=()=>(scrollY-top0)/range;
  function onScroll(){if(stack)return;if(nav>=0&&performance.now()<navT)return;nav=-1;set(Math.max(0,Math.min(n-1,Math.round(prog()*(n-1)))))}
  function goI(i){i=Math.max(0,Math.min(n-1,i));const y=top0+range*i/(n-1);
    nav=i;navT=performance.now()+600;set(i);if(typeof lenis!=='undefined'&&lenis)lenis.scrollTo(y,{duration:.55,easing:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,lock:true,force:true,onComplete:()=>{nav=-1}});else scrollTo({top:y,behavior:RM?'auto':'smooth'})}
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',()=>{measure();onScroll()});
  addEventListener('load',()=>{measure();onScroll()});
  if(window.ResizeObserver)new ResizeObserver(()=>{measure()}).observe(document.body);
  /* wheel: while the tour is pinned, each gesture moves exactly one sponsor */
  addEventListener('wheel',e=>{if(e.ctrlKey||stack)return;
    {const sp=e.target.closest&&e.target.closest('.spw__panel');if(sp&&sp.scrollHeight>sp.clientHeight+2&&(e.deltaY>0?sp.scrollTop+sp.clientHeight<sp.scrollHeight-1:sp.scrollTop>0))return}
    const r=T.getBoundingClientRect();if(r.top>4||r.bottom<innerHeight-4)return;
    if(Math.abs(e.deltaY)<Math.abs(e.deltaX)||Math.abs(e.deltaY)<2)return;
    const now=performance.now(),dir=e.deltaY>0?1:-1,t=cur+dir;
    if(t<0||t>n-1){if(now<lockT){e.preventDefault();e.stopPropagation()}return}
    e.preventDefault();e.stopPropagation();
    if(now<lockT){lockT=Math.max(lockT,now+160);return}
    lockT=now+620;goI(t)},{capture:true,passive:false});
  const pv=$('#tourPrev'),nx=$('#tourNext');
  pv&&pv.addEventListener('click',()=>{measure();goI(cur-1)});nx&&nx.addEventListener('click',()=>{measure();goI(cur+1)});
  dots.forEach((d,k)=>d.addEventListener('click',()=>{measure();goI(k)}));
  T.addEventListener('keydown',e=>{if(stack||e.target.closest('.spin3,.tee3'))return;
    if(e.key==='ArrowLeft'){e.preventDefault();measure();goI(cur+1)}if(e.key==='ArrowRight'){e.preventDefault();measure();goI(cur-1)}});
  /* touch: a horizontal swipe also steps (RTL: swipe left → next) */
  let sx=null,sy=0;T.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.target.closest('.spin3,a,button'))return;sx=e.clientX;sy=e.clientY},{passive:true});
  T.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){measure();goI(cur+(dx<0?1:-1))}},{passive:true});

  measure();set(0);setStack();
  /* direct links: #luz, #mahsanei-hashmal, #libero, #cardpull open that partner */
  window.__tourGo=k=>{measure();if(stack){ws[k].scrollIntoView({behavior:RM?'auto':'smooth'});return}goI(k)};
  const fromHash=()=>{const w=location.hash.length>1&&ws.find(x=>x.id===location.hash.slice(1));if(!w)return;measure();const k=+w.dataset.i;
    if(stack){w.scrollIntoView();return}nav=k;navT=performance.now()+800;set(k);scrollTo(0,top0+range*k/(n-1))};
  addEventListener('hashchange',fromHash);if(location.hash)addEventListener('load',()=>setTimeout(fromHash,0));
})();


/* Nuggets in zero gravity — a soft body that ripples slowly, cruises gently, turns smoothly, can be thrown */
(function(){const el=$('#nug');if(!el)return;
  const body=$('#nugBody'),pin=$('.scene__pin'),head=$('#nugHead'),halo=$('#nugHalo');
  const skin=$('#nugSkin'),ink=$('#nugInk'),clipP=$('#nugClipP'),belly=$('#nugBelly'),scutes=$('#nugScutes'),blotch=$('#nugBlotch'),flecks=$('#nugFlecks'),shine=$('#nugShine');
  /* --- the body: a real snake's taper along a slowly undulating spine --- */
  const N=40,X0=22,X1=292;
  const width=s=>s<.55?.9+Math.pow(s/.55,.72)*16.6:s>.84?17.5-Math.pow((s-.84)/.16,1.3)*6.5:17.5;
  function spine(t){const P=[];for(let i=0;i<=N;i++){const s=i/N,x=X0+(X1-X0)*s,amp=12+16*(1-s);
      P.push([x,104+amp*Math.sin(s*5.6-t*.55)+5*Math.sin(s*2.3+t*.23)])}return P}
  const f=v=>v.toFixed(1);
  const smooth=P=>{let d=`M${f(P[0][0])} ${f(P[0][1])}`;for(let i=0;i<P.length-1;i++){const p0=P[i-1]||P[i],p1=P[i],p2=P[i+1],p3=P[i+2]||p2;
      d+=`C${f(p1[0]+(p2[0]-p0[0])/6)} ${f(p1[1]+(p2[1]-p0[1])/6)} ${f(p2[0]-(p3[0]-p1[0])/6)} ${f(p2[1]-(p3[1]-p1[1])/6)} ${f(p2[0])} ${f(p2[1])}`}return d};
  function draw(t){const P=spine(t),Nm=[],W=[];
    for(let i=0;i<=N;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(N,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;Nm.push([-dy/l,dx/l]);W.push(width(i/N))}
    const off=(i,k)=>[P[i][0]+Nm[i][0]*W[i]*k,P[i][1]+Nm[i][1]*W[i]*k];
    const line=(k,a=0,b=N)=>{const Q=[];for(let i=a;i<=b;i++)Q.push(off(i,k));return Q};
    const outline=smooth(line(-1))+smooth(line(1).reverse()).replace('M','L')+'Z';
    skin.setAttribute('d',outline);ink.setAttribute('d',outline);clipP.setAttribute('d',outline);
    /* pale belly on the underside, crossed by ventral scales */
    belly.setAttribute('d',smooth(line(1.2,2))+smooth(line(.38,2).reverse()).replace('M','L')+'Z');
    let sc='';for(let i=3;i<N;i++){const p=off(i,.4),q=off(i,1.1);sc+=`M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}`;
      if(i<N-1){const m0=[(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2],nx=(Nm[i][0]+Nm[i+1][0])/2,ny=(Nm[i][1]+Nm[i+1][1])/2,w=(W[i]+W[i+1])/2;
        sc+=`M${f(m0[0]+nx*w*.4)} ${f(m0[1]+ny*w*.4)}L${f(m0[0]+nx*w*1.1)} ${f(m0[1]+ny*w*1.1)}`}}
    scutes.setAttribute('d',sc);
    /* dorsal saddles, like a corn snake */
    const offF=(u,k)=>{const i=Math.floor(u),r=u-i,j=Math.min(N,i+1),a=off(i,k),b=off(j,k);return[a[0]+(b[0]-a[0])*r,a[1]+(b[1]-a[1])*r]};
    let bl='';for(let u=7.5,n=0;u<N-3;u+=3.6,n++){const L=1.9,c=u+L/2,top=-1.25,bot=n%2?.05:.22;
      const p0=offF(u,bot),p1=offF(u-.35,-.55),p2=offF(u+.1,top),p3=offF(c,top-.05),p4=offF(u+L-.1,top),p5=offF(u+L+.35,-.55),p6=offF(u+L,bot),p7=offF(c,bot+.12);
      bl+=`M${f(p0[0])} ${f(p0[1])}C${f(p1[0])} ${f(p1[1])} ${f(p2[0])} ${f(p2[1])} ${f(p3[0])} ${f(p3[1])}C${f(p4[0])} ${f(p4[1])} ${f(p5[0])} ${f(p5[1])} ${f(p6[0])} ${f(p6[1])}Q${f(p7[0])} ${f(p7[1])} ${f(p0[0])} ${f(p0[1])}Z`}
    blotch.setAttribute('d',bl);
    flecks.setAttribute('d',smooth(line(-.55,6,N-1)));shine.setAttribute('d',smooth(line(-.62,10,N-2)));
    const end=P[N],pre=P[N-2],ang=Math.atan2(end[1]-pre[1],end[0]-pre[0])*180/Math.PI;
    head.setAttribute('transform',`translate(${f(end[0]-9)} ${f(end[1])}) rotate(${f(ang)}) scale(1.28)`);
    halo.setAttribute('transform',`translate(${f(end[0]+22)} ${f(end[1]-38+3*Math.sin(t*.9))}) rotate(${f(-6+4*Math.sin(t*.7))})`)}
  /* --- drifting --- */
  let W=0,H=0,w=0,h=0,x=0,y=0,vx=0,vy=0,th=0,a=-6,va=0,raf=0,last=0,vis=true,drag=null,avoid=[],T=0;
  function measure(){W=pin.clientWidth;H=pin.clientHeight;w=el.offsetWidth;h=el.offsetHeight;
    avoid=$$('#heroTitle,.hero__copy .hero__ctas,.hero__copy .eyebrow,.livecard,.ship',pin).map(n=>{const r=n.getBoundingClientRect(),p=pin.getBoundingClientRect();return{l:r.left-p.left-40,t:r.top-p.top-40,r:r.right-p.left+40,b:r.bottom-p.top+40}})}
  measure();addEventListener('resize',measure);setTimeout(measure,2500);
  const small=()=>W<700,CRUISE=()=>small()?7:11;
  x=W*(small()?.62:.705);y=H*(small()?.14:.26);th=Math.PI*(.85+Math.random()*.3);vx=Math.cos(th)*CRUISE();vy=Math.sin(th)*CRUISE();
  const place=()=>{el.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;body.style.transform=`rotate(${a.toFixed(2)}deg)`};
  const lerpA=(p,q,k)=>{let d=Math.atan2(Math.sin(q-p),Math.cos(q-p));return p+d*k};
  let fr=0;
  function step(now){raf=0;const dt=last?Math.min(.05,(now-last)/1000):0;last=now;T+=dt;
    if((fr++&1)===0)draw(T);
    if(!drag){
      /* steer gently away from edges and from the title/buttons */
      const pt=Math.max(0,pin.getBoundingClientRect().top+scrollY),top=small()?84:innerHeight*.186-pt+h*.12,L=W*(small()?.5:.688)+w*.05,Rt=W*(small()?.97:.828)-w*.05,B=small()?H*.27-h*.42:innerHeight*.447-pt-h*.14,m=Math.max(12,Math.min(small()?30:40,(Rt-L-w)/3,(B-top-h)/3)),cx=x+w/2,cy=y+h/2;let rx=0,ry=0;
      if(x<L+m)rx+=(L+m-x)/m;if(x+w>Rt-m)rx-=(x+w-(Rt-m))/m;if(y<top+m*.5)ry+=(top+m*.5-y)/m;if(y+h>B-m*.5)ry-=(y+h-(B-m*.5))/m;
      avoid.forEach(r=>{if(cx>r.l-60&&cx<r.r+60&&cy>r.t-60&&cy<r.b+60){const ox=cx-(r.l+r.r)/2,oy=cy-(r.t+r.b)/2,l=Math.hypot(ox,oy)||1;rx+=ox/l*.9;ry+=oy/l*.9}});
      th+=(.18*Math.sin(T*.11)+.12*Math.sin(T*.053+1.7))*dt;
      if(rx||ry)th=lerpA(th,Math.atan2(ry,rx),Math.min(1,dt*.9*Math.min(1.5,Math.hypot(rx,ry))));
      const c=CRUISE(),tx=Math.cos(th)*c,ty=Math.sin(th)*c,k=Math.min(1,dt*.55);vx+=(tx-vx)*k;vy+=(ty-vy)*k;
      x+=vx*dt;y+=vy*dt;
      x=clamp(x,L,Math.max(L,Rt-w));y=clamp(y,top,Math.max(top,B-h));
      /* a slow, lazy turn of the whole body */
      a=-4+9*Math.sin(T*.17)+4*Math.sin(T*.07+1.1)}
    place();if(vis)raf=requestAnimationFrame(step)}
  function wake(){if(!raf&&vis){last=0;raf=requestAnimationFrame(step)}}
  draw(0);place();
  if(RM){vis=false}
  new IntersectionObserver(es=>{vis=es[0].isIntersecting&&!RM;if(vis){measure();wake()}},{threshold:0}).observe(pin);
  let gone=false;const vis2=()=>{const g=scrollY>8;if(g!==gone){gone=g;el.classList.toggle('is-gone',g)}};
  addEventListener('scroll',vis2,{passive:true});vis2();
  const show=()=>{el.classList.add('is-on');wake()};
  setTimeout(show,600);
})();

/* =========================================================
   PREMIUM LAYER — depth on scroll, light under the cursor, tilt, sparkles
   ========================================================= */
IDLE(function(){
  const fine=matchMedia('(pointer:fine)').matches;
  /* 1 · scroll depth: each scene's layers drift at their own speed (direct transforms on promoted layers — no restyle) */
  const scenes=$$('.frame--lake').map(s=>({s,L:[[$('.pod2',s),34,.4]].filter(x=>x[0])})),live=new Set();
  const io=new IntersectionObserver(es=>es.forEach(e=>{const o=scenes.find(x=>x.s===e.target);e.isIntersecting?live.add(o):live.delete(o)}),{rootMargin:'120px 0px'});
  scenes.forEach(o=>io.observe(o.s));
  let tick=false;
  function depth(){tick=false;if(RM)return;const vh=innerHeight;
    live.forEach(o=>{const r=o.s.getBoundingClientRect(),p=clamp(((r.top+r.height/2)-vh/2)/(vh/2+r.height/2),-1,1);
      o.L.forEach(([el,k,off])=>{el.style.translate=`0 ${((p+(off||0))*k).toFixed(1)}px`})})}
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(depth)}},{passive:true});depth();
  /* 5 · headings rise word by word */
  const heads=$$('.frame .h2,.foot2__h,.tour__title');
  heads.forEach(h=>{let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const parts=c.textContent.split(/(\s+)/);const f=document.createDocumentFragment();
        parts.forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p));return}const w=document.createElement('span');w.className='w';w.style.setProperty('--i',i++);w.textContent=p;f.appendChild(w)});c.replaceWith(f)}
      else if(c.nodeType===1)walk(c)})};walk(h);h.classList.add('wsplit')});
  const hio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('w-in');hio.unobserve(e.target)}}),{threshold:.3});
  heads.forEach(h=>hio.observe(h));
  /* 6 · the astronaut dolphin: tap for a barrel roll + bubbles; five taps for a surprise */
  const astro=$('#astro');if(astro){let n=0,tm,busy=false;const inn=$('.astro__in',astro),frame=astro.parentElement;
    astro.addEventListener('click',()=>{n++;clearTimeout(tm);tm=setTimeout(()=>n=0,1600);
      if(!RM&&!busy){busy=true;inn.animate([{transform:'rotate(0) scale(1)'},{transform:'rotate(-200deg) scale(1.08)',offset:.55},{transform:'rotate(-360deg) scale(1)'}],{duration:900,easing:'cubic-bezier(.45,0,.2,1)'}).onfinish=()=>busy=false;
        const r=astro.getBoundingClientRect(),f=frame.getBoundingClientRect();
        for(let i=0;i<10;i++){const b=document.createElement('span');b.className='bub';const sz=6+Math.random()*16;b.style.setProperty('--b',sz+'px');
          const x=r.left-f.left+r.width*(.25+Math.random()*.5),y=r.top-f.top+r.height*.25;b.style.left=x+'px';b.style.top=y+'px';frame.appendChild(b);
          b.animate([{transform:'translate3d(0,0,0) scale(.3)',opacity:1},{transform:`translate3d(${(Math.random()-.5)*160}px,${-60-Math.random()*140}px,0) scale(1)`,opacity:0}],{duration:1400+Math.random()*900,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>b.remove()}}
      if(n>=5){n=0;if(typeof toast==='function')toast('פיסטוקי פוסטקה 🐬')}})}
});

/* =========================================================
   v36 — magic: aurora, motes, hyperspace
   ========================================================= */
IDLE(function(){if(document.documentElement.classList.contains('lite'))return;
  const A=[];
  A.forEach(s=>$$(s).forEach(f=>{const a=document.createElement('div');a.className='aurora';a.setAttribute('aria-hidden','true');a.innerHTML='<i></i><i></i><i></i>';f.insertBefore(a,f.firstChild.nextSibling)}));
  const pal={'frame--lake':['#fff','rgba(255,200,250,.7)'],'frame--desert':['#fff6d8','rgba(255,220,140,.6)'],'spw--pay':['#fff6d8','rgba(255,220,140,.6)'],'spw--luz':['#fff','rgba(255,200,250,.7)']};
  $$('.scene__pin').forEach(f=>{const m=document.createElement('div');m.className='motes';m.setAttribute('aria-hidden','true');
    const k=Object.keys(pal).find(c=>f.classList.contains(c)),c=k?pal[k]:['#e8fbff','rgba(166,236,255,.6)'];
    const n=innerWidth<700?5:9;let h='';
    for(let i=0;i<n;i++){const s=(1.5+Math.random()*3.5).toFixed(1);
      h+=`<span class="mote" style="--x:${(Math.random()*100).toFixed(1)}%;--y:${(10+Math.random()*80).toFixed(1)}%;--s:${s}px;--d:${(9+Math.random()*10).toFixed(1)}s;--dl:${(-Math.random()*18).toFixed(1)}s;--dx:${((Math.random()-.5)*160).toFixed(0)}px;--dy:${(-40-Math.random()*140).toFixed(0)}px;--o:${(.5+Math.random()*.5).toFixed(2)};--mc:${c[0]};--mg:${c[1]}"></span>`}
    m.innerHTML=h;f.appendChild(m)});
});
/* perf: pause every decorative animation in a block while it is off-screen */
(function(){const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('zz',!e.isIntersecting)),{rootMargin:'80px 0px'});
  $$('.frame,.foot2__frame,.tour,.nav,.subbar,.intro').forEach(el=>io.observe(el))})();

/* hero depth: star layers drift with the pointer at different depths */
(function(){const pin=$('.scene__pin'),A=$('.starlayer--a'),B=$('.starlayer--b');if(!pin||!A||RM||!matchMedia('(pointer:fine)').matches)return;
  let tx=0,ty=0,x=0,y=0,raf=0;const loop=()=>{x+=(tx-x)*.06;y+=(ty-y)*.06;A.style.transform=`translate3d(${(x*-10).toFixed(2)}px,${(y*-8).toFixed(2)}px,0)`;B.style.transform=`translate3d(${(x*-24).toFixed(2)}px,${(y*-18).toFixed(2)}px,0)`;
    raf=(Math.abs(tx-x)+Math.abs(ty-y)>.002)?requestAnimationFrame(loop):0};
  pin.addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;if(!raf)raf=requestAnimationFrame(loop)},{passive:true})})();


window.__ws=[document.getElementById('warpStars'),document.getElementById('warpStarsB')];if(!__ws[0])window.__ws=null;


/* Libero — glass perfume carousel (orbiting bottles, drag to spin, click to bring forward) */
(function(){
  const st=document.getElementById('lbwStage');if(!st)return;
  const room=st.closest('.spw'),bs=[...st.querySelectorAll('.lbw__b')],cap=st.querySelector('.lbw__cap');
  const N=bs.length,TAU=Math.PI*2,live=document.getElementById('lbwLive');
  bs.forEach(b=>{const im=b.querySelector('img');b.querySelector('.lbw__gl').style.setProperty('--m',`url("${im.src}")`)});
  let ang=0.0,vel=0,auto=0,hover=false,drag=null,target=null,raf=0,last=0,front=-1,W=0,H=0,vis=false;
  const nat=bs.map(b=>{const i=b.querySelector('img');return[+i.getAttribute('width'),+i.getAttribute('height')]});
  const maxH=Math.max(...nat.map(n=>n[1])),st_=[];
  function measure(){W=st.clientWidth;H=st.clientHeight}
  function place(){
    const bw=Math.min(.94*W,1.2*H),bh=bw*260/600,y0=H-.03*H-bh,cx=W/2,cy=y0+bw*92/600,rx=bw*286/600*.62,ry=bw*50/600*.62;
    const k=Math.min(.62*H/maxH,(bw*.28)/nat[1][0]);let best=-2,bi=0;
    bs.forEach((b,i)=>{const t=ang+i*TAU/N,z=Math.cos(t),s=.74+.26*(z+1)/2;if(!st_[i]||st_[i].k!==k)st_[i]={k,s0:1,w:-1,z:-1,o:''};const w=Math.round(nat[i][0]*k),h=Math.round(nat[i][1]*k);
      const x=cx+rx*Math.sin(t)-w/2,y=cy+ry*z-h*.985-(1-s)*h*-.0;
      const o=st_[i];if(o.w!==w){o.w=w;b.style.width=w+'px';b.style.height=h+'px'}
      b.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${(s/o.s0).toFixed(4)})`;
      const zi=2+Math.round((z+1)*10);if(zi!==o.z){o.z=zi;b.style.zIndex=String(zi)}
      const op=(.78+.22*(z+1)/2).toFixed(2);if(op!==o.o){o.o=op;b.style.opacity=op}
      if(z>best){best=z;bi=i}});
    if(bi!==front){front=bi;const b=bs[bi];cap.innerHTML=`<b>${b.dataset.n}</b><span>${b.dataset.d}</span>`;cap.classList.remove('is-swap');void cap.offsetWidth;cap.classList.add('is-swap')}
  }
  function frame(t){raf=0;const dt=Math.min(.05,(t-(last||t))/1000);last=t;
    if(target!==null){const d=target-ang;ang+=RM?d:d*Math.min(1,dt*6);if(Math.abs(d)<.002){ang=target;target=null}}
    else if(!drag){vel+=((hover?auto*.6:auto)-vel)*Math.min(1,dt*2.6);ang+=vel*dt}
    place();const moving=drag||target!==null||Math.abs(vel)>.002;if(!moving)vel=0;if(moving&&vis&&(room.classList.contains('is-on')||room.classList.contains('is-leaving')))raf=requestAnimationFrame(frame);else last=0}
  const go=()=>{if(!raf&&vis)raf=requestAnimationFrame(frame)};
  st.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hover=true});
  st.addEventListener('pointerleave',()=>{hover=false});
  st.addEventListener('pointerdown',e=>{drag={x:e.clientX,a:ang,t:performance.now(),moved:false,lx:e.clientX,lt:performance.now()};target=null;try{st.setPointerCapture(e.pointerId)}catch(_){}});
  st.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>4){drag.moved=true;st.classList.add('is-drag')}
    const now=performance.now();vel=(e.clientX-drag.lx)/Math.max(1,now-drag.lt)*1000/(W*.35);drag.lx=e.clientX;drag.lt=now;ang=drag.a+dx/(W*.35);go()});
  const up=e=>{if(!drag)return;const moved=drag.moved;drag=null;st.classList.remove('is-drag');
    if(!moved){const b=e.target.closest&&e.target.closest('.lbw__b');if(b)bring(bs.indexOf(b))}go()};
  st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);st.addEventListener('lostpointercapture',e=>{if(drag){drag.moved=true;up(e)}});
  setInterval(()=>{if(drag&&performance.now()-drag.lt>2500){drag=null;st.classList.remove('is-drag')}if(target!==null&&!raf)target=null;go()},1500);
  function bring(i){const cur=ang+i*TAU/N;let d=-Math.atan2(Math.sin(cur),Math.cos(cur));target=ang+d;vel=0;go();
    if(live){const b=bs[i];live.textContent=`${b.dataset.n} בחזית: ${b.dataset.d}`}}
  bs.forEach((b,i)=>b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();bring(i)}}));
  new ResizeObserver(()=>{measure();place()}).observe(st);
  new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){measure();place();go()}}).observe(room);
  new MutationObserver(()=>go()).observe(room,{attributes:true,attributeFilter:['class']});
  measure();place();
})();

/* מחסני חשמל — small electric arcs that crackle between the neon ring and the coin */


/* LÜZ shirt — product-photo showcase: crisp real photos, gentle 3D sway, smooth flip front↔back, drag to turn */
(function(){const el=document.getElementById('tee3');if(!el)return;const body=document.getElementById('tee3Body'),room=el.closest('.spw');
  const srcF=body.querySelector('.tee3__f').src,srcB=body.querySelector('.tee3__b').src;
  const face=(src,cls)=>{const w=document.createElement('div');w.className='tee3__face '+cls;const i=document.createElement('img');i.src=src;i.alt='';i.draggable=false;const g=document.createElement('span');g.className='tee3__gloss';g.style.webkitMaskImage=g.style.maskImage=`url("${src}")`;w.append(i,g);body.appendChild(w);return w};
  const F=face(srcF,'tee3__face--one'),Fi=F.querySelector('img'),Fg=F.querySelector('.tee3__gloss');let cur=1;
  const stEl=document.getElementById('tee3St');let shown=1;
  let a=0,target=0,drag=null,raf=0,last=0,vis=false,clock=0,side=0,tx=0,ty=0,px=0,py=0;
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;let flip=null;
  function put(){const sw=RM?0:Math.sin(clock*.9)*9,bob=RM?0:Math.sin(clock*1.3)*3;
    const ry=a+sw+tx*14,rx=-ty*8+2;body.style.transform=`rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    const n=((ry%360)+360)%360,front=n<90||n>270;if(+front!==cur){cur=+front;const u=front?srcF:srcB;Fi.src=u;Fg.style.webkitMaskImage=Fg.style.maskImage=`url("${u}")`}
    F.style.transform=front?'none':'scaleX(-1)';
    const g=(50+Math.sin(ry*Math.PI/180)*60).toFixed(1)+'%';F.style.setProperty('--g',g);
    el.style.setProperty('--sh',(.75+.25*Math.abs(Math.cos(ry*Math.PI/180))).toFixed(3))}
  function frame(t){raf=0;const dt=Math.min(.05,(t-(last||t))/1000);last=t;clock+=dt;
    tx+=(px-tx)*Math.min(1,dt*4);ty+=(py-ty)*Math.min(1,dt*4);
    if(!drag){if(flip){flip.t+=RM?1:dt/1.1;const k=ease(Math.min(1,flip.t));a=flip.a0+(flip.a1-flip.a0)*k;if(flip.t>=1){a=flip.a1;flip=null;side=0}}
      else if(!RM&&!document.documentElement.classList.contains('axon-calm')){side+=dt;if(side>3.6){flip={a0:a,a1:Math.round(a/180)*180+180,t:0}}}}
    put();if(vis&&(room.classList.contains('is-on')||room.classList.contains('is-leaving'))&&!document.hidden)raf=requestAnimationFrame(frame);else last=0}
  const go=()=>{if(!raf&&vis)raf=requestAnimationFrame(frame)};
  el.addEventListener('pointerdown',e=>{e.preventDefault();flip=null;drag={x:e.clientX,a};el.classList.add('is-drag');el.setPointerCapture(e.pointerId)});
  el.addEventListener('pointermove',e=>{if(drag){a=drag.a+(e.clientX-drag.x)*.6;side=0;go();return}if(e.pointerType==='mouse'){const r=el.getBoundingClientRect();px=((e.clientX-r.left)/r.width-.5)*2;py=((e.clientY-r.top)/r.height-.5)*2;go()}});
  el.addEventListener('pointerleave',()=>{px=py=0});
  const end=()=>{if(!drag)return;drag=null;el.classList.remove('is-drag');flip={a0:a,a1:Math.round(a/180)*180,t:.0};side=0;go()};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
  const say=a1=>{const n=((a1%360)+360)%360,f=n<90||n>270;if(stEl&&+f!==shown){shown=+f;stEl.textContent=f?'מוצגת החזית':'מוצג הגב'}};
  el.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'||e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();flip={a0:a,a1:Math.round(a/180)*180+(e.key==='ArrowLeft'?-180:180),t:0};say(flip.a1);go()}});
  el.__set=x=>{a=x;flip=null;side=-1e9;put()};
  new IntersectionObserver(es=>{vis=es[0].isIntersecting;go()}).observe(room);
  new MutationObserver(go).observe(room,{attributes:true,attributeFilter:['class']});
  document.addEventListener('visibilitychange',go);put()})();

/* idle sections: pause decorative animations when a section is well outside the viewport */
(function(){if(!('IntersectionObserver' in window))return;
  const els=[...document.querySelectorAll('#collabs,.stage>.frame,.foot2__frame')];
  const io=new IntersectionObserver(es=>{for(const e of es)e.target.classList.toggle('is-idle',!e.isIntersecting)},{rootMargin:'300px 0px'});
  els.forEach(el=>io.observe(el))})();

/* decode sponsor images ahead of time so the first switch to a slide doesn't stall */
(function(){const run=()=>{const imgs=[...document.querySelectorAll('#collabs img')];let i=0;
  const next=()=>{if(i>=imgs.length)return;const im=imgs[i++];(im.decode?im.decode():Promise.resolve()).catch(()=>{}).then(()=>setTimeout(next,60))};next()};
  ('requestIdleCallback' in window)?requestIdleCallback(run,{timeout:3000}):setTimeout(run,1500)})();

/* sponsor quick menu: one chip per sponsor, mirrors the dots */
(function(){const m=document.getElementById('tmenu');if(!m)return;const dots=[...document.querySelectorAll('#collabs .tdot')];
  const C=['#ffb88a','#ffd23a','#c9b0ff','#5ff7e6'],N={'LÜZ X SVR':'LÜZ'};
  const bs=dots.map((d,i)=>{const b=document.createElement('button');b.type='button';b.className='tmenu__b';b.style.setProperty('--c',C[i%C.length]);
    const lab=d.getAttribute('aria-label')||'';b.innerHTML='<i aria-hidden="true"></i>';b.append(N[lab]||lab);b.setAttribute('aria-label','מעבר ל'+lab);
    b.addEventListener('click',()=>d.click());m.appendChild(b);return b});
  const sync=()=>dots.forEach((d,i)=>{const v=d.getAttribute('aria-current')==='true'?'true':'false';if(bs[i].getAttribute('aria-current')===v)return;bs[i].setAttribute('aria-current',v);if(v==='true'&&m.scrollWidth>m.clientWidth)m.scrollTo({left:bs[i].offsetLeft-(m.clientWidth-bs[i].offsetWidth)/2,behavior:'smooth'})});
  const mo=new MutationObserver(sync);dots.forEach(d=>mo.observe(d,{attributes:true,attributeFilter:['aria-current']}));sync()})();

/* CardPull hero pack: tilt + glare follow the pointer */
(function(){const sl=document.querySelector('.spw--cards'),t=sl&&sl.querySelector('.cpk__tilt');if(!t||!matchMedia('(pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let raf=0,ev=null;const set=(k,v)=>t.style.setProperty(k,v);
  sl.addEventListener('pointermove',e=>{ev=e;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=t.getBoundingClientRect(),dx=(ev.clientX-(r.left+r.width/2))/innerWidth,dy=(ev.clientY-(r.top+r.height/2))/innerHeight;
    set('--ry',(dx*30).toFixed(2)+'deg');set('--rx',(-dy*18).toFixed(2)+'deg');set('--gx',(50+dx*110).toFixed(1)+'%');set('--gy',(30+dy*90).toFixed(1)+'%')})});
  sl.addEventListener('pointerleave',()=>{set('--ry','0deg');set('--rx','0deg');set('--gx','50%');set('--gy','30%')})})();

/* auto downgrade: full → balanced below ~48fps, balanced → lite below ~38fps (3 s in a row, after a 2 s warm-up),
   measured only while the hero or the sponsor tour is on screen. Never upgrades; stored for this tab only. */
(function(){const H=document.documentElement;if(H.dataset.perf==='lite')return;
  const zones=[document.getElementById('collabs'),document.getElementById('top')].filter(Boolean);let vis=0,r=0,frames=0,t0=0,bad=0,warm=2;
  const set=t=>{H.dataset.perf=t;if(t==='lite')H.classList.add('lite');try{sessionStorage.setItem('osvr-perf',t)}catch(_){}};
  const io=new IntersectionObserver(es=>{for(const e of es)vis+=e.isIntersecting?1:-1;vis=Math.max(0,vis);if(vis&&!r&&!document.hidden){t0=0;frames=0;warm=2;r=requestAnimationFrame(tick)}},{threshold:.5});zones.forEach(z=>io.observe(z));
  function tick(t){if(!vis||document.hidden){r=0;return}if(!t0){t0=t;frames=0;r=requestAnimationFrame(tick);return}frames++;
    if(t-t0>=1000){const fps=frames*1000/(t-t0);t0=t;frames=0;
      if(warm>0){warm--}else{const lim=H.dataset.perf==='full'?48:38;bad=fps<lim?bad+1:0;
        if(bad>=3){bad=0;warm=2;set(H.dataset.perf==='full'?'balanced':'lite');if(H.dataset.perf==='lite'){io.disconnect();r=0;return}}}}
    r=requestAnimationFrame(tick)}
})();
/* first time the tour is reached, nudge the next arrow */
(function(){const t=document.querySelector('#collabs .tour')||document.getElementById('collabs');if(!t)return;const T=t.classList.contains('tour')?t:t.querySelector('.tour');if(!T)return;
  const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){T.classList.add('is-new');setTimeout(()=>T.classList.remove('is-new'),6000);io.disconnect()}},{threshold:.6});io.observe(T)})();

/* perf probe (off by default). Run osvrPerf() in the console, or open the page with #perf.
   Scrolls the page and reports long frames per section. */
window.osvrPerf=function(ms){ms=ms||8000;
  const secs=[...document.querySelectorAll('#top,#collabs,.stage>.frame,.foot2')];
  const tops=secs.map(el=>[el.getBoundingClientRect().top+scrollY,el.id||el.className.split(' ')[0]]);const name=y=>{let n='?';for(const[t,k]of tops)if(y+innerHeight/2>=t)n=k;return n};
  const H=document.documentElement.scrollHeight-innerHeight,st={},de=document.documentElement,sb=de.style.scrollBehavior;let last=0,t0=0;
  const go=y=>{if(typeof lenis!=='undefined'&&lenis)lenis.scrollTo(y,{immediate:true,force:true});else scrollTo(0,y)};de.style.scrollBehavior='auto';
  return new Promise(res=>{go(0);requestAnimationFrame(function f(t){if(!t0)t0=last=t;const dt=t-last;last=t;
    const y=scrollY,k=name(y),o=st[k]||(st[k]={frames:0,long:0,worst:0,sum:0});o.frames++;o.sum+=dt;if(dt>20)o.long++;o.worst=Math.max(o.worst,dt);
    if(t-t0<ms){go((t-t0)/ms*H);requestAnimationFrame(f)}
    else{const rows=Object.entries(st).map(([k,o])=>({section:k,avgMs:+(o.sum/o.frames).toFixed(1),fps:Math.round(1000/(o.sum/o.frames)),longFrames:o.long,worstMs:Math.round(o.worst)})).sort((a,b)=>b.longFrames-a.longFrames);
      de.style.scrollBehavior=sb;console.table(rows);res(rows)}})})};
if(location.hash==='#perf')addEventListener('load',()=>setTimeout(()=>osvrPerf(),1200));
