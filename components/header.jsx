"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState,useEffect} from "react";
import Logo from "./logo";
const links=[["/solutions","Solutions"],["/platform","Platform"],["/agents","Agents"],["/consulting","Consulting"],["/contact","Contact"]];
export default function Header(){
  const pathname=usePathname(),[open,setOpen]=useState(false);
  useEffect(()=>{setOpen(false)},[pathname]);
  useEffect(()=>{function escape(e){if(e.key==="Escape")setOpen(false)}window.addEventListener("keydown",escape);return()=>window.removeEventListener("keydown",escape)},[]);
  return <><a href="#main-content" className="skip-link">Skip to content</a><div className="bar-top" aria-hidden="true"/><nav aria-label="Main navigation" className={open?"open":""}><Link className="brand" href="/" onClick={()=>setOpen(false)} aria-label="Lutic home"><Logo/>Lutic</Link>{links.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)} className={"l"+(pathname===href?" on":"")} aria-current={pathname===href?"page":undefined}>{label}</Link>)}<button type="button" className="mb" aria-expanded={open} aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(v=>!v)}>{open?"Close":"Menu"}</button><Link className="btn" href="/contact" onClick={()=>setOpen(false)}>Book a call</Link></nav></>;
}
