"use client";

import {useLayoutEffect,useRef} from "react";
import Logo from "./logo";
import {INTRO_DURATION,INTRO_HANDOFF,INTRO_STORAGE_KEY,INTRO_RECENTER,shouldPlayIntro,handoffGeometry,cursorPose} from "@/lib/intro.mjs";

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
  timers.push(window.setTimeout(stopTracking,INTRO_RECENTER));
  timers.push(window.setTimeout(finish,INTRO_DURATION));
  return ()=>{finished=true;cleanup();};
 },[]);
 return <dialog ref={dialogRef} className="lutic-intro" aria-label="Lutic welcome animation. Press Escape to continue to the homepage.">
  <div className="lutic-intro-backdrop" aria-hidden="true"/>
  <div className="lutic-intro-wordmark" aria-hidden="true">Lutic</div>
  <div className="lutic-intro-logo-anchor" ref={logoRef} aria-hidden="true"><div className="lutic-intro-logo-travel"><div className="lutic-intro-logo-follow" ref={followRef}><div className="lutic-intro-logo-art"><Logo/></div></div></div></div>
 </dialog>;
}
