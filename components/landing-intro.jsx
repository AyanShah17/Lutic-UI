"use client";

import {useLayoutEffect,useRef} from "react";
import Logo from "./logo";
import {INTRO_DURATION,INTRO_HANDOFF,INTRO_STORAGE_KEY,INTRO_PHASES,shouldPlayIntro,handoffGeometry,cursorPose} from "@/lib/intro.mjs";

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
   return <g key={name} className="lutic-intro-branch" style={{"--branch-delay":(i*.096)+"s","--check-delay":(i*.184)+"s"}}>
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
 const dialogRef=useRef(null),logoRef=useRef(null),followRef=useRef(null);
 useLayoutEffect(()=>{
  const dialog=dialogRef.current,logo=logoRef.current,follow=followRef.current;
  if(!dialog||!logo||!follow||typeof dialog.showModal!=="function")return;
  const root=document.documentElement;
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  let seen=false;
  try{seen=sessionStorage.getItem(INTRO_STORAGE_KEY)==="1";}catch{}
  const navigation=window.performance.getEntriesByType?.("navigation")?.[0];
  // Navigation Timing stays unchanged during SPA transitions; consume the reload
  // override only on the first homepage mount of this document.
  const reload=navigation?.type==="reload"&&new URL(navigation.name).pathname==="/"&&!root.hasAttribute("data-lutic-intro-reload-consumed");
  if(!shouldPlayIntro({seen,reducedMotion:media.matches,hash:window.location.hash,scrollY:window.scrollY,reload}))return;
  if(reload){
   // The landing animation must reveal the top of the homepage, not restored scroll.
   window.scrollTo({top:0,left:0,behavior:"instant"});
  }
  let finished=false;
  const timers=[];
  const priorFocus=document.activeElement;
  const home=document.querySelector("[data-view='home']");
  const hero=()=>home?.querySelector("[data-lutic-hero-mascot] svg");
  const eyes=[...follow.querySelectorAll("[data-eye]")];
  let pointerFrame=0,point=null,tracking=true;
  const setPose=({x,y,eyeX,eyeY})=>{
   follow.style.setProperty("--cursor-x",x+"px");
   follow.style.setProperty("--cursor-y",y+"px");
   eyes.forEach(eye=>{eye.style.setProperty("--eye-x",eyeX+"px");eye.style.setProperty("--eye-y",eyeY+"px");});
  };
  const resetPose=()=>{
   if(pointerFrame)window.cancelAnimationFrame(pointerFrame);
   pointerFrame=0;point=null;setPose({x:0,y:0,eyeX:0,eyeY:0});
  };
  const onPointerMove=e=>{
   if(!tracking||e.pointerType==="touch")return;
   point={x:e.clientX,y:e.clientY};
   if(pointerFrame)return;
   pointerFrame=window.requestAnimationFrame(()=>{
    pointerFrame=0;if(!tracking||!point)return;
    const r=logo.getBoundingClientRect();
    setPose(cursorPose(point.x-r.left-r.width/2,point.y-r.top-r.height/2,r.width));
   });
  };
  const stopTracking=()=>{tracking=false;resetPose();};
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
   stopTracking();
   dialog.removeEventListener("pointermove",onPointerMove);
   dialog.removeEventListener("pointerleave",resetPose);
   window.removeEventListener("blur",resetPose);
   window.removeEventListener("resize",syncTarget);
   media.removeEventListener?.("change",onMotionChange);
   dialog.removeEventListener("cancel",onCancel);
   root.classList.remove("lutic-intro-active");
   dialog.classList.remove("is-playing");
   if(dialog.open)dialog.close();
  };
  const finish=()=>{
   if(finished)return;
   finished=true;
   try{sessionStorage.setItem(INTRO_STORAGE_KEY,"1");}catch{}
   if(reload)root.setAttribute("data-lutic-intro-reload-consumed","");
   home?.classList.add("lutic-intro-complete");
   cleanup();
   // Do not send focus to the document body or make keyboard users start over.
   if(priorFocus&&priorFocus!==document.body&&priorFocus.isConnected)priorFocus.focus({preventScroll:true});
   else home?.querySelector("h1")?.focus({preventScroll:true});
  };
  const onCancel=e=>{e.preventDefault();finish();};
  const onMotionChange=e=>{if(e.matches)finish();};
  root.classList.add("lutic-intro-active");
  try{dialog.showModal();}catch{cleanup();return;}
  syncTarget();
  dialog.classList.add("is-playing");
  dialog.addEventListener("pointermove",onPointerMove,{passive:true});
  dialog.addEventListener("pointerleave",resetPose,{passive:true});
  window.addEventListener("blur",resetPose);
  window.addEventListener("resize",syncTarget,{passive:true});
  media.addEventListener?.("change",onMotionChange);
  dialog.addEventListener("cancel",onCancel);
  // Re-measure after fonts/layout have settled and immediately before handoff.
  timers.push(window.setTimeout(syncTarget,INTRO_HANDOFF-50));
  // Recenter before the final travel animation so cursor movement never shifts the landing point.
  timers.push(window.setTimeout(stopTracking,INTRO_PHASES[3].start));
  timers.push(window.setTimeout(finish,INTRO_DURATION));
  return ()=>{finished=true;cleanup();};
 },[]);
 return <dialog ref={dialogRef} className="lutic-intro" aria-label="Lutic welcome animation. Press Escape to continue to the homepage.">
  <div className="lutic-intro-backdrop" aria-hidden="true"/>
  <div className="lutic-intro-brand" aria-hidden="true"><span className="lutic-intro-wordmark">Lutic<span>.</span></span><span>Independent AI studio</span></div>
  <div className="lutic-intro-stage" aria-hidden="true"><Network/></div>
  <div className="lutic-intro-logo-anchor" ref={logoRef} aria-hidden="true"><div className="lutic-intro-logo-travel"><div className="lutic-intro-logo-follow" ref={followRef}><div className="lutic-intro-logo-art"><Logo/></div></div></div></div>
 </dialog>;
}
