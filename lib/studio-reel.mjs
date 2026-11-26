// Illustrative service scenarios, not real client data or performance claims.
export const SCENES=[
  {
    "key": "solutions",
    "label": "AI solutions",
    "short": "Solutions",
    "title": "Knowledge into answers.",
    "description": "Custom AI assistants that work with your knowledge and data.",
    "steps": [
      "Understand the question",
      "Find relevant context",
      "Draft a grounded answer"
    ],
    "href": "/solutions",
    "outcome": "Grounded answer"
  },
  {
    "key": "automation",
    "label": "Agentic automations",
    "short": "Automation",
    "title": "Instructions into action.",
    "description": "Agents that plan, use tools and route sensitive actions for review.",
    "steps": [
      "Understand the request",
      "Execute permitted steps",
      "Request human approval"
    ],
    "href": "/agentic-automation",
    "outcome": "Ready for review"
  },
  {
    "key": "autonomy",
    "label": "Autonomous systems",
    "short": "Autonomy",
    "title": "Intelligence that keeps working.",
    "description": "Bounded autonomous systems that observe, decide, act and verify.",
    "steps": [
      "Observe the event",
      "Act within policy",
      "Verify the outcome"
    ],
    "href": "/agents",
    "outcome": "Outcome verified"
  },
  {
    "key": "consulting",
    "label": "Production AI consulting",
    "short": "Consulting",
    "title": "From prototype to production.",
    "description": "Architecture, evaluation and release planning for reliable AI.",
    "steps": [
      "Review architecture",
      "Evaluate behavior",
      "Prepare release gate"
    ],
    "href": "/consulting",
    "outcome": "Release review"
  },
  {
    "key": "integrations",
    "label": "AI integrations",
    "short": "Integrations",
    "title": "Connected by design.",
    "description": "Securely connect AI to the applications and data you already use.",
    "steps": [
      "Identify systems",
      "Validate access",
      "Connect and audit"
    ],
    "href": "/ai-integrations",
    "outcome": "Connections validated"
  },
  {
    "key": "support",
    "label": "AI support",
    "short": "Support",
    "title": "Built to keep improving.",
    "description": "Monitor, investigate and validate improvements throughout the AI lifecycle.",
    "steps": [
      "Monitor outcomes",
      "Investigate a regression",
      "Validate a change"
    ],
    "href": "/ai-support",
    "outcome": "Improvement reviewed"
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
export function chapterPreview(index){
 return Math.max(0,Math.min(SCENES.length-1,index))*SCENE_SECONDS+SCENE_SECONDS*.91;
}
export function stageProgress(progress,index){
 const t=Math.max(0,Math.min(1,(progress-index*.25-.06)/.26));
 return t*t*(3-2*t);
}
