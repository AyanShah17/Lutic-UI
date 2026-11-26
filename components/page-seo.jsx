import Link from "next/link";
import {breadcrumbs,site,structuredData} from "@/lib/seo.mjs";
export function PageSchema({page}){
 const data=structuredData(page,site);
 if(!data)return null;
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/>;
}
export function Breadcrumbs({page}){
 return <div role="navigation" aria-label="Breadcrumb" className="breadcrumbs"><ol>{breadcrumbs(page).map((crumb,i,all)=>i===all.length-1?<li key={crumb.path} aria-current="page">{crumb.label}</li>:<li key={crumb.path}><Link href={crumb.path}>{crumb.label}</Link></li>)}</ol></div>;
}
