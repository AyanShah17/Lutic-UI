"use client";
import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {SCENES,SCENE_SECONDS,REEL_SECONDS,reelPosition,advanceReel} from "@/lib/studio-reel.mjs";

const clamp=n=>Math.min(1,Math.max(0,n));
const phase=(p,n)=>clamp((p-n*.31)/.23);
function Node({x,y,w=142,h=64,label,detail,active=false,mark="dot"}){
 return <g className={active?"sr-node sr-node-active":"sr-node"}><rect x={x} y={y} width={w} height={h} rx="13"/><circle cx={x+17} cy={y+19} r="4" className="sr-node-dot"/><text x={x+29} y={y+23} className="sr-node-label">{label}</text>{detail&&<text x={x+15} y={y+44} className="sr-node-detail">{detail}</text>}{mark==="check"&&<path d={"M"+(x+w-23)+" "+(y+43)+"l4 4 7 -8"} className="sr-check"/>}</g>;
}
function Wire({d,progress=1}){
 return <g fill="none" strokeLinecap="round"><path d={d} className="sr-wire-base"/><path d={d} pathLength="1" strokeDasharray="1" strokeDashoffset={1-clamp(progress)} className="sr-wire-live"/></g>;
}
function Core({x=270,y=141,progress=1}){
 return <g transform={"translate("+x+" "+y+")"}><circle r="46" className="sr-core-halo" opacity={.2+.5*progress}/><g transform="scale(.39) translate(-100 -100)"><polygon points="156.4,120.5 110.4,159.1 54,138.6 43.6,79.5 89.6,40.9 146,61.4" fill="#ee5414" stroke="#ee5414" strokeWidth="34" strokeLinejoin="round"/><circle cx="100" cy="100" r="52" fill="#101012"/><ellipse cx="82" cy="106" rx="6.5" ry="8.5" fill="#fff"/><ellipse cx="118" cy="97" rx="6.5" ry="8.5" fill="#fff"/></g></g>;
}
function Diagram({scene,p}){
 const a=phase(p,0),b=phase(p,1),c=phase(p,2);
 return <svg className="sr-diagram" viewBox="0 0 540 282" role="img" aria-label={scene.description}>
 {scene.key==="solutions"?<>
 <Wire d="M162 65H205Q220 65 220 80V102L235 120" progress={a}/><Wire d="M162 217H205Q220 217 220 202V180L235 162" progress={b}/><Wire d="M309 141H375" progress={c}/>
 <Node x={20} y={33} label="Question" detail="Natural language" active={a>.1}/><Node x={20} y={185} label="Knowledge" detail="Approved documents" active={b>.1}/><Core progress={b}/><Node x={375} y={108} w={145} h={74} label="AI answer" detail="Sources attached" active={c>.2} mark={c>.8?"check":"dot"}/>
 </>:scene.key==="automation"?<>
 <Wire d="M111 140H143" progress={a}/><Wire d="M235 140H276" progress={b}/><Wire d="M368 140H407" progress={c}/>
 <Node x={15} y={108} w={96} label="Request" detail="New task" active={a>.1}/><Node x={143} y={108} w={92} label="Plan" detail="Steps" active={a>.6}/><Node x={276} y={108} w={92} label="Tools" detail="Scoped API" active={b>.4}/><Node x={407} y={108} w={118} label="Approval" detail="Human review" active={c>.3}/>
 <Wire d="M322 108V65H270V83" progress={b}/><Core x={270} y={41} progress={b}/><text x="270" y="240" textAnchor="middle" className="sr-caption">Policy checks before consequential actions</text>
 </>:scene.key==="autonomy"?<>
 <Wire d="M196 57H344" progress={a}/><Wire d="M416 89V193" progress={b}/><Wire d="M344 225H196" progress={c}/><Wire d="M124 193V89" progress={c*.9}/>
 <Node x={52} y={25} w={144} label="Observe" detail="Event received" active={a>.1}/><Node x={344} y={25} w={144} label="Decide" detail="Check policy" active={a>.6}/><Node x={344} y={193} w={144} label="Act" detail="Bounded action" active={b>.4}/><Node x={52} y={193} w={144} label="Verify" detail="Check outcome" active={c>.4} mark={c>.8?"check":"dot"}/><Core progress={c}/>
 </>:scene.key==="consulting"?<>
 <Wire d="M154 139H198" progress={a}/><Wire d="M340 139H384" progress={b}/>
 <Node x={12} y={107} label="Architecture" detail="Design review" active={a>.2}/><Node x={198} y={107} label="Evaluation" detail="Quality and safety" active={b>.2}/><Node x={384} y={107} label="Release gate" detail="Go / no-go" active={c>.2} mark={c>.8?"check":"dot"}/>
 <g transform="translate(205 202)">{[.66,.82,.74,.92,.85].map((v,i)=><rect key={i} x={i*27} y={46-46*v*b} width="17" height={Math.max(2,46*v*b)} rx="3" fill={i===3?"#ee5414":"currentColor"} opacity={i===3?1:.32}/>)}</g><text x="270" y="60" textAnchor="middle" className="sr-caption">Design → test → release</text>
 </>:scene.key==="integrations"?<>
 <Wire d="M162 62H205L237 112" progress={a}/><Wire d="M162 220H205L237 170" progress={b}/><Wire d="M303 112L335 62H378" progress={c}/><Wire d="M303 170L335 220H378" progress={c}/>
 <Node x={20} y={30} label="CRM" detail="Scoped access" active={a>.2}/><Node x={20} y={188} label="Knowledge" detail="Read permissions" active={b>.2}/><Core progress={b}/><Node x={378} y={30} label="Business API" detail="Validated calls" active={c>.3}/><Node x={378} y={188} label="Audit log" detail="Trace actions" active={c>.6} mark={c>.8?"check":"dot"}/>
 </>:<>
 <rect x="20" y="24" width="500" height="151" rx="16" className="sr-chart-bg"/><text x="39" y="51" className="sr-node-label">Service health · illustrative</text>
 <path d="M42 82H498M42 113H498M42 144H498" className="sr-wire-base" fill="none"/>
 <path d="M42 125L102 110L160 119L220 87L280 131L344 104L409 91L498 83" className="sr-wire-live" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1-a}/>
 <circle cx="280" cy="131" r="6" fill="#ee5414" opacity={b}/><Wire d="M178 228H198" progress={b}/><Wire d="M340 228H362" progress={c}/>
 <Node x={20} y={196} w={158} label="Monitor" detail="Watch outcomes" active={a>.1}/><Node x={198} y={196} label="Investigate" detail="Review traces" active={b>.2}/><Node x={362} y={196} w={158} label="Improve" detail="Regression test" active={c>.2} mark={c>.8?"check":"dot"}/>
 </>}
 </svg>;
}
export default function StudioReel(){
 const root=useRef(null);
 const [time,setTime]=useState(0),[playing,setPlaying]=useState(false),[visible,setVisible]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const preference=()=>setPlaying(!media.matches);
  preference();media.addEventListener?.("change",preference);
  const element=root.current;
  let inView=false;
  const update=()=>setVisible(inView&&!document.hidden);
  const observer=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;update();},{threshold:.15}):null;
  if(observer&&element)observer.observe(element);else{inView=true;update();}
  document.addEventListener("visibilitychange",update);
  return()=>{observer?.disconnect();media.removeEventListener?.("change",preference);document.removeEventListener("visibilitychange",update);};
 },[]);
 useEffect(()=>{
  if(!playing||!visible)return;
  let last=performance.now();
  const timer=window.setInterval(()=>{const now=performance.now(),delta=Math.min(.25,(now-last)/1000);last=now;setTime(t=>advanceReel(t,delta));},50);
  return()=>window.clearInterval(timer);
 },[playing,visible]);
 const {index,progress,step}=reelPosition(time),scene=SCENES[index];
 const select=i=>{setPlaying(false);setTime(i*SCENE_SECONDS);};
 return <div className="studio-reel" ref={root} role="region" aria-label="Lutic services interactive showcase">
  <div className="sr-top"><span><i/> LUTIC / STUDIO REEL</span><span>0{index+1} / 0{SCENES.length}</span></div>
  <div className="sr-stage">
   <div className="sr-scene-copy"><span className="sr-eyebrow">{scene.label}</span><h3>{scene.title}</h3><p>{scene.description}</p></div>
   <Diagram scene={scene} p={progress}/>
   <div className="sr-steps" aria-label="Workflow steps">{scene.steps.map((label,i)=><span key={label} className={step===i?"current":step>i?"complete":""}><i>{step>i?"✓":i+1}</i>{label}</span>)}</div>
  </div>
  <div className="sr-chapters" aria-label="Choose a service">{SCENES.map((s,i)=><button key={s.key} type="button" aria-pressed={i===index} onClick={()=>select(i)} className={i===index?"active":""}><span>0{i+1}</span>{s.label}</button>)}</div>
  <div className="sr-controls"><button type="button" className="sr-play" onClick={()=>{if(time>=REEL_SECONDS)setTime(0);setPlaying(v=>!v);}} aria-label={playing?"Pause showcase":"Play showcase"}>{playing?"Ⅱ":"▶"}</button><input type="range" aria-label="Showcase timeline" min="0" max={REEL_SECONDS} step=".1" value={time} onChange={e=>{setPlaying(false);setTime(Number(e.target.value));}}/><span>{Math.floor(time)} / {REEL_SECONDS}s</span></div>
  <div className="sr-bottom"><span>Illustrative workflows · not live data</span><Link href={scene.href}>Explore service <span aria-hidden="true">↗</span></Link></div>
 </div>;
}
