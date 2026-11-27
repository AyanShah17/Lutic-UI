"use client";
import {memo,useEffect,useRef,useState} from "react";
import {SCENES,SCENE_SECONDS,FILM_PACE,nextReelState,shouldRunReel,automationFlow,mascotExpression,mascotEyePose,mascotPersona} from "@/lib/studio-reel.mjs";

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
// Always render the original two white oval eyes; only their local transforms
// change. Independent nested blink groups keep the asymmetric logo geometry.
const ORIGINAL_EYES=[[82,106],[118,97]];
function eyeTransform([dx,dy,sx,sy,angle]){
 return "translate("+dx+"px,"+dy+"px) rotate("+angle+"deg) scale("+sx+","+sy+")";
}
function Face({initial,final,changeAt}){
 const start=mascotEyePose(initial),end=mascotEyePose(final);
 return <g className="sr-face" style={{"--face-at":changeAt+"s"}}>
  {ORIGINAL_EYES.map(([cx,cy],i)=><g key={i} transform={"translate("+cx+" "+cy+")"}>
   <g className="sr-eye-pose" style={{"--eye-from":eyeTransform(start[i]),"--eye-to":eyeTransform(end[i])}}>
    <g className="sr-eye-blink"><ellipse cx="0" cy="0" rx="6.5" ry="8.5" fill="#fff"/></g>
   </g>
  </g>)}
 </g>;
}
// All costume artwork is in the same 200-unit coordinate space as the
// original logo. Accessories stay within the existing halo and leave the
// lower-center connection port unobstructed.
function Costume({accessory}){
 return <g className="sr-costume" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
  {accessory==="glasses"?<>
   <g fill="none" stroke="#f4eee8" strokeWidth="4">
    <rect x="64" y="88" width="35" height="31" rx="10" transform="rotate(-8 81.5 103.5)"/>
    <rect x="101" y="81" width="35" height="31" rx="10" transform="rotate(-8 118.5 96.5)"/>
    <path d="M99 99l5 -1M64 102l-10 -2M136 94l9 -3"/>
   </g>
   <path d="M72 93l8 -2M109 86l8 -2" fill="none" stroke="#ee5414" strokeWidth="2.5" opacity=".9"/>
  </>:accessory==="antenna"?<>
   <g fill="#101012" stroke="#f4eee8" strokeWidth="3.5"><rect x="87" y="26" width="26" height="16" rx="7"/><path d="M100 26V13" fill="none"/><circle cx="100" cy="10" r="7" fill="#ee5414"/></g>
   <g className="sr-persona-pulse" fill="none" stroke="#ee5414" strokeWidth="3"><path d="M85 11Q85 0 100 0Q115 0 115 11"/><path d="M79 15Q79 -7 100 -7Q121 -7 121 15" opacity=".6"/></g>
  </>:accessory==="visor"?<>
   <path d="M55 85Q100 69 145 85L145 108Q100 123 55 108Z" fill="#ee5414" fillOpacity=".12" stroke="#f4eee8" strokeWidth="3.5"/>
   <path d="M60 89l16 -5M125 112l14 -4" stroke="#ee5414" strokeWidth="3" fill="none"/>
   <path className="sr-persona-scan" d="M58 94Q100 84 142 94" stroke="#f4eee8" strokeOpacity=".7" strokeWidth="2" fill="none"/>
  </>:accessory==="helmet"?<>
   <path d="M49 57Q49 16 96 16Q144 16 151 57L158 65H42Z" fill="#f4eee8" stroke="#101012" strokeWidth="4"/>
   <path d="M87 19Q83 36 83 54M108 19Q112 36 112 54" fill="none" stroke="#ee5414" strokeWidth="5"/>
   <path d="M43 64h114" stroke="#ee5414" strokeWidth="7"/>
   <rect x="91" y="43" width="18" height="8" rx="3" fill="#ee5414"/>
  </>:accessory==="ports"?<>
   <g fill="#101012" stroke="#f4eee8" strokeWidth="3.5">
    <rect x="20" y="87" width="25" height="26" rx="7"/><rect x="155" y="87" width="25" height="26" rx="7"/>
    <path d="M20 95H9M20 105H9M180 95H191M180 105H191" fill="none"/>
   </g>
   <g className="sr-persona-pulse" fill="#ee5414"><circle cx="32.5" cy="100" r="4.5"/><circle cx="167.5" cy="100" r="4.5"/></g>
  </>:accessory==="headset"?<>
   <path d="M39 100V79Q39 30 100 30Q161 30 161 79V100" fill="none" stroke="#f4eee8" strokeWidth="6"/>
   <g fill="#101012" stroke="#f4eee8" strokeWidth="3.5"><rect x="27" y="88" width="20" height="34" rx="8"/><rect x="153" y="88" width="20" height="34" rx="8"/></g>
   <path d="M163 121Q159 140 133 140" fill="none" stroke="#f4eee8" strokeWidth="4"/>
   <rect x="122" y="135" width="16" height="10" rx="5" fill="#ee5414" stroke="#f4eee8" strokeWidth="2"/>
   <circle className="sr-persona-pulse" cx="163" cy="105" r="4" fill="#ee5414"/>
  </>:null}
 </g>;
}
function Core({x=270,y=141,at=0,service="solutions",reviewRequired=true,small=false}){
 const face=mascotExpression(service,reviewRequired);
 const persona=mascotPersona(service);
 const changeAt=service==="automation"?4.3:3.25;
 return <g transform={"translate("+x+" "+y+")"}>
  <g transform={small?"scale(.72)":undefined}>
   <circle r="46" className="sr-core-halo" style={{"--at":at+"s"}}/>
   <g transform="scale(.39) translate(-100 -100)"><g className="sr-core-art" data-persona={persona.accessory} style={{"--at":at+"s"}}>
    <polygon points="156.4,120.5 110.4,159.1 54,138.6 43.6,79.5 89.6,40.9 146,61.4" fill="#ee5414" stroke="#ee5414" strokeWidth="34" strokeLinejoin="round"/>
    <circle cx="100" cy="100" r="52" fill="#101012"/>
    <Face initial={face.initial} final={face.final} changeAt={changeAt}/>
    <Costume accessory={persona.accessory}/>
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
 return <svg className="sr-diagram" viewBox="0 0 540 282" role="img" aria-label={mascotPersona(scene.key).name+". "+(scene.key==="automation"?scene.description+(reviewRequired?" This example requires review.":" This example returns a result directly."):scene.description)}>
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
  data-running={running?"true":"false"} data-reduced={reduced?"true":"false"} style={{"--scene-duration":SCENE_SECONDS+"s","--film-pace":FILM_PACE}}
  onKeyDown={e=>{if(e.target===e.currentTarget&&!e.repeat&&(e.key===" "||e.key==="Enter")){e.preventDefault();setPaused(v=>!v);}}}>
  <span id="sr-motion-help" className="sr-visually-hidden">Automatic illustrative service showcase, not live execution. Press Space or Enter while the showcase is focused to pause or resume. Mouse hover does not interrupt playback.</span>
  <div className="sr-scene-stack">
   {SCENES.map((s,i)=><Scene key={s.key} scene={s} active={i===index} reviewRequired={s.key==="automation"?reviewRequired:undefined}/>)}
  </div>
  {!reduced&&<span key={index} className="sr-clock" aria-hidden="true" onAnimationEnd={e=>{if(e.target===e.currentTarget&&e.animationName==="sr-clock")setReel(nextReelState);}}/>}
  <span className="sr-visually-hidden" role="status">{paused?"Automatic animation paused.":"Automatic animation enabled."}</span>
 </div>;
}
