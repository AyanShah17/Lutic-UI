"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {SCENES,SCENE_SECONDS,REEL_SECONDS,reelPosition,advanceReel,chapterPreview,stageProgress} from "@/lib/studio-reel.mjs";

function Mark({size=32}){
 return <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden="true"><polygon points="156.4,120.5 110.4,159.1 54,138.6 43.6,79.5 89.6,40.9 146,61.4" fill="#ee5414" stroke="#ee5414" strokeWidth="34" strokeLinejoin="round"/><circle cx="100" cy="100" r="52" fill="#101012"/><ellipse cx="82" cy="106" rx="6.5" ry="8.5" fill="#fff"/><ellipse cx="118" cy="97" rx="6.5" ry="8.5" fill="#fff"/></svg>;
}
function Icon({name,size=18}){
 const paths={file:"M6 3h8l4 4v14H6zM14 3v5h5M9 13h6m-6 4h6",spark:"M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z",check:"M5 12l4 4L19 6",clock:"M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",link:"M9 7H6a5 5 0 0 0 0 10h3m6-10h3a5 5 0 0 1 0 10h-3m-7-5h8",shield:"M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6",chart:"M3 3v18h18M6 16l4-5 4 3 6-8",layers:"M12 3l9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5",arrow:"M5 12h14m-6-6 6 6-6 6"};
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]||paths.spark}/></svg>;
}
function Reveal({p,n=0,children,className=""}){
 const q=stageProgress(p,n);
 return <div className={"sr-reveal "+className} style={{opacity:.2+.8*q,transform:"translateY("+((1-q)*8)+"px)"}}>{children}</div>;
}
function Status({done,children}){
 return <span className={"sr-status "+(done?"done":"")}><Icon name={done?"check":"clock"} size={13}/>{children}</span>;
}
function Visual({scene,p}){
 const a=stageProgress(p,0),b=stageProgress(p,1),c=stageProgress(p,2);
 if(scene.key==="solutions")return <div className="sr-app sr-assistant">
  <div className="sr-app-head"><Mark size={25}/><strong>Knowledge assistant</strong><span className="sr-app-meta">01 / ASK</span></div>
  <Reveal p={p}><div className="sr-question">What is our onboarding process?</div></Reveal>
  <Reveal p={p} n={1}><div className="sr-source-row"><Icon name="file"/> <span>Onboarding guide</span><Icon name="file"/> <span>Team handbook</span></div></Reveal>
  <Reveal p={p} n={2}><div className="sr-answer"><Mark size={24}/><div><strong>Start with account setup.</strong><p>Then complete your team orientation and access checklist.</p><span className="sr-source-tag"><Icon name="check" size={12}/> Sources attached</span></div></div></Reveal>
 </div>;
 if(scene.key==="automation")return <div className="sr-app sr-workflow">
  <div className="sr-app-head"><Mark size={25}/><strong>Workflow execution</strong><span className="sr-app-meta">02 / RUN</span></div>
  <div className="sr-task"><span>REQUEST</span><strong>Prepare a customer follow-up</strong></div>
  {["Identify the customer","Retrieve order context","Prepare response"].map((x,i)=><div key={x} className="sr-task-row"><div className={"sr-task-icon "+(stageProgress(p,i)>.65?"ready":"")}><Icon name={stageProgress(p,i)>.65?"check":"clock"} size={16}/></div><span>{x}</span><span className="sr-task-state">{stageProgress(p,i)>.65?"Complete":"Queued"}</span></div>)}
  <Reveal p={p} n={2}><div className="sr-approval"><Icon name="shield"/><span>Approval required before sending</span></div></Reveal>
 </div>;
 if(scene.key==="autonomy")return <div className="sr-orbit">
  <svg viewBox="0 0 320 190" className="sr-orbit-lines" aria-hidden="true"><ellipse cx="160" cy="95" rx="111" ry="66" fill="none" className="sr-orbit-base"/><ellipse cx="160" cy="95" rx="111" ry="66" fill="none" className="sr-orbit-flow" pathLength="1" strokeDasharray="1" strokeDashoffset={1-Math.min(1,p*1.25)} transform="rotate(-90 160 95)"/></svg>
  <div className="sr-orbit-center"><Mark size={72}/><span>POLICY ENGINE</span></div>
  {["Observe","Decide","Act","Verify"].map((x,i)=><div key={x} className={"sr-orbit-node sr-orbit-"+i+(p>=i*.22?" lit":"")}><Icon name={["spark","shield","arrow","check"][i]} size={15}/>{x}</div>)}
  <div className="sr-orbit-note"><Icon name="shield" size={13}/> Defined boundaries · human escalation</div>
 </div>;
 if(scene.key==="consulting")return <div className="sr-app sr-eval">
  <div className="sr-app-head"><Icon name="layers"/><strong>Release readiness</strong><span className="sr-app-meta">04 / SHIP</span></div>
  <div className="sr-eval-title">Production review <span>Illustrative checklist</span></div>
  {[["Architecture","System boundaries"],["Evaluation","Quality and safety"],["Operations","Monitoring and rollback"]].map(([x,y],i)=><div className="sr-eval-row" key={x}><div><strong>{x}</strong><small>{y}</small></div><div className="sr-eval-track"><i style={{width:(stageProgress(p,i)*100)+"%"}}/></div><Status done={stageProgress(p,i)>.9}>{stageProgress(p,i)>.9?"Ready":"Review"}</Status></div>)}
  <Reveal p={p} n={2}><div className="sr-approval"><Icon name="shield"/> <span>Human release decision</span></div></Reveal>
 </div>;
 if(scene.key==="integrations")return <div className="sr-integration">
  <div className="sr-connector-column">{[["CRM","Records"],["Knowledge","Documents"]].map(([x,y],i)=><div className="sr-connector" key={x}><Icon name={i?"file":"layers"}/><div><strong>{x}</strong><small>{y}</small></div></div>)}</div>
  <div className="sr-connect-middle"><svg viewBox="0 0 120 160" preserveAspectRatio="none" aria-hidden="true"><path d="M0 35H22Q36 35 36 53V80H60M0 125H22Q36 125 36 107V80H60M60 80H84V53Q84 35 98 35H120M60 80H84V107Q84 125 98 125H120" fill="none" className="sr-orbit-base"/><path d="M0 35H22Q36 35 36 53V80H60M0 125H22Q36 125 36 107V80H60M60 80H84V53Q84 35 98 35H120M60 80H84V107Q84 125 98 125H120" pathLength="1" strokeDasharray="1" strokeDashoffset={1-Math.min(1,p*1.25)} fill="none" className="sr-orbit-flow"/></svg><div className="sr-connect-logo"><Mark size={57}/></div></div>
  <div className="sr-connector-column">{[["Business API","Validated calls"],["Audit log","Action traces"]].map(([x,y],i)=><div className="sr-connector" key={x}><Icon name={i?"shield":"link"}/><div><strong>{x}</strong><small>{y}</small></div></div>)}</div>
  <div className="sr-integration-note"><Icon name="shield" size={14}/> Scoped access. Validated actions.</div>
 </div>;
 return <div className="sr-app sr-health">
  <div className="sr-app-head"><Icon name="chart"/><strong>AI service health</strong><span className="sr-app-meta">06 / MONITOR</span></div>
  <div className="sr-health-legend"><span>Workflow signal</span><span>Illustrative</span></div>
  <svg className="sr-health-chart" viewBox="0 0 300 85" preserveAspectRatio="none" aria-hidden="true"><path d="M0 15H300M0 40H300M0 65H300" className="sr-orbit-base" fill="none"/><path d="M0 42L28 38 56 43 84 29 112 35 140 70 168 44 196 37 224 34 252 27 300 22" className="sr-orbit-flow" pathLength="1" strokeDasharray="1" strokeDashoffset={1-a} fill="none"/><circle cx="140" cy="70" r="4" fill="#ee5414" opacity={b}/></svg>
  <Reveal p={p} n={1}><div className="sr-task-row"><Icon name="chart"/><span>Investigate signal change</span><span className="sr-task-state">Review</span></div></Reveal>
  <Reveal p={p} n={2}><div className="sr-approval"><Icon name="check"/><span>Validate changes before rollout</span></div></Reveal>
 </div>;
}
export default function StudioReel(){
 const root=useRef(null);
 const [time,setTime]=useState(0),[playing,setPlaying]=useState(false),[visible,setVisible]=useState(false),[reduced,setReduced]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const preference=()=>{setReduced(media.matches);setPlaying(!media.matches);if(media.matches)setTime(t=>chapterPreview(reelPosition(t).index));};
  preference();media.addEventListener?.("change",preference);
  let inView=false;
  const update=()=>setVisible(inView&&!document.hidden);
  const observer=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;update();},{threshold:.12}):null;
  if(observer&&root.current)observer.observe(root.current);else{inView=true;update();}
  document.addEventListener("visibilitychange",update);
  return()=>{observer?.disconnect();media.removeEventListener?.("change",preference);document.removeEventListener("visibilitychange",update);};
 },[]);
 useEffect(()=>{
  if(!playing||!visible)return;
  let last=performance.now(),frame=0;
  const tick=now=>{if(now-last>=32){const delta=Math.min(.15,(now-last)/1000);last=now;setTime(t=>advanceReel(t,delta));}frame=requestAnimationFrame(tick);};
  frame=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(frame);
 },[playing,visible]);
 const {index,progress,step}=reelPosition(time),scene=SCENES[index];
 const select=i=>{setPlaying(false);setTime(chapterPreview((i+SCENES.length)%SCENES.length));};
 const toggle=()=>{if(time>=REEL_SECONDS)setTime(0);setPlaying(v=>!v);};
 return <div className="studio-reel" ref={root} role="region" aria-label="Lutic studio capabilities showcase">
  <div className="sr-top"><span><Mark size={22}/> LUTIC <span className="sr-slash">/</span> STUDIO REEL</span><span className="sr-index">0{index+1} <span>/</span> 06</span></div>
  <div className="sr-stage">
   <div className={"sr-scene "+(playing&&!reduced?"sr-scene-motion":"")} key={scene.key}>
    <div className="sr-scene-copy"><span className="sr-eyebrow">{scene.label}</span><h3>{scene.title}</h3><p>{scene.description}</p></div>
    <div className="sr-visual"><Visual scene={scene} p={reduced?1:progress}/></div>
    <div className="sr-outcome"><span className="sr-outcome-icon"><Icon name={step===2?"check":"spark"} size={15}/></span><span>{step===2?scene.outcome:scene.steps[step]}</span><span className="sr-demo">ILLUSTRATIVE</span></div>
   </div>
  </div>
  <div className="sr-chapters" aria-label="Select a capability">{SCENES.map((s,i)=><button key={s.key} type="button" aria-label={s.label} aria-pressed={i===index} onClick={()=>select(i)} className={i===index?"active":""}><span className="sr-segment"><i style={{width:(i<index?100:i===index?progress*100:0)+"%"}}/></span><span>{s.short}</span></button>)}</div>
  <div className="sr-controls"><div className="sr-player"><button type="button" onClick={()=>select(index-1)} aria-label="Previous capability" className="sr-nav">‹</button><button type="button" className="sr-play" onClick={toggle} aria-label={playing?"Pause showcase":"Play showcase"}>{playing?"Ⅱ":"▶"}</button><button type="button" onClick={()=>select(index+1)} aria-label="Next capability" className="sr-nav">›</button></div><input type="range" aria-label="Showcase timeline" min="0" max={REEL_SECONDS} step=".1" value={time} onChange={e=>{setPlaying(false);setTime(Number(e.target.value));}}/><span className="sr-time">{String(Math.floor(time)).padStart(2,"0")} / {REEL_SECONDS}s</span></div>
  <div className="sr-bottom"><span>Concept demonstrations, not live data.</span><Link href={scene.href}>Explore {scene.short.toLowerCase()} <span aria-hidden="true">↗</span></Link></div>
 </div>;
}
