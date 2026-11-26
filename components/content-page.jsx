import Link from "next/link";
import {content} from "@/lib/content.mjs";
import {pages} from "@/lib/seo.mjs";
import {PageSchema,Breadcrumbs} from "@/components/page-seo";
export default function ContentPage({page}){
 const p=content[page];
 return <><PageSchema page={page}/><section className="show seo-content" data-view={page}><div className="wrap pg"><Breadcrumbs page={page}/><div className="seo-reading"><span className="seo-kicker">{p.article?"Lutic engineering guide":p.label}</span><h1>{p.heading}</h1><p className="lead">{p.intro}</p>{p.article&&<p className="seo-byline">Lutic · Engineering insights</p>}</div></div>
 <div className="wrap seo-reading">{p.sections.map(([heading,items])=><section className="seo-section" key={heading}><h2>{heading}</h2>{p.article?items.map(item=><p key={item}>{item}</p>):<ul>{items.map(item=><li key={item}>{item}</li>)}</ul>}</section>)}
 <section className="seo-section"><h2>{page==="insights"?"Read the guides":"Explore related resources"}</h2><div className="seo-related">{p.related.map(key=><Link className="seo-resource" href={pages[key].path} key={key}><strong>{pages[key].label}</strong><p>{pages[key].description}</p><span>Explore →</span></Link>)}</div></section>
 <section className="seo-section"><h2>Discuss your AI project with Lutic.</h2><p>Tell us what you want to build, integrate or improve.</p><Link className="btn" href="/contact">Book a call</Link></section>
 </div></section></>;
}
