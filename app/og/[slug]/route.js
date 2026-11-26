import {ImageResponse} from "next/og";
import {createElement as h} from "react";
import {pages} from "@/lib/seo.mjs";
export async function GET(_request,{params}){
 const {slug}=await params;
 if(!Object.hasOwn(pages,slug))return new Response("Not found",{status:404});
 const p=pages[slug];
 const image=h("div",{style:{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:72,backgroundColor:"#fbfbfa",color:"#101012",borderTop:"12px solid #ee5414",fontFamily:"sans-serif"}},
  h("div",{style:{display:"flex",alignItems:"center",gap:20}},
   h("div",{style:{width:66,height:66,borderRadius:22,backgroundColor:"#ee5414",display:"flex",alignItems:"center",justifyContent:"center"}},h("div",{style:{width:42,height:42,borderRadius:42,backgroundColor:"#101012",display:"flex",alignItems:"center",justifyContent:"center",gap:9}},h("div",{style:{width:5,height:8,borderRadius:4,backgroundColor:"white"}}),h("div",{style:{width:5,height:8,borderRadius:4,backgroundColor:"white"}}))),
   h("div",{style:{fontSize:40,fontWeight:700}},"Lutic")),
  h("div",{style:{display:"flex",flexDirection:"column",gap:20}},
   h("div",{style:{fontSize:25,color:"#b8400f",fontWeight:600}},p.label.toUpperCase()),
   h("div",{style:{fontSize:76,fontWeight:700,lineHeight:1.04,maxWidth:1010}},p.social)),
  h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid #d6d6d0",paddingTop:20,fontSize:23,color:"#53535a"}},h("div",null,"AI solutions · Agentic automation · Consulting"),h("div",null,"LUTIC")));
 return new ImageResponse(image,{width:1200,height:630,headers:{"Cache-Control":"public, max-age=86400, s-maxage=86400","X-Robots-Tag":"noindex"}});
}
