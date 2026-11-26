// One source of truth for metadata, indexing, social previews and sitemap.
export const pages = {
  "home": {
    "path": "/",
    "label": "Home",
    "title": "AI Solutions & Agentic Automation",
    "description": "Lutic builds custom AI solutions, AI agents and business workflow automations, with production consulting, system integration and ongoing AI support.",
    "heading": "The AI studio that ships working systems.",
    "social": "AI systems that work in production.",
    "type": "WebPage"
  },
  "solutions": {
    "path": "/solutions",
    "label": "AI solutions",
    "title": "Custom AI Solutions & AI Integrations",
    "description": "Build custom AI copilots, retrieval-augmented generation (RAG), document processing and workflow automation with secure CRM, ERP and business tool integrations.",
    "heading": "Custom AI solutions built for production.",
    "social": "Custom AI, connected to your business.",
    "type": "WebPage",
    "services": [
      [
        "AI solutions",
        "Custom copilots, search, document processing and prediction models."
      ],
      [
        "Agentic automation",
        "Tool-using agents, approval gates, retries and run traces."
      ],
      [
        "AI integrations",
        "Scoped access to CRM, ERP, ticketing, data warehouses and business systems."
      ]
    ]
  },
  "platform": {
    "path": "/platform",
    "label": "AI operations platform",
    "title": "Industrial AI & Agentic Operations Platform",
    "description": "Explore interactive industrial AI demos for OEE dashboards, machine monitoring, knowledge retrieval, multi-agent orchestration and governance.",
    "heading": "An AI operations platform for industrial teams.",
    "social": "Industrial intelligence, connected.",
    "type": "WebPage"
  },
  "agents": {
    "path": "/agents",
    "label": "AI agents",
    "title": "Autonomous AI Agents & Agentic AI Systems",
    "description": "Explore autonomous AI agents for business workflows with tool permissions, human approvals, evaluation, observability and policy-based guardrails.",
    "heading": "Autonomous AI agents that stay inside the lines.",
    "social": "Autonomous agents. Human control.",
    "type": "WebPage",
    "services": [
      [
        "Autonomous AI systems",
        "Long-running agents with defined boundaries, observability, evaluation and human handoff."
      ]
    ]
  },
  "consulting": {
    "path": "/consulting",
    "label": "AI consulting",
    "title": "AI Consulting, Production Deployment & Support",
    "description": "Take AI from prototype to production with Lutic’s architecture, evaluation, integration, deployment planning, monitoring and ongoing AI support.",
    "heading": "AI consulting to ship it. Support to keep it running.",
    "social": "From AI prototype to production.",
    "type": "WebPage",
    "services": [
      [
        "AI production consulting",
        "Architecture, evaluation and rollout planning for production AI systems."
      ],
      [
        "AI support",
        "Monitoring, tuning and support for deployed AI systems."
      ]
    ]
  },
  "contact": {
    "path": "/contact",
    "label": "Contact",
    "title": "Contact Lutic for AI Consulting & Automation",
    "description": "Discuss your AI project with Lutic. Share your requirements for custom AI solutions, agentic automation, integrations, production consulting or support.",
    "heading": "Let us build your AI solution together.",
    "social": "Tell us what to automate first.",
    "type": "ContactPage"
  }
};

export function getSiteSettings(env={}){
 const raw=(env.SITE_URL||"").trim().toLowerCase();
 const m=raw.match(/^https:\/\/((?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z](?:[a-z0-9-]*[a-z0-9])?)\/?$/);
 const origin=m&&!m[1].endsWith(".local")&&!m[1].endsWith(".localhost")?"https://"+m[1]:null;
 const production=env.NODE_ENV==="production"&&(!env.VERCEL_ENV||env.VERCEL_ENV==="production")&&(!env.CONTEXT||env.CONTEXT==="production");
 return {origin,indexable:Boolean(origin&&production&&env.SEO_NOINDEX!=="1")};
}

export function canonicalUrl(settings,path){return settings.origin?settings.origin+path:null;}

export function pageMetadata(key,settings){
 const p=pages[key];if(!p)throw Error("Unknown SEO page: "+key);
 const title=p.title+" | Lutic",path="/og/"+key,canonical=settings.indexable?canonicalUrl(settings,p.path):null,image=canonicalUrl(settings,path)||path;
 return {title:p.title,description:p.description,...(canonical?{alternates:{canonical}}:{}),
 openGraph:{type:"website",siteName:"Lutic",locale:"en_US",title,description:p.description,...(canonical?{url:canonical}:{}),images:[{url:image,width:1200,height:630,alt:"Lutic — "+p.social}]},
 twitter:{card:"summary_large_image",title,description:p.description,images:[{url:image,alt:"Lutic — "+p.social}]},
 robots:settings.indexable?{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}}:{index:false,follow:false}};
}

export function sitemapEntries(settings){return settings.indexable?Object.values(pages).map(p=>({url:canonicalUrl(settings,p.path)})):[];}

export function robotsConfig(settings){return {rules:{userAgent:"*",allow:"/",disallow:["/api/"]},...(settings.indexable?{sitemap:canonicalUrl(settings,"/sitemap.xml")}:{})};}

export function structuredData(key,settings){
 const p=pages[key];if(!p||!settings.indexable)return null;
 const home=canonicalUrl(settings,"/"),url=canonicalUrl(settings,p.path),org=home+"#organization",web=home+"#website";
 const graph=[{"@type":"Organization","@id":org,name:"Lutic",url:home,logo:canonicalUrl(settings,"/icon.svg"),description:pages.home.description},{"@type":"WebSite","@id":web,url:home,name:"Lutic",publisher:{"@id":org}},{"@type":p.type,"@id":url+"#webpage",url,name:p.title+" | Lutic",description:p.description,isPartOf:{"@id":web},about:{"@id":org},...(key==="home"?{}:{breadcrumb:{"@id":url+"#breadcrumb"}})}];
 if(key!=="home")graph.push({"@type":"BreadcrumbList","@id":url+"#breadcrumb",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:home},{"@type":"ListItem",position:2,name:p.label,item:url}]});
 for(const [i,[name,description]] of (p.services||[]).entries())graph.push({"@type":"Service","@id":url+"#service-"+(i+1),name,serviceType:name,description,provider:{"@id":org},url});
 return {"@context":"https://schema.org","@graph":graph};
}

export const site=getSiteSettings(process.env);
