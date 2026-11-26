"use client";
import {useState,useEffect,useRef} from "react";
import {F} from "@/data/platform";
const columns=["To do","In progress","Done"];
const initial=[["LUT-101","Replace press 4 seal","High",0],["LUT-102","Calibrate line 2 sensor","Medium",0],["LUT-103","Review alarm F-214 trend","High",1],["LUT-104","Reorder bearing 6204","Low",2]];
function Chips({items,flow=false}){return <div className="cp2">{items.map((x,i)=><span key={x} className={flow?"h":undefined} style={{"--d":i+"s"}}>{x}</span>)}</div>}
function Tile({value,label,width}){return <div className="tile"><b>{value}</b><span>{label}</span>{width!=null&&<i style={{"--w":width+"%"}}/>}</div>}
function Checks({items}){return items.map((x,i)=><div key={x} className="ck" style={{"--d":i*.35+"s"}}>{x}</div>)}
function Board(){const [cards,setCards]=useState(initial);return <><div className="kb">{columns.map((n,c)=><div key={n}><h4>{n}</h4>{cards.filter(k=>k[3]===c).map(k=><button type="button" key={k[0]} onClick={()=>setCards(old=>old.map(x=>x[0]===k[0]?[...x.slice(0,3),(x[3]+1)%3]:x))}><b>{k[0]}</b> {k[1]}<em>{k[2]}</em></button>)}</div>)}</div><p className="hint">Click a card to move it to the next column. Changes are local to this demo.</p></>}
function Monitoring(){
 const [series,setSeries]=useState(()=>Array.from({length:3},(_,k)=>Array.from({length:30},(_,i)=>20+8*Math.sin(i/3+k))));
 useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion:reduce)").matches)return;const id=setInterval(()=>setSeries(old=>old.map(r=>[...r.slice(1),Math.max(4,Math.min(36,r.at(-1)+(Math.random()-.5)*9))])),600);return()=>clearInterval(id)},[]);
 return <><div className="vz">{["Press 4 temperature","Line 2 vibration","Motor current"].map((n,k)=><div className="spk" key={n}><span>{n}</span><svg viewBox="0 0 190 40" aria-hidden="true"><polyline fill="none" stroke="#ee5414" strokeWidth="2.5" strokeLinejoin="round" points={series[k].map((y,i)=>(i*190/29).toFixed(1)+","+(40-y).toFixed(1)).join(" ")}/></svg></div>)}<div><span className="al">Alarm F-214 · Press 4</span></div></div><p className="hint">Simulated signals.</p></>;
}
function Visual({index}){
 switch(index){
 case 0:return <><div className="vz g3">{[["86.4%","OEE",86],["93%","Availability",93],["94%","Performance",94],["98%","Quality",98],["42 min","Downtime",30],["38 min","MTTR",40]].map(([v,l,w])=><Tile key={l} value={v} label={l} width={w}/>)}</div><p className="hint">Example values for illustration.</p></>;
 case 1:return <Board/>;
 case 2:return <Monitoring/>;
 case 3:return <div className="vz">{[["Local vectors, 64-dim",64],["Dense vectors, 1536-dim",88],["Full-text",72],["Fault-code boost",95]].map(([n,w],i)=><div key={n}><div className="lab">{n}</div><div className="bw" style={{"--w":w+"%","--d":i*.15+"s"}}/></div>)}<Chips items={["Rank fusion","Reranker","Answer with citations"]} flow/></div>;
 case 4:return <div className="vz"><Chips items={["Question","Specialist agent","safety_verifier","Policy check","Cited answer"]} flow/></div>;
 case 5:return <div className="vz two"><Checks items={["Toolkit allowed","Role permission","Plant scope","Schema validation","Rate limit","Human confirmation"]}/></div>;
 case 6:return <div className="vz"><div className="lab">5 native hubs</div><Chips items={["Docs","Historian","CMMS","Parts ERP","MES"]}/><div className="lab">Industrial and enterprise adapters include</div><Chips items={["SAP","AWS","ServiceNow","Jira","Linear","Slack","MQTT","OPC-UA","Modbus TCP"]}/><div className="lab">3 HTTPS bridges and 1 webhook</div><Chips items={["lutic-cloud","lutic-bridge","lutic-api","Webhook"]}/></div>;
 case 7:return <><div className="vz"><Checks items={["Step 1 · Fetch alarm: saved","Step 2 · Create work order: retry 2 of 3","Step 3 · Notify on-call: resumed after restart"]}/></div><p className="hint">Example run.</p></>;
 case 8:return <div className="vz"><Chips items={["Row-level security","AES-256-GCM credentials","Pinned-IP requests","No redirects","1 MiB response cap","15 s timeout","CSRF and origin guards","Security scanner"]}/></div>;
 case 9:return <div className="vz two"><Tile value="Free" label="Sign up, then a personal workspace, plant and 3 starter board items are created."/><Tile value="Enterprise" label="Sign up, then Access pending until an admin invites you."/></div>;
 case 10:return <div className="vz"><Chips items={["Next.js 15","Bun","PostgreSQL 16 + pgvector","Docker Compose","Caddy or Nginx","Lutic AI Gateway","lutic-worker"]}/></div>;
 default:return null;
 }
}
export default function PlatformExplorer(){
 const [active,setActive]=useState(0),tabs=useRef([]),f=F[active];
 function keydown(e,i){let n;if(e.key==="ArrowRight"||e.key==="ArrowDown")n=(i+1)%F.length;else if(e.key==="ArrowLeft"||e.key==="ArrowUp")n=(i+F.length-1)%F.length;else if(e.key==="Home")n=0;else if(e.key==="End")n=F.length-1;else return;e.preventDefault();setActive(n);tabs.current[n]?.focus();}
 return <div className="ft"><div className="ft-tabs" role="tablist" aria-label="Platform features">{F.map((x,i)=><button type="button" key={x.n} ref={el=>{tabs.current[i]=el}} id={"feature-"+i} role="tab" aria-controls="feature-panel" aria-selected={active===i} tabIndex={active===i?0:-1} className={active===i?"on":""} onClick={()=>setActive(i)} onKeyDown={e=>keydown(e,i)}>{x.n}</button>)}</div><div key={active} className="ft-panel" id="feature-panel" role="tabpanel" aria-labelledby={"feature-"+active} tabIndex={0}><h2>{f.n}</h2><p className="lead">{f.d}</p><ul className="fl">{f.b.map(x=><li key={x}>{x}</li>)}</ul><div className="fs">{f.s.map(([v,l])=><div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div><Visual index={active}/></div></div>;
}
