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
    "description": "An agent plans a task, uses approved tools and routes sensitive actions for review.",
    "steps": [
      "Plan the task",
      "Call approved tools",
      "Request approval"
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
export const SCENE_SECONDS=4;
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
