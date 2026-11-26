"use client";
import {useEffect} from "react";
/* Original Lutic animation choreography, scoped to each route and cleaned up on navigation. */
export default function Motion({page}) {
  useEffect(()=>{
    const root=document.querySelector('[data-view="'+page+'"]');
    if(!root)return;
    root.classList.add("motion-ready");
    const controller=new AbortController(),frames=new Set(),intervals=new Set(),timeouts=new Set(),observers=[];
    const on=(target,event,fn,options={})=>target.addEventListener(event,fn,{...options,signal:controller.signal});
    const addEventListener=(event,fn,options)=>on(window,event,fn,options);
    const requestAnimationFrame=fn=>{let id=window.requestAnimationFrame(t=>{frames.delete(id);if(!controller.signal.aborted)fn(t)});frames.add(id);return id};
    const setInterval=(fn,ms)=>{const id=window.setInterval(fn,ms);intervals.add(id);return id};
    const setTimeout=(fn,ms)=>{const id=window.setTimeout(()=>{timeouts.delete(id);fn()},ms);timeouts.add(id);return id};
    const IntersectionObserver=class extends window.IntersectionObserver{constructor(fn,opts){super(fn,opts);observers.push(this)}};
const $=(s,r=document)=>[...r.querySelectorAll(s)],rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
// scroll progress bar
const pb=document.querySelector('.bar-top');
addEventListener('scroll',()=>{if(pb)pb.style.width=Math.max(0,Math.min(100,scrollY/Math.max(1,document.body.scrollHeight-innerHeight)*100))+'%'},{passive:true});
// eye tracking: the logo watches the cursor
const eyes=$('[data-eye]');
addEventListener('pointermove',e=>{if(rm||document.documentElement.classList.contains('lutic-intro-active'))return;$('svg.logo').forEach(s=>{const b=s.getBoundingClientRect();if(!b.width)return;
 const dx=e.clientX-(b.left+b.width/2),dy=e.clientY-(b.top+b.height/2),d=Math.hypot(dx,dy)||1,k=Math.min(8,d/40);
 $('[data-eye]',s).forEach(g=>g.setAttribute('transform',`translate(${dx/d*k} ${dy/d*k})`))})});
// hero mascot parallax + scroll spin
const m=document.querySelector('.mascot svg'),chips=$('.mascot .chip');
let mx=0,my=0;
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;frame()});
addEventListener('scroll',frame,{passive:true});
function frame(){if(!m||rm||document.documentElement.classList.contains('lutic-intro-active'))return;const s=Math.min(scrollY,900);
 m.style.transform=`perspective(900px) rotateY(${mx*16}deg) rotateX(${-my*16}deg) rotate(${s*.08}deg) scale(${1-s/2400})`;
 chips.forEach((c,i)=>c.style.transform=`translate(${mx*(30+i*20)}px,${my*(30+i*20)-s*(.1+i*.08)}px)`)}
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.25});
$('.rv,.vis').forEach(x=>io.observe(x));
// counters
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);
 const t=+e.target.dataset.n,suf=e.target.dataset.s||'',t0=performance.now();if(rm){e.target.textContent=t+suf;return;}
 (function f(n){const p=Math.min(1,(n-t0)/1400);e.target.textContent=Math.round(t*(1-Math.pow(1-p,4)))+suf;p<1&&requestAnimationFrame(f)})(t0)}),{threshold:.6});
$('[data-n]').forEach(x=>cio.observe(x));
// card tilt
$('.card').forEach(c=>{on(c,'pointermove',e=>{if(rm)return;const b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
 c.style.transform=`perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`});on(c,'pointerleave',()=>c.style.transform='')});
// scrubbed statement
const sc=document.querySelector('.scrub');
if(sc&&!rm){sc.innerHTML=sc.textContent.split(' ').map(w=>`<span>${w}</span>`).join(' ');const ws=$('span',sc);
 const f=()=>{const b=sc.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.85-b.top)/(innerHeight*.6+b.height)));ws.forEach((w,i)=>w.classList.toggle('on',i/ws.length<p))};
 addEventListener('scroll',f,{passive:true});f()}
// pinned pipeline story
const st=document.querySelector('.story');
if(st&&!rm){const li=$('.steps li',st),lines=$('.term div',st),bar=$('.bar',st)[0];
 const f=()=>{const b=st.getBoundingClientRect(),p=Math.min(.999,Math.max(0,-b.top/(b.height-innerHeight))),i=Math.floor(p*li.length);
 li.forEach((x,j)=>x.classList.toggle('on',j===i));lines.forEach(l=>l.classList.toggle('on',+l.dataset.s<=i));bar.style.width=p*100+'%'};
 addEventListener('scroll',f,{passive:true});f()}
const rmq=matchMedia('(prefers-reduced-motion:reduce)').matches,P={x:-999,y:-999};
addEventListener('pointermove',e=>{P.x=e.clientX;P.y=e.clientY},{passive:true});
function loopWhenVisible(el,draw){let vis=false,raf=0;const f=t=>{raf=0;if(!vis)return;draw(t);if(!rmq)raf=requestAnimationFrame(f)};new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(f)}).observe(el)}
(()=>{const c=document.getElementById('kg');if(!c)return;const x=c.getContext('2d');let W,H,D=Math.min(2,devicePixelRatio||1),col='16,16,18';
const rs=()=>{const b=c.getBoundingClientRect();W=b.width;H=b.height;c.width=W*D;c.height=H*D;col=matchMedia('(prefers-color-scheme:dark)').matches?'244,244,242':'16,16,18'};rs();addEventListener('resize',rs);
loopWhenVisible(c,t=>{const b=c.getBoundingClientRect(),px=P.x-b.left,py=P.y-b.top,g=36;x.setTransform(D,0,0,D,0,0);x.clearRect(0,0,W,H);
for(let i=g/2;i<W;i+=g)for(let j=g/2;j<H;j+=g){const dx=i-px,dy=j-py,d=Math.hypot(dx,dy),k=Math.max(0,1-d/190),w=rmq?0:Math.sin(t/900+i*.012+j*.015)*1.2,ox=d?dx/d*k*k*26:0,oy=d?dy/d*k*k*26:0;x.beginPath();x.arc(i+ox,j+oy+w,1.4+k*3.2,0,6.283);x.fillStyle=k>.02?`rgba(238,84,20,${.35+k*.65})`:`rgba(${col},.18)`;x.fill()}})})();
(()=>{const c=document.getElementById('bh');if(!c)return;const x=c.getContext('2d');let W,H,D=Math.min(2,devicePixelRatio||1),last=0;const ps=Array.from({length:170},()=>({a:Math.random()*6.283,r:80+Math.random()*420,s:.4+Math.random()*.9}));
const rs=()=>{const b=c.getBoundingClientRect();W=b.width;H=b.height;c.width=W*D;c.height=H*D};rs();addEventListener('resize',rs);
loopWhenVisible(c,t=>{const dt=Math.min(.05,(t-last)/1000||0);last=t;const b=c.getBoundingClientRect();let cx=W/2,cy=H/2;if(P.x>b.left&&P.x<b.right&&P.y>b.top&&P.y<b.bottom){cx+=(P.x-b.left-cx)*.25;cy+=(P.y-b.top-cy)*.25}x.setTransform(D,0,0,D,0,0);x.clearRect(0,0,W,H);
ps.forEach(p=>{if(!rmq){p.a+=dt*p.s*(260/p.r)*1.4;p.r-=dt*14*p.s}if(p.r<36){p.r=300+Math.random()*180;p.a=Math.random()*6.283}const al=Math.min(1,p.r/160)*.55;x.fillStyle=p.r<120?`rgba(238,84,20,${al+.2})`:`rgba(150,150,158,${al})`;x.beginPath();x.arc(cx+Math.cos(p.a)*p.r*1.6,cy+Math.sin(p.a)*p.r*.5,1.2+(1-Math.min(1,p.r/400))*1.8,0,6.283);x.fill()})})})();
addEventListener('pointermove',e=>{if(rmq)return;document.querySelectorAll('.btn').forEach(b=>{const r=b.getBoundingClientRect();if(!r.width)return;const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);b.style.transform=Math.hypot(dx,dy)<90?`translate(${dx*.22}px,${dy*.3}px)`:''})},{passive:true});
const rt=document.getElementById('rot');if(rt&&!rmq){const L=['AI solutions','agentic automations','autonomous systems','AI integrations','production consulting','AI support'];let i=0;setInterval(()=>{rt.classList.add('o');setTimeout(()=>{i=(i+1)%L.length;rt.textContent=L[i];rt.classList.remove('o')},380)},2600)}
document.querySelectorAll('.gal').forEach(g=>{const ps=[...g.children],set=p=>ps.forEach(q=>q.classList.toggle('on',q===p));ps.forEach(p=>{on(p,'pointerenter',()=>set(p));on(p,'focus',()=>set(p))});set(ps[0])});

    return ()=>{
      controller.abort();frames.forEach(id=>window.cancelAnimationFrame(id));intervals.forEach(id=>window.clearInterval(id));timeouts.forEach(id=>window.clearTimeout(id));observers.forEach(o=>o.disconnect());
      root.classList.remove("motion-ready");
      document.querySelectorAll(".btn").forEach(b=>b.style.removeProperty("transform"));
      if(pb)pb.style.width="0";
    };
  },[page]);
  return null;
}
