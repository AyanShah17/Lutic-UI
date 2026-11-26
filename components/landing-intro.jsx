"use client";

import {useLayoutEffect,useRef,useState} from "react";
import Logo from "./logo";
import {INTRO_DURATION,INTRO_HANDOFF,INTRO_STORAGE_KEY,INTRO_PHASES,shouldPlayIntro,handoffGeometry} from "@/lib/intro.mjs";

// Six branches, in the same radial arrangement as the approved storyboard.
const nodes=[
 {x:300,y:48,name:"Agents",icon:"M-8 0h16M0-8v16"},
 {x:493,y:103,name:"Applications",icon:"M-8-7h16v14h-16zM-8-2h16"},
 {x:493,y:337,name:"Workflows",icon:"M-8 5l5-5 4 3 7-8"},
 {x:300,y:392,name:"Verification",icon:"M-8 0l5 5 11-11"},
 {x:107,y:337,name:"Data",icon:"M-8-5c0-5 16-5 16 0v10c0 5-16 5-16 0zM-8 0c0 5 16 5 16 0"},
 {x:107,y:103,name:"Integrations",icon:"M-8-4h7v8h-7zM1-4h7v8h-7zM-1 0h2"}
];

function Network(){
 return <svg className="lutic-intro-network" viewBox="0 0 600 440" fill="none" aria-hidden="true">
  <circle className="lutic-intro-ring" cx="300" cy="220" r="118"/>
  <circle className="lutic-intro-ring-outer" cx="300" cy="220" r="145"/>
  {nodes.map(({x,y,name,icon},i)=>{
   const dx=x-300,dy=y-220,d=Math.hypot(dx,dy),sx=300+dx/d*64,sy=220+dy/d*64,ex=x-dx/d*23,ey=y-dy/d*23;
   const path="M"+sx+" "+sy+"L"+ex+" "+ey;
   return <g key={name} className="lutic-intro-branch" style={{"--branch-delay":(i*.12)+"s","--check-delay":(i*.23)+"s"}}>
    <path className="lutic-intro-link" d={path} pathLength="1"/>
    <path className="lutic-intro-pulse" d={path} pathLength="1"/>
    <g transform={"translate("+x+" "+y+")"}>
     <g className="lutic-intro-node">
      <rect className="lutic-intro-node-fill" x="-21" y="-21" width="42" height="42" rx="10"/>
      <path className="lutic-intro-node-icon" d={icon}/>
      <path className="lutic-intro-node-check" d="M-9 0l6 6 12-12" pathLength="1"/>
     </g>
    </g>
   </g>;
  })}
 </svg>;
}

export default function LandingIntro(){
 const dialogRef=useRef(null),logoRef=useRef(null),skipRef=useRef(null),finishRef=useRef(null);
 const [phase,setPhase]=useState(0);
 useLayoutEffect(()=>{
  const dialog=dialogRef.current,logo=logoRef.current;
  if(!dialog||!logo||typeof dialog.showModal!=="function")return;
  const root=document.documentElement;
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  let seen=false;
  try{seen=sessionStorage.getItem(INTRO_STORAGE_KEY)==="1";}catch{}
  if(!shouldPlayIntro({seen,reducedMotion:media.matches,hash:window.location.hash,scrollY:window.scrollY}))return;
  let finished=false;
  const timers=[];
  const priorFocus=document.activeElement;
  const home=document.querySelector("[data-view='home']");
  const hero=()=>home?.querySelector("[data-lutic-hero-mascot] svg");
  const syncTarget=()=>{
   // The outer anchor is never transformed; only its inner artwork animates.
   const target=hero()?.getBoundingClientRect();
   const visible=target&&target.bottom>0&&target.top<window.innerHeight&&target.right>0&&target.left<window.innerWidth;
   const g=handoffGeometry(logo.getBoundingClientRect(),visible?target:null);
   dialog.style.setProperty("--handoff-x",g.x+"px");
   dialog.style.setProperty("--handoff-y",g.y+"px");
   dialog.style.setProperty("--handoff-scale",String(g.scale));
   dialog.dataset.matched=g.matched?"true":"false";
  };
  const cleanup=()=>{
   timers.forEach(window.clearTimeout);
   window.removeEventListener("resize",syncTarget);
   media.removeEventListener?.("change",onMotionChange);
   dialog.removeEventListener("cancel",onCancel);
   root.classList.remove("lutic-intro-active");
   dialog.classList.remove("is-playing");
   if(dialog.open)dialog.close();
   finishRef.current=null;
  };
  const finish=()=>{
   if(finished)return;
   finished=true;
   try{sessionStorage.setItem(INTRO_STORAGE_KEY,"1");}catch{}
   home?.classList.add("lutic-intro-complete");
   cleanup();
   // Do not send focus to the document body or make keyboard users start over.
   if(priorFocus&&priorFocus!==document.body&&priorFocus.isConnected)priorFocus.focus({preventScroll:true});
   else document.querySelector("[data-view='home'] h1")?.focus({preventScroll:true});
  };
  const onCancel=e=>{e.preventDefault();finish();};
  const onMotionChange=e=>{if(e.matches)finish();};
  finishRef.current=finish;
  root.classList.add("lutic-intro-active");
  try{dialog.showModal();}catch{cleanup();return;}
  syncTarget();
  dialog.classList.add("is-playing");
  skipRef.current?.focus({preventScroll:true});
  window.addEventListener("resize",syncTarget,{passive:true});
  media.addEventListener?.("change",onMotionChange);
  dialog.addEventListener("cancel",onCancel);
  // Re-measure after fonts/layout have settled and immediately before handoff.
  timers.push(window.setTimeout(syncTarget,INTRO_HANDOFF-50));
  INTRO_PHASES.slice(1).forEach((p,i)=>timers.push(window.setTimeout(()=>setPhase(i+1),p.start)));
  timers.push(window.setTimeout(finish,INTRO_DURATION));
  return ()=>{finished=true;cleanup();};
 },[]);
 const current=INTRO_PHASES[phase];
 return <dialog ref={dialogRef} className="lutic-intro" aria-label="Lutic welcome animation">
  <div className="lutic-intro-backdrop" aria-hidden="true"/>
  <div className="lutic-intro-brand" aria-hidden="true"><span className="lutic-intro-wordmark">Lutic<span>.</span></span><span>Independent AI studio</span></div>
  <button ref={skipRef} type="button" className="lutic-intro-skip" onClick={()=>finishRef.current?.()}>Skip intro <span aria-hidden="true">↗</span></button>
  <div className="lutic-intro-stage" aria-hidden="true"><Network/></div>
  <div className="lutic-intro-logo-anchor" ref={logoRef} aria-hidden="true"><div className="lutic-intro-logo-travel"><div className="lutic-intro-logo-art"><Logo/></div></div></div>
  <div className="lutic-intro-caption" aria-hidden="true">
   <div className="lutic-intro-phase"><span>0{phase+1} / 04</span><span className="lutic-intro-phase-dot"/></div>
   <div className="lutic-intro-caption-copy" key={current.label}><strong>{current.label}</strong><p>{current.detail}</p></div>
   <div className="lutic-intro-progress"><span/></div>
  </div>
 </dialog>;
}
