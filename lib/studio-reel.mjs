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
    "description": "The agent receives a request, plans, calls permitted tools, then returns a result or requests review when needed.",
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
export const SCENE_SECONDS=5;
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

// Each node connects to the mascot's bottom-center port. Request travels inward;
// all other active paths travel outward. Only one terminal branch is active.
export const AUTOMATION_NODES=[
  {
    "key": "request",
    "x": 8,
    "label": "Request",
    "detail": "Incoming task",
    "at": 0.1,
    "d": "M58 137V116Q58 104 70 104H258Q270 104 270 92V73",
    "wireAt": 0.12
  },
  {
    "key": "plan",
    "x": 114,
    "label": "Plan",
    "detail": "Agent plans",
    "at": 1.34,
    "d": "M270 73V92Q270 104 258 104H176Q164 104 164 116V137",
    "wireAt": 0.95
  },
  {
    "key": "tools",
    "x": 220,
    "label": "Tools",
    "detail": "Call actions",
    "at": 2.18,
    "d": "M270 73V137",
    "wireAt": 1.8
  },
  {
    "key": "review",
    "x": 326,
    "label": "Review",
    "detail": "If required",
    "at": 3.75,
    "d": "M270 73V92Q270 104 282 104H364Q376 104 376 116V137",
    "wireAt": 3.35
  },
  {
    "key": "result",
    "x": 432,
    "label": "Result",
    "detail": "If permitted",
    "at": 3.75,
    "d": "M270 73V92Q270 104 282 104H470Q482 104 482 116V137",
    "wireAt": 3.35
  }
];
export function automationFlow(reviewRequired=true){
 return AUTOMATION_NODES.map(n=>({...n,enabled:n.key==="review"?reviewRequired:n.key==="result"?!reviewRequired:true}));
}
export function nextReelState({index,reviewRequired}){
 const next=nextSceneIndex(index);
 return {index:next,reviewRequired:next===0?!reviewRequired:reviewRequired};
}
