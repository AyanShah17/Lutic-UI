"use client";
import Link from "next/link";
import {memo,useEffect,useRef,useState} from "react";
import {SCENES,SCENE_SECONDS,nextSceneIndex,shouldRunReel} from "@/lib/studio-reel.mjs";

// Each diagram is rendered once. A single CSS clock coordinates the active
// scene's wires, node highlights, chart bars and step captions.
function Node({x,y,w=142,h=64,label,detail,at=0,mark="dot"}){
 return <g className="sr-node sr-node-active" style={{"--at":at+"s"}}>
  <rect x={x} y={y} width={w} height={h} rx="13"/>
  <circle cx={x+17} cy={y+19} r="4" className="sr-node-dot"/>
  <text x={x+29} y={y+23} className="sr-node-label">{label}</text>
  {detail&&<text x={x+15} y={y+44} className="sr-node-detail">{detail}</text>}
  {mark==="check"&&<path d={"M"+(x+w-23)+" "+(y+43)+"l4 4 7 -8"} className="sr-check" style={{"--at":(at+.4)+"s"}}/>}
 </g>;
}
function Wire({d,at=0,partial=false}){
 return <g fill="none" strokeLinecap="round"><path d={d} className="sr-wire-base"/><path d={d} pathLength="1" strokeDasharray="1" strokeDashoffset={partial ? .1 : 0} style={{"--at":at+"s","--end":partial ? .1 : 0}} className="sr-wire-live"/></g>;
}
function Core({x=270,y=141,at=0}){
 return <g transform={"translate("+x+" "+y+")"}><circle r="46" className="sr-core-halo" style={{"--at":at+"s"}}/><g className="sr-core-art" transform="scale(.39) translate(-100 -100)"><polygon points="156.4,120.5 110.4,159.1 54,138.6 43.6,79.5 89.6,40.9 146,61.4" fill="#ee5414" stroke="#ee5414" strokeWidth="34" strokeLinejoin="round"/><circle cx="100" cy="100" r="52" fill="#101012"/><ellipse cx="82" cy="106" rx="6.5" ry="8.5" fill="#fff"/><ellipse cx="118" cy="97" rx="6.5" ry="8.5" fill="#fff"/></g></g>;
}
function Diagram({scene}){
 return <svg className="sr-diagram" viewBox="0 0 540 282" role="img" aria-label={scene.description}>
 {scene.key==="solutions"?<>
 <Wire d="M162 65H205Q220 65 220 80V102L235 120" at={0.18}/><Wire d="M162 217H205Q220 217 220 202V180L235 162" at={1.18}/><Wire d="M309 141H375" at={2.18}/>
 <Node x={20} y={33} label="Question" detail="Natural language" at={0.26}/><Node x={20} y={185} label="Knowledge" detail="Approved documents" at={1.26}/><Core at={1.18}/><Node x={375} y={108} w={145} h={74} label="AI answer" detail="Sources attached" at={2.35} mark="check"/>
 </>:scene.key==="automation"?<>
 <Wire d="M111 140H143" at={0.18}/><Wire d="M235 140H276" at={1.18}/><Wire d="M368 140H407" at={2.18}/>
 <Node x={15} y={108} w={96} label="Request" detail="New task" at={0.26}/><Node x={143} y={108} w={92} label="Plan" detail="Steps" at={0.68}/><Node x={276} y={108} w={92} label="Tools" detail="Scoped API" at={1.52}/><Node x={407} y={108} w={118} label="Approval" detail="Human review" at={2.43}/>
 <Wire d="M322 108V65H270V83" at={1.18}/><Core x={270} y={41} at={1.18}/><text x="270" y="240" textAnchor="middle" className="sr-caption">Policy checks before consequential actions</text>
 </>:scene.key==="autonomy"?<>
 <Wire d="M196 57H344" at={0.18}/><Wire d="M416 89V193" at={1.18}/><Wire d="M344 225H196" at={2.18}/><Wire d="M124 193V89" at={2.18} partial/>
 <Node x={52} y={25} w={144} label="Observe" detail="Event received" at={0.26}/><Node x={344} y={25} w={144} label="Decide" detail="Check policy" at={0.68}/><Node x={344} y={193} w={144} label="Act" detail="Bounded action" at={1.52}/><Node x={52} y={193} w={144} label="Verify" detail="Check outcome" at={2.52} mark="check"/><Core at={2.18}/>
 </>:scene.key==="consulting"?<>
 <Wire d="M154 139H198" at={0.18}/><Wire d="M340 139H384" at={1.18}/>
 <Node x={12} y={107} label="Architecture" detail="Design review" at={0.35}/><Node x={198} y={107} label="Evaluation" detail="Quality and safety" at={1.35}/><Node x={384} y={107} label="Release gate" detail="Go / no-go" at={2.35} mark="check"/>
 <g transform="translate(205 202)">{[.66,.82,.74,.92,.85].map((v,i)=><rect key={i} x={i*27} y={46-46*v} width="17" height={46*v} className="sr-chart-bar" style={{"--at":(1.18+i*.055)+"s"}} rx="3" fill={i===3?"#ee5414":"currentColor"} opacity={i===3?1:.32}/>)}</g><text x="270" y="60" textAnchor="middle" className="sr-caption">Design → test → release</text>
 </>:scene.key==="integrations"?<>
 <Wire d="M162 62H205L237 112" at={0.18}/><Wire d="M162 220H205L237 170" at={1.18}/><Wire d="M303 112L335 62H378" at={2.18}/><Wire d="M303 170L335 220H378" at={2.18}/>
 <Node x={20} y={30} label="CRM" detail="Scoped access" at={0.35}/><Node x={20} y={188} label="Knowledge" detail="Read permissions" at={1.35}/><Core at={1.18}/><Node x={378} y={30} label="Business API" detail="Validated calls" at={2.43}/><Node x={378} y={188} label="Audit log" detail="Trace actions" at={2.68} mark="check"/>
 </>:<>
 <rect x="20" y="24" width="500" height="151" rx="16" className="sr-chart-bg"/><text x="39" y="51" className="sr-node-label">Service health · illustrative</text>
 <path d="M42 82H498M42 113H498M42 144H498" className="sr-wire-base" fill="none"/>
 <path d="M42 125L102 110L160 119L220 87L280 131L344 104L409 91L498 83" className="sr-wire-live" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset="0" style={{"--at":".18s"}}/>
 <circle cx="280" cy="131" r="6" fill="#ee5414" className="sr-chart-point"/><Wire d="M178 228H198" at={1.18}/><Wire d="M340 228H362" at={2.18}/>
 <Node x={20} y={196} w={158} label="Monitor" detail="Watch outcomes" at={0.26}/><Node x={198} y={196} label="Investigate" detail="Review traces" at={1.35}/><Node x={362} y={196} w={158} label="Improve" detail="Regression test" at={2.35} mark="check"/>
 </>}
 </svg>;
}
const Scene=memo(function Scene({scene,active}){
 return <div className={"sr-scene"+(active?" sr-scene-active":"")} aria-hidden={!active}>
  <div className="sr-scene-copy"><span className="sr-eyebrow">{scene.label}</span><h3>{scene.title}</h3><p>{scene.description}</p></div>
  <Diagram scene={scene}/>
  <div className="sr-steps" aria-label="Workflow steps">{scene.steps.map((label,i)=><span className="sr-step" key={label} style={{"--at":(.16+i*1.02)+"s"}}><i>{i+1}</i>{label}</span>)}</div>
 </div>;
});
export default function StudioReel(){
 const root=useRef(null);
 const [index,setIndex]=useState(0),[visible,setVisible]=useState(false),[reduced,setReduced]=useState(true),[paused,setPaused]=useState(false),[keyboardLinkFocus,setKeyboardLinkFocus]=useState(false);
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  const preference=()=>setReduced(media.matches);
  preference();media.addEventListener?.("change",preference);
  let inView=false;
  const update=()=>setVisible(inView&&!document.hidden);
  const observer=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;update();},{threshold:0}):null;
  if(observer&&root.current)observer.observe(root.current);else{inView=true;update();}
  document.addEventListener("visibilitychange",update);
  return()=>{observer?.disconnect();media.removeEventListener?.("change",preference);document.removeEventListener("visibilitychange",update);};
 },[]);
 const running=shouldRunReel({visible,reduced,paused,keyboardLinkFocus});
 const scene=SCENES[index];
 return <div className="sr-stage" ref={root} role="region" aria-label="Lutic services showcase" aria-describedby="sr-motion-help" tabIndex={0}
  data-running={running?"true":"false"} data-reduced={reduced?"true":"false"} style={{"--scene-duration":SCENE_SECONDS+"s"}}
  onKeyDown={e=>{if(e.target===e.currentTarget&&!e.repeat&&(e.key===" "||e.key==="Enter")){e.preventDefault();setPaused(v=>!v);}}}>
  <span id="sr-motion-help" className="sr-visually-hidden">Automatic service showcase. Press Space or Enter while the showcase is focused to pause or resume. Mouse hover does not interrupt playback.</span>
  <div className="sr-scene-stack">
   {SCENES.map((s,i)=><Scene key={s.key} scene={s} active={i===index}/>)}
  </div>
  {!reduced&&<span key={index} className="sr-clock" aria-hidden="true" onAnimationEnd={e=>{if(e.target===e.currentTarget&&e.animationName==="sr-clock")setIndex(nextSceneIndex);}}/>}
  <div className="sr-bottom"><span>Illustrative workflows · not live data</span><Link href={scene.href} onFocus={e=>setKeyboardLinkFocus(e.currentTarget.matches(":focus-visible"))} onBlur={()=>setKeyboardLinkFocus(false)}>Explore service <span aria-hidden="true">↗</span></Link></div>
  <span className="sr-visually-hidden" role="status">{paused?"Automatic animation paused.":"Automatic animation enabled."}</span>
 </div>;
}
