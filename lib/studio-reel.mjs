// Illustrative service scenarios, not real client data or product performance claims.
export const SCENES=[
  {
    "key": "solutions",
    "label": "AI solutions",
    "title": "Your knowledge, made useful.",
    "description": "An assistant retrieves relevant sources and drafts a grounded answer.",
    "steps": [
      "Ask a question",
      "Retrieve context",
      "Draft with sources"
    ],
    "href": "/solutions"
  },
  {
    "key": "automation",
    "label": "Agentic automations",
    "title": "From request to completed work.",
    "description": "The agent receives a request, plans, uses permitted tools, obtains approval if needed and returns the result.",
    "steps": [
      "Plan the task",
      "Call approved tools",
      "Review or result"
    ],
    "href": "/agentic-automation"
  },
  {
    "key": "autonomy",
    "label": "Autonomous systems",
    "title": "Observe. Decide. Act. Verify.",
    "description": "A bounded agent responds to events, checks outcomes and escalates exceptions.",
    "steps": [
      "Observe an event",
      "Decide and act",
      "Verify the result"
    ],
    "href": "/agents"
  },
  {
    "key": "consulting",
    "label": "Production AI consulting",
    "title": "Make the prototype production-ready.",
    "description": "Architecture, evaluations and release gates turn a demo into an operable system.",
    "steps": [
      "Design architecture",
      "Run evaluations",
      "Review release"
    ],
    "href": "/consulting"
  },
  {
    "key": "integrations",
    "label": "AI integrations",
    "title": "Connect intelligence to your tools.",
    "description": "Scoped connectors link existing applications, knowledge and business workflows.",
    "steps": [
      "Identify systems",
      "Validate access",
      "Connect and audit"
    ],
    "href": "/ai-integrations"
  },
  {
    "key": "support",
    "label": "AI support",
    "title": "Keep improving after deployment.",
    "description": "Monitor signals, investigate regressions and validate improvements before rollout.",
    "steps": [
      "Monitor signals",
      "Investigate issue",
      "Validate improvement"
    ],
    "href": "/ai-support"
  }
];
export const SCENE_SECONDS=7;
export const FILM_PACE=1.25;
export const REEL_SECONDS=SCENES.length*SCENE_SECONDS;
export function reelPosition(seconds){
 const t=Math.max(0,Math.min(REEL_SECONDS,Number.isFinite(seconds)?seconds:0));
 const index=Math.min(SCENES.length-1,Math.floor(t/SCENE_SECONDS));
 const progress=(t-index*SCENE_SECONDS)/SCENE_SECONDS;
 return {index,progress,step:Math.min(2,Math.floor(progress*3))};
}
export function advanceReel(seconds,delta){
 return ((seconds+Math.max(0,delta))%REEL_SECONDS+REEL_SECONDS)%REEL_SECONDS;
}

// The scene clock pauses only for visibility, reduced motion, explicit pause,
// or keyboard focus on the changing destination link. Pointer hover is ignored.
export function shouldRunReel({visible=false,reduced=false,paused=false,keyboardLinkFocus=false}={}){
 return Boolean(visible&&!reduced&&!paused&&!keyboardLinkFocus);
}
export function nextSceneIndex(index){return (index+1)%SCENES.length;}

// All stages connect to the mascot's bottom-center port. The review path
// returns a simulated human approval before activating Result.
export const AUTOMATION_TIMING=Object.freeze({
  "request": {
    "at": 0.12,
    "duration": 0.58
  },
  "plan": {
    "at": 0.82,
    "duration": 0.5
  },
  "tools": {
    "at": 1.48,
    "duration": 0.5
  },
  "toolReturn": {
    "at": 2.05,
    "duration": 0.35
  },
  "review": {
    "at": 2.48,
    "duration": 0.48
  },
  "approval": {
    "at": 3.28,
    "duration": 0.38
  },
  "reviewResult": {
    "at": 3.72,
    "duration": 0.48
  },
  "directResult": {
    "at": 2.48,
    "duration": 0.58
  },
  "reviewReady": 2.96,
  "reviewApproved": 3.28,
  "reviewResultReady": 4.2,
  "directResultReady": 3.06
});
export const AUTOMATION_NODES=[
  {
    "key": "request",
    "x": 8,
    "label": "Request",
    "detail": "Incoming task",
    "at": 0.1,
    "d": "M58 137V116Q58 104 70 104H258Q270 104 270 92V73"
  },
  {
    "key": "plan",
    "x": 114,
    "label": "Plan",
    "detail": "Agent plans",
    "at": 1.1,
    "d": "M270 73V92Q270 104 258 104H176Q164 104 164 116V137"
  },
  {
    "key": "tools",
    "x": 220,
    "label": "Tools",
    "detail": "Call actions",
    "at": 1.79,
    "d": "M270 73V137"
  },
  {
    "key": "review",
    "x": 326,
    "label": "Review",
    "detail": "If required",
    "at": 2.8,
    "d": "M270 73V92Q270 104 282 104H364Q376 104 376 116V137"
  },
  {
    "key": "result",
    "x": 432,
    "label": "Result",
    "detail": "Task complete",
    "at": 4.2,
    "d": "M270 73V92Q270 104 282 104H470Q482 104 482 116V137"
  }
];
export function automationFlow(reviewRequired=true){
 const t=AUTOMATION_TIMING;
 return AUTOMATION_NODES.map(n=>{
  const slot=n.key==="result"?(reviewRequired?t.reviewResult:t.directResult):t[n.key];
  return {...n,enabled:n.key!=="review"||reviewRequired,wireAt:slot.at,wireDuration:slot.duration,
   at:n.key==="result"?(reviewRequired?t.reviewResultReady:t.directResultReady):n.at,
   checkAt:n.key==="review"?t.reviewApproved:n.key==="result"?(reviewRequired?t.reviewResultReady:t.directResultReady):undefined};
 });
}
export function nextReelState({index,reviewRequired}){
 const next=nextSceneIndex(index);
 return {index:next,reviewRequired:next===0?!reviewRequired:reviewRequired};
}

// State-based acting for the original two oval eyes. Timings use the same
// film units as wire drawing, and the completed pose follows the actual result.
export const MASCOT_EYE_POSES={
  "alerted": [
    [
      0,
      -2,
      1.06,
      1.32,
      0
    ],
    [
      0,
      -2,
      1.06,
      1.32,
      0
    ]
  ],
  "checking": [
    [
      -4,
      0,
      0.98,
      0.94,
      -5
    ],
    [
      -4,
      0,
      0.98,
      0.94,
      -5
    ]
  ],
  "checking-right": [
    [
      4,
      0,
      0.98,
      0.94,
      5
    ],
    [
      4,
      0,
      0.98,
      0.94,
      5
    ]
  ],
  "thinking": [
    [
      -3,
      -4,
      0.96,
      1.1,
      -9
    ],
    [
      -3,
      -4,
      1.03,
      0.86,
      -5
    ]
  ],
  "working": [
    [
      0,
      1,
      1.12,
      0.64,
      -10
    ],
    [
      0,
      1,
      1.12,
      0.64,
      10
    ]
  ],
  "result": [
    [
      1,
      -1,
      1.1,
      1.08,
      -5
    ],
    [
      1,
      -1,
      1.1,
      1.08,
      5
    ]
  ],
  "relieved": [
    [
      0,
      1,
      1.08,
      0.86,
      -3
    ],
    [
      0,
      1,
      1.08,
      0.86,
      3
    ]
  ]
};
export function mascotEyePose(expression){
 const pose=MASCOT_EYE_POSES[expression];
 if(!pose)throw Error("Unknown eye expression: "+expression);
 return pose;
}
export const MASCOT_STORIES={
  "solutions": [
    [
      "checking",
      0
    ],
    [
      "checking-right",
      0.85
    ],
    [
      "thinking",
      1.45
    ],
    [
      "working",
      2.18
    ],
    [
      "result",
      3.13
    ]
  ],
  "autonomy": [
    [
      "alerted",
      0
    ],
    [
      "thinking",
      0.68
    ],
    [
      "working",
      1.18
    ],
    [
      "checking",
      2.18
    ],
    [
      "result",
      3.3
    ]
  ],
  "consulting": [
    [
      "checking",
      0
    ],
    [
      "thinking",
      0.85
    ],
    [
      "working",
      1.65
    ],
    [
      "checking-right",
      2.35
    ],
    [
      "result",
      3.13
    ]
  ],
  "integrations": [
    [
      "checking",
      0
    ],
    [
      "working",
      0.65
    ],
    [
      "checking-right",
      1.7
    ],
    [
      "working",
      2.18
    ],
    [
      "result",
      3.46
    ]
  ],
  "support": [
    [
      "alerted",
      0
    ],
    [
      "checking",
      0.75
    ],
    [
      "thinking",
      1.35
    ],
    [
      "working",
      2.18
    ],
    [
      "relieved",
      3.13
    ]
  ]
};
export function mascotExpression(key,reviewRequired=true){
 const t=AUTOMATION_TIMING;
 const beats=key==="automation"?[
  ["alerted",0],["thinking",t.plan.at],["working",t.tools.at],
  ["checking",t.toolReturn.at+t.toolReturn.duration],
  ...(reviewRequired?[["checking-right",t.reviewReady],["working",t.reviewResult.at],["result",t.reviewResultReady]]:[["result",t.directResultReady]])
 ]:MASCOT_STORIES[key];
 if(!beats)throw Error("Unknown mascot scene: "+key);
 return {animation:"sr-eye-story-"+key+(key==="automation"?(reviewRequired?"-review":"-direct"):""),beats,final:beats[beats.length-1][0]};
}
 // Generate deterministic keyframes for the static stylesheet; tests check
 // that the authored CSS stays synchronized with the scene timeline.
export function mascotStoryCSS(story){
 const frames=[`0%{transform:var(--eye-${story.beats[0][0]})}`];
 const pct=at=>Number((at*FILM_PACE/SCENE_SECONDS*100).toFixed(4))+"%";
 for(let i=1;i<story.beats.length;i++){
  const [state,at]=story.beats[i];
  frames.push(`${pct(at)}{transform:var(--eye-${story.beats[i-1][0]})}`);
  frames.push(`${pct(at+.20)}{transform:var(--eye-${state})}`);
 }
 frames.push(`100%{transform:var(--eye-${story.final})}`);
 return `@keyframes ${story.animation}{${frames.join("")}}`;
}

// Small head accents in the native logo's 200-unit coordinate space.
// They sit above the orange silhouette, not on its face or connection port.
export const MASCOT_EXPRESSION_LINES=Object.freeze({
  "alerted": [
    "M75 18L68 8",
    "M91 14V2",
    "M107 18L114 8"
  ],
  "checking": [
    "M63 24L54 17",
    "M75 17L70 7"
  ],
  "checking-right": [
    "M106 18L111 8",
    "M119 24L128 17"
  ],
  "thinking": [
    "M80 16Q84 10 80 4",
    "M98 15Q102 9 98 3"
  ],
  "working": [
    "M77 18L84 6",
    "M94 15L101 3"
  ],
  "result": [
    "M73 18L64 8",
    "M91 13V1",
    "M109 18L118 8"
  ],
  "relieved": [
    "M80 17L76 10",
    "M102 17L106 10"
  ]
});
export function expressionLineBeats(story){
 return story.beats.map(([state,at],i)=>{
  const paths=MASCOT_EXPRESSION_LINES[state];
  if(!paths)throw Error("Unknown expression line state: "+state);
  const next=story.beats[i+1]?.[1]??SCENE_SECONDS/FILM_PACE;
  // Short pulses leave a quiet interval before the next expression.
  const delay=at+.04,duration=Math.min(state==="result"?.88:.64,(next-delay)*.86);
  return {state,paths,delay,duration};
 });
}

// Shared SVG signal paths and timing for the gaze performance.
export const REEL_CONNECTIONS={
  "solutions": [
    {
      "d": "M162 65H205Q220 65 220 80V102L235 120",
      "at": 0.18
    },
    {
      "d": "M162 217H205Q220 217 220 202V180L235 162",
      "at": 1.18
    },
    {
      "d": "M309 141H375",
      "at": 2.18
    }
  ],
  "autonomy": [
    {
      "d": "M196 57H344",
      "at": 0.18
    },
    {
      "d": "M416 89V193",
      "at": 1.18
    },
    {
      "d": "M344 225H196",
      "at": 2.18
    },
    {
      "d": "M124 193V89",
      "at": 2.18,
      "partial": true
    }
  ],
  "consulting": [
    {
      "d": "M154 139H198",
      "at": 0.18
    },
    {
      "d": "M340 139H384",
      "at": 1.18
    }
  ],
  "integrations": [
    {
      "d": "M162 62H205L237 112",
      "at": 0.18
    },
    {
      "d": "M162 220H205L237 170",
      "at": 1.18
    },
    {
      "d": "M303 112L335 62H378",
      "at": 2.18
    },
    {
      "d": "M303 170L335 220H378",
      "at": 2.18
    }
  ],
  "support": [
    {
      "d": "M178 228H198",
      "at": 1.18
    },
    {
      "d": "M340 228H362",
      "at": 2.18
    }
  ]
};
export const SUPPORT_CHART_SIGNAL={
  "d": "M42 125L102 110L160 119L220 87L280 131L344 104L409 91L498 83",
  "at": 0.18,
  "duration": 0.92,
  "scaleX": 0.76,
  "offsetX": 4.8
};
export const AUTOMATION_RETURN_PATHS={
  "toolReturn": "M270 137V73",
  "approval": "M376 137V116Q376 104 364 104H282Q270 104 270 92V73"
};
export const MASCOT_CENTERS={
  "solutions": [
    270,
    141
  ],
  "automation": [
    270,
    49
  ],
  "autonomy": [
    270,
    141
  ],
  "consulting": [
    270,
    53
  ],
  "integrations": [
    270,
    141
  ],
  "support": [
    463,
    100
  ]
};
export function automationReturnSignals(reviewRequired=true){
 const t=AUTOMATION_TIMING;
 return ["toolReturn",...(reviewRequired?["approval"]:[])].map(key=>({d:AUTOMATION_RETURN_PATHS[key],...t[key]}));
}
export function mascotGazeSignals(service,reviewRequired=true){
 if(service==="automation")return [
  ...automationFlow(reviewRequired).filter(n=>n.enabled).map(n=>({d:n.d,at:n.wireAt,duration:n.wireDuration})),
  ...automationReturnSignals(reviewRequired)
 ];
 const wires=REEL_CONNECTIONS[service];
 if(!wires)throw Error("Unknown gaze service: "+service);
 return [...(service==="support"?[SUPPORT_CHART_SIGNAL]:[]),...wires.map(w=>({...w,duration:.92}))];
}
export function gazePathPoints(d){
 const tokens=d.match(/[MLHVQ]|-?(?:\d+(?:\.\d+)?|\.\d+)/g)||[];
 let i=0,x=0,y=0;
 const points=[];
 const push=(a,b)=>{x=a;y=b;points.push([x,y]);};
 while(i<tokens.length){
  const cmd=tokens[i++];
  const num=()=>{const n=Number(tokens[i++]);if(!Number.isFinite(n))throw Error("Invalid gaze path "+d);return n;};
  if(cmd==="M"||cmd==="L")push(num(),num());
  else if(cmd==="H")push(num(),y);
  else if(cmd==="V")push(x,num());
  else if(cmd==="Q"){
   const sx=x,sy=y,cx=num(),cy=num(),ex=num(),ey=num();
   for(let j=1;j<=16;j++){const t=j/16,u=1-t;push(u*u*sx+2*u*t*cx+t*t*ex,u*u*sy+2*u*t*cy+t*t*ey);}
  }else throw Error("Unsupported gaze command "+cmd);
 }
 return points;
}
export function gazePathSample(points,progress){
 if(points.length<2)throw Error("Gaze path needs two points");
 const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
 let left=Math.max(0,Math.min(1,progress))*lengths.reduce((a,b)=>a+b,0);
 for(let i=0;i<lengths.length;i++){
  const length=lengths[i];
  if(left<=length&&length>0){const t=left/length,a=points[i],b=points[i+1];return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
  left-=length;
 }
 return points[points.length-1];
}
export function gazeOffsetAt(signals,center,at){
 let x=0,y=0,weight=0,visibility=0;
 for(const s of signals){
  const elapsed=at-s.at;
  if(elapsed<0||elapsed>s.duration)continue;
  const progress=elapsed/s.duration;
  const point=gazePathSample(s.points,progress);
  const px=point[0]*(s.scaleX??1)+(s.offsetX??0),py=point[1];
  const dx=px-center[0],dy=py-center[1],r=Math.max(30,Math.hypot(dx,dy));
  // The head stays still; move both eyes together. Blend simultaneous wires.
  const w=Math.max(0,Math.min(1,elapsed/.10,(s.duration-elapsed)/.14));
  x+=dx/r*w;y+=dy/r*w;weight+=w;visibility=Math.max(visibility,w);
 }
 if(weight===0)return [0,0];
 return [11*x/weight*visibility,10*y/weight*visibility];
}
export function mascotGazeStory(service,reviewRequired=true){
 const center=MASCOT_CENTERS[service];
 if(!center)throw Error("Unknown mascot center: "+service);
 const signals=mascotGazeSignals(service,reviewRequired).map(s=>({...s,points:gazePathPoints(s.d)}));
 const end=SCENE_SECONDS/FILM_PACE,times=new Set([0,end]);
 for(const s of signals){
  for(let i=0;i<=8;i++)times.add(Number((s.at+s.duration*i/8).toFixed(6)));
  times.add(Number((s.at+.10).toFixed(6)));
  times.add(Number((s.at+s.duration-.14).toFixed(6)));
 }
 const frames=[...times].sort((a,b)=>a-b).map(at=>({at,offset:gazeOffsetAt(signals,center,at)}));
 return {animation:"sr-gaze-"+service+(service==="automation"?(reviewRequired?"-review":"-direct"):""),frames};
}
export function mascotGazeCSS(story){
 const fmt=n=>Number(n.toFixed(3));
 return "@keyframes "+story.animation+"{"+story.frames.map(({at,offset})=>fmt(at*FILM_PACE/SCENE_SECONDS*100)+"%{transform:translate("+fmt(offset[0])+"px,"+fmt(offset[1])+"px)}").join("")+"}";
}
