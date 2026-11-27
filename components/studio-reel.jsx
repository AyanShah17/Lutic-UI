"use client";
import {memo,useEffect,useRef,useState} from "react";
import {SCENES,SCENE_SECONDS,nextReelState,shouldRunReel,automationFlow,mascotExpression} from "@/lib/studio-reel.mjs";

// Each diagram is rendered once. A single CSS clock coordinates the active
// scene's wires, node highlights, chart bars and moving signals.
function Node({x,y,w=142,h=64,label,detail,at=0,mark="dot",enabled=true}){
 return <g className={enabled?"sr-node sr-node-active":"sr-node sr-node-inactive"} style={{"--at":at+"s"}}>
  <rect x={x} y={y} width={w} height={h} rx="13"/>
  <circle cx={x+17} cy={y+19} r="4" className="sr-node-dot"/>
  <text x={x+29} y={y+23} className="sr-node-label">{label}</text>
  {detail&&<text x={x+15} y={y+44} className="sr-node-detail">{detail}</text>}
  {enabled&&mark==="check"&&<path d={"M"+(x+w-23)+" "+(y+43)+"l4 4 7 -8"} className="sr-check" style={{"--at":(at+.4)+"s"}}/>}
 </g>;
}
function Signal({d,at=0,duration=.92}){
 return <path d={d} pathLength="1" fill="none" strokeLinecap="round" className="sr-film-signal" style={{"--signal-at":at+"s","--signal-duration":duration+"s"}}/>;
}
function Wire({d,at=0,partial=false}){
 return <g fill="none" strokeLinecap="round"><path d={d} className="sr-wire-base"/><path d={d} pathLength="1" strokeDasharray="1" strokeDashoffset={partial ? .1 : 0} style={{"--at":at+"s","--end":partial ? .1 : 0}} className="sr-wire-live"/><Signal d={d} at={at}/></g>;
}
// Keep the official silhouette and face colors. Expressions use eye shape,
 // gaze and a small, optional smile rather than changing the brand mark.
function Face({expression,className=""}){
 const happy=expression==="delighted"||expression==="relieved";
 const eyeShapes={
  curious:[[79,103,6.5,10],[116,96,7.5,12]],
  focused:[[82,105,7.5,5.5],[118,99,7.5,5.5]],
  alert:[[82,102,7.5,12],[118,102,7.5,12]],
  thoughtful:[[78,98,6.5,8],[114,91,6.5,7]],
  concerned:[[82,106,6.5,8.5],[118,103,6.5,8.5]],
  patient:[[82,104,7,4],[118,100,7,4]],
  confident:[[82,103,7,6],[118,98,7,6]]
 };
 const eyes=eyeShapes[expression]||eyeShapes.curious;
 return <g className={"sr-face "+className}>
  {happy?<g className="sr-face-eyes" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round"><path d="M74 104Q82 91 90 104"/><path d="M110 99Q118 86 126 99"/></g>:<g className="sr-face-eyes">{eyes.map(([cx,cy,rx,ry],i)=><ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff"/>)}</g>}
  {expression==="focused"&&<g stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M74 91l13 4"/><path d="M111 89l13 -4"/></g>}
  {expression==="thoughtful"&&<path d="M91 124h15" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"/>}
  {expression==="concerned"&&<g fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="3.5"><path d="M74 92l12 -4M112 88l12 4"/><path d="M92 126q8 -7 16 0"/></g>}
  {happy&&<path d="M91 120q9 11 18 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>}
  {expression==="confident"&&<path d="M93 121q9 5 17 -3" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"/>}
 </g>;
}
function Core({x=270,y=141,at=0,service="solutions",reviewRequired=true,small=false}){
 const face=mascotExpression(service,reviewRequired);
 const changes=face.initial!==face.final;
 return <g transform={"translate("+x+" "+y+")"}>
  <g transform={small?"scale(.72)":undefined}>
   <circle r="46" className="sr-core-halo" style={{"--at":at+"s"}}/>
   <g transform="scale(.39) translate(-100 -100)"><g className="sr-core-art" style={{"--at":at+"s"}}>
    <polygon points="156.4,120.5 110.4,159.1 54,138.6 43.6,79.5 89.6,40.9 146,61.4" fill="#ee5414" stroke="#ee5414" strokeWidth="34" strokeLinejoin="round"/>
    <circle cx="100" cy="100" r="52" fill="#101012"/>
    {changes?<><Face expression={face.initial} className="sr-face-initial"/><Face expression={face.final} className="sr-face-final"/></>:<Face expression={face.initial}/>}
   </g></g>
  </g>
 </g>;
}
function AutomationFlow({reviewRequired}){
 const nodes=automationFlow(reviewRequired);
 return <>
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
   {nodes.map(n=><path key={n.key+"-base"} d={n.d} className="sr-wire-base"/>)}
   {nodes.filter(n=>n.enabled).map(n=><g key={n.key+"-live"}><path d={n.d} pathLength="1" strokeDasharray="1" strokeDashoffset="0" style={{"--at":n.wireAt+"s","--wire-duration":".58s"}} className="sr-wire-live"/><Signal d={n.d} at={n.wireAt} duration={.58}/></g>)}
   <Signal d="M270 137V73" at={2.46} duration={.40}/>
  </g>
  <Core x={270} y={49} at={.72} service="automation" reviewRequired={reviewRequired}/>
  {nodes.map(n=><Node key={n.key} x={n.x} y={137} w={100} h={64} label={n.label} detail={n.detail} at={n.at} enabled={n.enabled} mark={n.key==="result"?"check":"dot"}/>)}
  <g className="sr-auto-decision" style={{"--at":"3.78s"}}>
   <text x="270" y="232" textAnchor="middle" className="sr-auto-outcome">{reviewRequired?"Review required · awaiting approval":"No review required · result ready"}</text>
   <text x="270" y="250" textAnchor="middle" className="sr-caption">{reviewRequired?"Restricted actions wait for a human decision":"Permitted actions complete within policy"}</text>
  </g>
 </>;
}
function Diagram({scene,reviewRequired}){
 return <svg className="sr-diagram" viewBox="0 0 540 282" role="img" aria-label={scene.key==="automation"?scene.description+(reviewRequired?" This example requires review.":" This example returns a result directly."):scene.description}>
 <g className="sr-film-camera">
 {scene.key==="solutions"?<>
 <Wire d="M162 65H205Q220 65 220 80V102L235 120" at={0.18}/><Wire d="M162 217H205Q220 217 220 202V180L235 162" at={1.18}/><Wire d="M309 141H375" at={2.18}/>
 <Node x={20} y={33} label="Question" detail="Natural language" at={0.26}/><Node x={20} y={185} label="Knowledge" detail="Approved documents" at={1.26}/><Core at={1.18} service="solutions"/><Node x={375} y={108} w={145} h={74} label="AI answer" detail="Sources attached" at={2.35} mark="check"/>
 </>:scene.key==="automation"?<AutomationFlow reviewRequired={reviewRequired}/>:scene.key==="autonomy"?<>
 <Wire d="M196 57H344" at={0.18}/><Wire d="M416 89V193" at={1.18}/><Wire d="M344 225H196" at={2.18}/><Wire d="M124 193V89" at={2.18} partial/>
 <Node x={52} y={25} w={144} label="Observe" detail="Event received" at={0.26}/><Node x={344} y={25} w={144} label="Decide" detail="Check policy" at={0.68}/><Node x={344} y={193} w={144} label="Act" detail="Bounded action" at={1.52}/><Node x={52} y={193} w={144} label="Verify" detail="Check outcome" at={2.52} mark="check"/><Core at={2.18} service="autonomy"/>
 </>:scene.key==="consulting"?<>
 <Wire d="M154 139H198" at={0.18}/><Wire d="M340 139H384" at={1.18}/>
 <Node x={12} y={107} label="Architecture" detail="Design review" at={0.35}/><Node x={198} y={107} label="Evaluation" detail="Quality and safety" at={1.35}/><Node x={384} y={107} label="Release gate" detail="Go / no-go" at={2.35} mark="check"/>
 <g transform="translate(205 202)">{[.66,.82,.74,.92,.85].map((v,i)=><rect key={i} x={i*27} y={46-46*v} width="17" height={46*v} className="sr-chart-bar" style={{"--at":(1.18+i*.055)+"s"}} rx="3" fill={i===3?"#ee5414":"currentColor"} opacity={i===3?1:.32}/>)}</g><Core x={270} y={53} at={1.18} service="consulting" small/>
 </>:scene.key==="integrations"?<>
 <Wire d="M162 62H205L237 112" at={0.18}/><Wire d="M162 220H205L237 170" at={1.18}/><Wire d="M303 112L335 62H378" at={2.18}/><Wire d="M303 170L335 220H378" at={2.18}/>
 <Node x={20} y={30} label="CRM" detail="Scoped access" at={0.35}/><Node x={20} y={188} label="Knowledge" detail="Read permissions" at={1.35}/><Core at={1.18} service="integrations"/><Node x={378} y={30} label="Business API" detail="Validated calls" at={2.43}/><Node x={378} y={188} label="Audit log" detail="Trace actions" at={2.68} mark="check"/>
 </>:<>
 <g transform="translate(20 0) scale(.76 1) translate(-20 0)"><rect x="20" y="24" width="500" height="151" rx="16" className="sr-chart-bg"/><text x="39" y="51" className="sr-node-label">Service health · illustrative</text>
 <path d="M42 82H498M42 113H498M42 144H498" className="sr-wire-base" fill="none"/>
 <path d="M42 125L102 110L160 119L220 87L280 131L344 104L409 91L498 83" className="sr-wire-live" fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset="0" style={{"--at":".18s"}}/>
 <circle cx="280" cy="131" r="6" fill="#ee5414" className="sr-chart-point"/></g><Core x={463} y={100} at={1.18} service="support"/><Wire d="M178 228H198" at={1.18}/><Wire d="M340 228H362" at={2.18}/>
 <Node x={20} y={196} w={158} label="Monitor" detail="Watch outcomes" at={0.26}/><Node x={198} y={196} label="Investigate" detail="Review traces" at={1.35}/><Node x={362} y={196} w={158} label="Improve" detail="Regression test" at={2.35} mark="check"/>
 </>}
 </g>
 </svg>;
}
const Scene=memo(function Scene({scene,active,reviewRequired}){
 return <div className={"sr-scene"+(active?" sr-scene-active":"")} aria-hidden={!active}>
  <div className="sr-scene-copy"><span className="sr-eyebrow">{scene.label}</span><h3>{scene.title}</h3><p>{scene.description}</p></div>
  <Diagram scene={scene} reviewRequired={reviewRequired}/>
 </div>;
});
export default function StudioReel(){
 const root=useRef(null);
 const [{index,reviewRequired},setReel]=useState({index:0,reviewRequired:true}),[visible,setVisible]=useState(false),[reduced,setReduced]=useState(true),[paused,setPaused]=useState(false);
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
 const running=shouldRunReel({visible,reduced,paused});
 return <div className="sr-stage" ref={root} role="region" aria-label="Lutic services showcase" aria-describedby="sr-motion-help" tabIndex={0}
  data-running={running?"true":"false"} data-reduced={reduced?"true":"false"} style={{"--scene-duration":SCENE_SECONDS+"s"}}
  onKeyDown={e=>{if(e.target===e.currentTarget&&!e.repeat&&(e.key===" "||e.key==="Enter")){e.preventDefault();setPaused(v=>!v);}}}>
  <span id="sr-motion-help" className="sr-visually-hidden">Automatic illustrative service showcase, not live execution. Press Space or Enter while the showcase is focused to pause or resume. Mouse hover does not interrupt playback.</span>
  <div className="sr-scene-stack">
   {SCENES.map((s,i)=><Scene key={s.key} scene={s} active={i===index} reviewRequired={s.key==="automation"?reviewRequired:undefined}/>)}
  </div>
  {!reduced&&<span key={index} className="sr-clock" aria-hidden="true" onAnimationEnd={e=>{if(e.target===e.currentTarget&&e.animationName==="sr-clock")setReel(nextReelState);}}/>}
  <span className="sr-visually-hidden" role="status">{paused?"Automatic animation paused.":"Automatic animation enabled."}</span>
 </div>;
}
