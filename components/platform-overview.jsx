// Visible, server-rendered descriptions of all eleven product demo areas.
const capabilities=[
 ["Agentic dashboards","Explore governed industrial KPIs such as overall equipment effectiveness (OEE), throughput, downtime and quality."],
 ["Work order management","Coordinate maintenance tasks and plant work through an execution board and work order workflows."],
 ["Machine monitoring","Explore telemetry, equipment alarms and industrial protocol integration, including MQTT, OPC-UA and Modbus TCP."],
 ["Knowledge retrieval and RAG","Find relevant information in technical manuals, fault codes and procedures using retrieval-augmented generation."],
 ["Multi-agent orchestration","Coordinate specialist AI agents, stream responses and route sensitive actions for verification."],
 ["AI governance","Explore role-based permissions, approval gates, policy validation and audit trails."],
 ["Enterprise and industrial integrations","Connect AI workflows to business tools, historians, CMMS, ERP and manufacturing execution systems."],
 ["Reliable workflows","Explore checkpoints, retries, queues and background execution for longer-running automation."],
 ["Security and tenant isolation","Explore scoped access, credential protection and outbound request controls."],
 ["Workspace management","Explore account, role and tenant management for individual and enterprise workspaces."],
 ["Deployment architecture","Review self-hosted deployment concepts, PostgreSQL with pgvector, worker processes and backup planning."]
];
export default function PlatformOverview(){return <section className="seo-overview" aria-labelledby="capabilities"><h2 id="capabilities">Industrial AI platform capabilities</h2><p className="lead">Explore the workflows illustrated in the Lutic product concept. The examples are not connected to live equipment or production services.</p><div className="seo-capability-grid">{capabilities.map(([title,description])=><article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div></section>}
