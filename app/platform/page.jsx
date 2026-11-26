import PlatformOverview from "@/components/platform-overview";
import Link from "next/link";
import Motion from "@/components/motion";
import PlatformExplorer from "@/components/platform-explorer";
import {pageMetadata,site} from "@/lib/seo.mjs";
import {PageSchema,Breadcrumbs} from "@/components/page-seo";
export const metadata = pageMetadata("platform",site);
export default function PlatformPage(){return <><PageSchema page="platform"/><Motion page="platform"/><section data-view={"platform"} style={{"padding":"0"}} className={"show"}><div className={"wrap pg"}><Breadcrumbs page="platform"/><h1>An AI operations platform for industrial teams.</h1><p className={"lead"}>Explore how an industrial AI platform can bring together agentic dashboards, machine telemetry, alarms, work orders, manuals and business systems. Pick a feature to see an interactive illustration. Product capability and availability should be confirmed with Lutic.</p></div><div className={"wrap"}><div data-nosnippet=""><PlatformExplorer/></div><h2>How it fits together</h2><div className={"arch"}><span>Operators and admins</span><i>&rarr;</i><span>Web application</span><i>&rarr;</i><span>Agent orchestrator and policy engine</span><i>&rarr;</i><span>AI gateway and connectors</span><i>&rarr;</i><span>PostgreSQL with pgvector</span></div><PlatformOverview/></div><div className={"cta"}><div className={"wrap"}><h2>See it on your own plant data.</h2><Link className={"btn"} href={"/contact"}>Book a demo</Link></div></div></section></>;}
