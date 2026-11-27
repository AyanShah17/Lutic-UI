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

// Face treatments for the original mascot; no changes to the official logo asset.
export const MASCOT_EXPRESSIONS=Object.freeze({
 solutions:"curious",automation:"focused",autonomy:"alert",consulting:"thoughtful",integrations:"delighted",support:"concerned"
});
export function mascotExpression(key,reviewRequired=true){
 const initial=MASCOT_EXPRESSIONS[key];
 if(!initial)throw Error("Unknown mascot scene: "+key);
 const final=key==="automation"?"delighted":key==="support"?"relieved":key==="consulting"?"confident":key==="solutions"?"delighted":initial;
 return {initial,final,...(key==="automation"&&reviewRequired?{middle:"patient"}:{})};
}

// [dx, dy, scaleX, scaleY, rotation] relative to the two original logo eyes.
// The eye centers retain the original asymmetric arrangement in every pose.
export const MASCOT_EYE_POSES={
  "curious": [
    [
      -2,
      -1,
      1,
      1.13,
      -5
    ],
    [
      -2,
      -1,
      1.06,
      1.22,
      4
    ]
  ],
  "focused": [
    [
      0,
      0,
      1.02,
      0.83,
      -10
    ],
    [
      0,
      0,
      1.02,
      0.83,
      10
    ]
  ],
  "alert": [
    [
      0,
      -1,
      1.03,
      1.18,
      0
    ],
    [
      0,
      -1,
      1.03,
      1.18,
      0
    ]
  ],
  "thoughtful": [
    [
      -3,
      -3,
      0.94,
      0.98,
      -7
    ],
    [
      -3,
      -3,
      1,
      0.91,
      -5
    ]
  ],
  "delighted": [
    [
      0,
      -1,
      1.13,
      0.79,
      -12
    ],
    [
      0,
      -1,
      1.13,
      0.79,
      12
    ]
  ],
  "concerned": [
    [
      1,
      1,
      0.96,
      0.96,
      9
    ],
    [
      1,
      1,
      0.96,
      0.96,
      -9
    ]
  ],
  "patient": [
    [
      0,
      0,
      1,
      0.64,
      0
    ],
    [
      0,
      0,
      1,
      0.64,
      0
    ]
  ],
  "confident": [
    [
      1,
      0,
      1,
      0.98,
      -3
    ],
    [
      1,
      0,
      1,
      1.05,
      3
    ]
  ],
  "relieved": [
    [
      0,
      1,
      1.04,
      0.9,
      -4
    ],
    [
      0,
      1,
      1.04,
      0.9,
      4
    ]
  ]
};
export function mascotEyePose(expression){
 const pose=MASCOT_EYE_POSES[expression];
 if(!pose)throw Error("Unknown eye expression: "+expression);
 return pose;
}
