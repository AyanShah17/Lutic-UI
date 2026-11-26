import Link from "next/link";
import {pages,site,structuredData} from "@/lib/seo.mjs";
export function PageSchema({page}){
 const data=structuredData(page,site);
 if(!data)return null;
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/>;
}
export function Breadcrumbs({page}){
 return <div role="navigation" aria-label="Breadcrumb" className="breadcrumbs"><ol><li><Link href="/">Home</Link></li><li aria-current="page">{pages[page].label}</li></ol></div>;
}
