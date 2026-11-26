import Link from "next/link";
import Motion from "@/components/motion";
import ContactForm from "@/components/contact-form";
export const metadata = {"title":"Contact Lutic","description":"Tell us about the AI system or workflow you want to build."};
export default function ContactPage(){return <><Motion page="contact"/><section data-view={"contact"} style={{"padding":"0"}} className={"show"}><div className={"wrap pg"}><div className={"split"}><div><h1 style={{"fontSize":"clamp(40px,5vw,68px)"}}>Let us build it together.</h1><p className={"lead"}>Tell us about the work you want done. Share your requirements and preferred next steps.</p></div>
<ContactForm/></div></div></section></>;}
