"use client";

import {useLayoutEffect,useRef} from "react";
import Logo from "./logo";
import {INTRO_DURATION,INTRO_HANDOFF,INTRO_STORAGE_KEY,INTRO_RECENTER,shouldPlayIntro,handoffGeometry,cursorPose,PIXEL_GLYPHS,pixelWordmark,revealProgress} from "@/lib/intro.mjs";

const wordmark=pixelWordmark(PIXEL_GLYPHS);
function PixelWordmark(){
 return <svg className="lutic-intro-pixel-wordmark" viewBox={"0 0 "+wordmark.width+" "+wordmark.height} shapeRendering="crispEdges" aria-hidden="true">
  {wordmark.pixels.map(({x,y,letter})=><rect key={x+"-"+y} x={x} y={y} width="1" height="1" fill="currentColor" className="lutic-intro-pixel" style={{"--pixel-delay":(letter*54+((x*13+y*7)%9)*17)+"ms","--pixel-dx":(wordmark.width/2-x-.5)+"px","--pixel-dy":(wordmark.height/2-y-.5)+"px"}}/>)}
 </svg>;
}
export default function LandingIntro(){
 const dialogRef=useRef(null),logoRef=useRef(null),followRef=useRef(null),travelRef=useRef(null);
 useLayoutEffect(()=>{
  const dialog=dialogRef.current,logo=logoRef.current,follow=followRef.current,travel=travelRef.current;
  if(!dialog||!logo||!follow||!travel||typeof dialog.showModal!=="function")return;
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
  let pointerFrame=0,revealFrame=0,point=null,tracking=true;
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
  // Measure the actual SVG, not the outer hero card. Keep the endpoint current
  // throughout the gate movement, including font swaps, zoom and responsive reflow.
  const measure=()=>{
   const target=hero()?.getBoundingClientRect();
   const visible=target&&target.bottom>0&&target.top<window.innerHeight&&target.right>0&&target.left<window.innerWidth;
   return handoffGeometry(logo.getBoundingClientRect(),visible?target:null);
  };
  const renderReveal=progress=>{
   const g=measure();
   dialog.style.setProperty("--gate-open",(-101*progress)+"%");
   travel.style.transform=g.matched?"translate3d("+(g.x*progress)+"px,"+(g.y*progress)+"px,0) scale("+(1+(g.scale-1)*progress)+")":"translate3d(0,0,0)";
   travel.style.opacity=g.matched?"1":String(1-progress);
  };
  const beginReveal=()=>{
   stopTracking();
   // RAF controls both panels and the mascot using one clock, with a final
   // exact endpoint before swapping to the real hero. No CSS/timer race.
   const started=window.performance.now();
   const tick=now=>{
    if(finished)return;
    const elapsed=now-started,duration=INTRO_DURATION-INTRO_HANDOFF;
    const progress=revealProgress(elapsed,duration);
    renderReveal(progress);
    if(elapsed>=duration){finish();return;}
    revealFrame=window.requestAnimationFrame(tick);
   };
   revealFrame=window.requestAnimationFrame(tick);
  };
  const cleanup=()=>{
   timers.forEach(window.clearTimeout);
   stopTracking();
   dialog.removeEventListener("pointermove",onPointerMove);
   dialog.removeEventListener("pointerleave",resetPose);
   window.removeEventListener("blur",resetPose);
   if(revealFrame)window.cancelAnimationFrame(revealFrame);
   travel.style.removeProperty("transform");
   travel.style.removeProperty("opacity");
   dialog.style.removeProperty("--gate-open");
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
   // Freeze the real mascot at the same neutral pose until normal hover resumes.
   const actual=hero();
   if(actual){actual.style.removeProperty("transform");actual.querySelectorAll("[data-eye]").forEach(eye=>eye.removeAttribute("transform"));}
   cleanup();
   // Do not send focus to the document body or make keyboard users start over.
   if(priorFocus&&priorFocus!==document.body&&priorFocus.isConnected)priorFocus.focus({preventScroll:true});
   else home?.querySelector("h1")?.focus({preventScroll:true});
  };
  const onCancel=e=>{e.preventDefault();finish();};
  const onMotionChange=e=>{if(e.matches)finish();};
  root.classList.add("lutic-intro-active");
  try{dialog.showModal();}catch{cleanup();return;}
  dialog.classList.add("is-playing");
  dialog.addEventListener("pointermove",onPointerMove,{passive:true});
  dialog.addEventListener("pointerleave",resetPose,{passive:true});
  window.addEventListener("blur",resetPose);
  media.addEventListener?.("change",onMotionChange);
  dialog.addEventListener("cancel",onCancel);
  timers.push(window.setTimeout(stopTracking,INTRO_RECENTER));
  timers.push(window.setTimeout(beginReveal,INTRO_HANDOFF));
  // Fail open if a backgrounded browser throttles animation frames.
  timers.push(window.setTimeout(finish,INTRO_DURATION+600));
  return ()=>{finished=true;cleanup();};
 },[]);
 return <dialog ref={dialogRef} className="lutic-intro" aria-label="Lutic welcome animation. Press Escape to continue to the homepage.">
  <div className="lutic-intro-gate" aria-hidden="true"><div className="lutic-intro-gate-panel lutic-intro-gate-left"/><div className="lutic-intro-gate-panel lutic-intro-gate-right"/></div>
  <div className="lutic-intro-wordmark" aria-hidden="true"><PixelWordmark/></div>
  <div className="lutic-intro-logo-anchor" ref={logoRef} aria-hidden="true"><div className="lutic-intro-logo-travel" ref={travelRef}><div className="lutic-intro-logo-follow" ref={followRef}><div className="lutic-intro-logo-art"><Logo/></div></div></div></div>
 </dialog>;
}
