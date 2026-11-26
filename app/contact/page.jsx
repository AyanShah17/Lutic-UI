import Link from "next/link";
import Motion from "@/components/motion";
import ContactForm from "@/components/contact-form";
import {pageMetadata,site} from "@/lib/seo.mjs";
import {PageSchema,Breadcrumbs} from "@/components/page-seo";
export const metadata = pageMetadata("contact",site);
export default function ContactPage(){return <><PageSchema page="contact"/><Motion page="contact"/><section data-view={"contact"} style={{"padding":"0"}} className={"show"}><div className={"wrap pg"}><Breadcrumbs page="contact"/><div className={"split"}><div><h1 style={{"fontSize":"clamp(40px,5vw,68px)"}}>Let us build your AI solution together.</h1><p className={"lead"}>Tell us about your AI automation, custom agent, integration or consulting project. Share your requirements and preferred next steps.</p></div>
<ContactForm/></div></div></section></>;}
