// Public editorial content. Examples are illustrative, not customer case studies.
export const content = {
  "agentic-automation": {
    "path": "/agentic-automation",
    "label": "Agentic automation",
    "title": "Agentic Automation & AI Workflow Development",
    "description": "Design AI agents that plan and execute business workflows with tool permissions, human approvals, retries and measurable task completion.",
    "heading": "Agentic automation that finishes the workflow.",
    "social": "From instruction to verified action.",
    "type": "WebPage",
    "service": true,
    "intro": "Lutic designs tool-using AI agents for repetitive, multi-step business workflows. We start with a bounded task and define where automation ends and human judgment begins.",
    "sections": [
      [
        "Where agentic automation helps",
        [
          "Customer support: classify requests, retrieve order details and prepare a response for approval.",
          "Operations: reconcile records, route exceptions and create follow-up tasks.",
          "Internal teams: gather information across tools and generate a structured handover."
        ]
      ],
      [
        "How we design the workflow",
        [
          "Map the inputs, permitted actions, success criteria and exception paths before choosing a model.",
          "Connect tools with scoped credentials, validate arguments and use idempotency keys for operations that can be retried.",
          "Introduce approval gates for consequential actions, retain execution traces and verify the final state."
        ]
      ],
      [
        "What to evaluate before launch",
        [
          "Measure task completion on representative cases, not just conversational fluency.",
          "Test unavailable APIs, duplicate requests, ambiguous instructions and adversarial content.",
          "Define a safe stop condition, escalation route and operational owner."
        ]
      ]
    ],
    "related": [
      "solutions",
      "agents",
      "ai-integrations",
      "production-ai-checklist"
    ]
  },
  "ai-integrations": {
    "path": "/ai-integrations",
    "label": "AI integrations",
    "title": "AI Integration Services for CRM, ERP & Business Systems",
    "description": "Connect AI applications to existing CRM, ERP, databases, ticketing and internal APIs using scoped access, validated tool calls and audit trails.",
    "heading": "Connect AI to the systems where work happens.",
    "social": "AI integration with controlled access.",
    "type": "WebPage",
    "service": true,
    "intro": "Lutic helps teams integrate AI into existing applications rather than create another disconnected interface. The integration boundary is as important as the model.",
    "sections": [
      [
        "Integration patterns",
        [
          "Read-only retrieval from approved documents, databases and knowledge bases.",
          "Structured API actions for ticketing, CRM and operational systems.",
          "Event-driven workflows with queues, webhooks and asynchronous processing."
        ]
      ],
      [
        "Security and reliability",
        [
          "Use least-privilege identities and separate read, write and administrative capabilities.",
          "Validate tool arguments against schemas; never treat retrieved text as trusted instructions.",
          "Log tool activity, redact sensitive values and handle rate limits with bounded retry policies."
        ]
      ],
      [
        "Delivery and acceptance",
        [
          "Inventory the actual interfaces and authentication requirements before estimating scope.",
          "Build a sandbox integration, verify permissions and test failure paths.",
          "Document data flows, ownership and rollback procedures before production access."
        ]
      ]
    ],
    "related": [
      "solutions",
      "agentic-automation",
      "ai-support",
      "production-ai-checklist"
    ]
  },
  "ai-support": {
    "path": "/ai-support",
    "label": "AI support",
    "title": "Production AI Support, Monitoring & Optimization",
    "description": "Keep deployed AI systems reliable through monitoring, evaluation, incident triage, model and prompt versioning, and ongoing performance optimization.",
    "heading": "Keep production AI working after launch.",
    "social": "Monitor, evaluate and improve AI.",
    "type": "WebPage",
    "service": true,
    "intro": "AI systems need ongoing maintenance because input distributions, model behavior and upstream services change. Lutic offers support scoped to your deployment and operational requirements.",
    "sections": [
      [
        "What to monitor",
        [
          "Track task success, error rates, end-to-end latency and cost per completed task.",
          "Watch retrieval quality, refusal patterns, tool-call failures and exception queues.",
          "Collect representative feedback with appropriate data retention and access controls."
        ]
      ],
      [
        "Operational response",
        [
          "Classify incidents by impact and isolate failed components before changing prompts or models.",
          "Keep versioned configurations and regression tests so fixes can be evaluated and rolled back.",
          "Define escalation channels and agreed coverage; response times depend on the support agreement."
        ]
      ],
      [
        "Continuous improvement",
        [
          "Review recurring failures and prioritize changes against measurable acceptance criteria.",
          "Re-test security controls and human approvals after integration changes.",
          "Document handovers, known limitations and changes to operating procedures."
        ]
      ]
    ],
    "related": [
      "consulting",
      "agents",
      "ai-integrations",
      "production-ai-checklist"
    ]
  },
  "about": {
    "path": "/about",
    "label": "About Lutic",
    "title": "About Lutic — Independent AI Studio",
    "description": "Meet Lutic, an independent founder-led AI studio focused on custom AI solutions, agentic automation, autonomous systems, integrations, consulting and support.",
    "heading": "Lutic is an independent AI studio.",
    "social": "Practical AI. Built with purpose.",
    "type": "AboutPage",
    "intro": "Lutic is a founder-led AI studio for individuals, startups, organizations and enterprises. Its mission is to turn AI capabilities into practical software that can be evaluated, operated and improved.",
    "sections": [
      [
        "Six disciplines, one studio",
        [
          "Custom AI solutions and copilots tailored to the problem.",
          "Agentic automation and autonomous systems with explicit boundaries.",
          "AI integrations, production consulting and ongoing support."
        ]
      ],
      [
        "How we approach projects",
        [
          "Start by defining the business problem and a measurable outcome.",
          "Choose the simplest architecture that meets the requirements; add agent autonomy only where it helps.",
          "Plan evaluation, security, deployment and operational ownership together."
        ]
      ],
      [
        "Who we work with",
        [
          "Individuals and startups exploring practical automation or AI-enabled products.",
          "Organizations and enterprises integrating AI into existing workflows.",
          "Engineering and operations teams preparing AI systems for production."
        ]
      ]
    ],
    "related": [
      "solutions",
      "agentic-automation",
      "agents",
      "consulting",
      "ai-integrations",
      "ai-support"
    ]
  },
  "insights": {
    "path": "/insights",
    "label": "Insights",
    "title": "AI Engineering Insights & Practical Guides",
    "description": "Read Lutic's practical engineering guides on AI agents, workflow automation, production evaluation and reliable AI deployment.",
    "heading": "Lutic engineering insights.",
    "social": "Practical guides for building AI.",
    "type": "CollectionPage",
    "intro": "Technical guides for people deciding how to build, evaluate and operate AI systems. The examples are illustrative engineering patterns, not claims about customer outcomes.",
    "sections": [],
    "related": [
      "production-ai-checklist",
      "agentic-workflow-design"
    ]
  },
  "production-ai-checklist": {
    "path": "/insights/production-ai-checklist",
    "label": "Production AI checklist",
    "title": "Production AI Checklist: From Prototype to Deployment",
    "description": "A practical checklist for evaluating a production AI system: quality, security, reliability, cost, observability and rollback before launch.",
    "heading": "A production AI checklist: from prototype to deployment.",
    "social": "A checklist for production-ready AI.",
    "type": "WebPage",
    "article": true,
    "intro": "A successful demo is not proof of a reliable production system. Use this checklist to make the deployment decision explicit and testable. The criteria below are engineering guidance, not universal compliance requirements.",
    "sections": [
      [
        "1. Define a measurable outcome",
        [
          "Write down the task, the expected output and the failure modes. For a document assistant, include answer correctness, source attribution and the ability to abstain when evidence is missing.",
          "Build a representative evaluation set, including ambiguous questions, permission boundaries and documents that disagree. Separate the evaluation set from examples used to tune prompts.",
          "Choose acceptance thresholds based on business impact. Record who is responsible for the final release decision."
        ]
      ],
      [
        "2. Establish security boundaries",
        [
          "Give each integration only the permissions it needs. Test that users cannot retrieve another team's protected documents or trigger unauthorized writes.",
          "Treat retrieved content and tool responses as untrusted data; validate actions outside the model. Keep secrets out of prompts and logs.",
          "Decide which actions require approval, and what happens if an approver is unavailable."
        ]
      ],
      [
        "3. Test failures, latency and cost",
        [
          "Simulate timeouts, rate limits, partial writes, malformed tool arguments and repeated requests. Use bounded retries and idempotency for side effects.",
          "Measure end-to-end latency and cost per successful task under representative traffic. A cheap individual model call may still lead to an expensive multi-step workflow.",
          "Set time, tool-call and budget limits; define an escalation route when they are reached."
        ]
      ],
      [
        "4. Release with an operational plan",
        [
          "Version models, prompts and tool schemas. Run regression tests before changes reach users.",
          "Roll out to a bounded cohort first, instrument task outcomes and retain appropriately redacted traces.",
          "Name an operational owner, establish a rollback path and document known limitations. Review actual failures before increasing autonomy."
        ]
      ]
    ],
    "related": [
      "consulting",
      "ai-support",
      "ai-integrations",
      "agentic-workflow-design"
    ]
  },
  "agentic-workflow-design": {
    "path": "/insights/agentic-workflow-design",
    "label": "Agentic workflow design",
    "title": "How to Design Reliable Agentic AI Workflows",
    "description": "Learn to design bounded AI agents with tool contracts, approval gates, verifiable outcomes, state management and human escalation.",
    "heading": "How to design reliable agentic AI workflows.",
    "social": "A practical agent design guide.",
    "type": "WebPage",
    "article": true,
    "intro": "An agentic workflow uses a model to select or sequence actions toward a goal. It is useful when the next step depends on context, but a deterministic workflow is often better for predictable tasks.",
    "sections": [
      [
        "Start with a decision boundary",
        [
          "Separate predictable steps from steps that need language understanding. Use deterministic code for validation, calculations, permission checks and ordinary branching.",
          "For an illustrative support workflow, allow the agent to classify a ticket and retrieve order details; require human approval before issuing a refund when policy demands it.",
          "Define an explicit completion state: for example, a valid draft response or a verified change in a system of record."
        ]
      ],
      [
        "Design tools as contracts",
        [
          "Give each tool a narrow purpose, typed input and structured result. Include clear errors that tell the workflow whether retrying is appropriate.",
          "Validate permissions and business rules independently of the model. Treat content returned by tools as data, not higher-priority instructions.",
          "Use idempotency keys or a durable operation record for writes; a retry should not accidentally perform the same action twice."
        ]
      ],
      [
        "Control the execution loop",
        [
          "Store durable state between steps, including pending approvals and previous tool results. Bound the number of calls, elapsed time and spend.",
          "Use human escalation for missing evidence, contradictory instructions and high-impact decisions.",
          "Verify results against the system of record instead of trusting a model's statement that an action succeeded."
        ]
      ],
      [
        "Evaluate before expanding autonomy",
        [
          "Measure completed tasks, incorrect actions, escalation rate and cost per success on realistic inputs.",
          "Include adversarial documents, stale state, tool downtime and permission failures in tests.",
          "Increase permitted actions only after reviewing errors and establishing monitoring and rollback."
        ]
      ]
    ],
    "related": [
      "agentic-automation",
      "agents",
      "ai-integrations",
      "production-ai-checklist"
    ]
  }
};
