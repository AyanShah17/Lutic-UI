import {NextResponse} from "next/server";
const interests=new Set(["AI solutions","Agentic automations","Production consulting","AI support","Integrations","Autonomous systems"]);
const fail=(error,status)=>NextResponse.json({error},{status});
export async function POST(request){
 const origin=request.headers.get("origin");
 if(origin&&origin!==new URL(request.url).origin&&origin!==process.env.CONTACT_ALLOWED_ORIGIN)return fail("Invalid request origin.",403);
 if(!request.headers.get("content-type")?.includes("application/json"))return fail("Expected JSON.",415);
 const size=Number(request.headers.get("content-length")||0);if(size>16000)return fail("Message too large.",413);
 let data;try{const raw=await request.text();if(raw.length>16000)return fail("Message too large.",413);data=JSON.parse(raw);}catch{return fail("Invalid request.",400)}
 const {name,email,interest,message}=data??{};
 if(typeof name!=="string"||!name.trim()||name.length>120||typeof email!=="string"||email.length>254||!/^\S+@\S+\.\S+$/.test(email)||!interests.has(interest)||typeof message!=="string"||!message.trim()||message.length>5000)return fail("Please check your contact details and message.",400);
 const endpoint=process.env.CONTACT_WEBHOOK_URL;if(!endpoint)return fail("Contact delivery is not configured. Please try again later.",503);
 try{const url=new URL(endpoint);if(url.protocol!=="https:")throw Error("HTTPS required");const headers={"Content-Type":"application/json"};if(process.env.CONTACT_WEBHOOK_TOKEN)headers.Authorization="Bearer "+process.env.CONTACT_WEBHOOK_TOKEN;const res=await fetch(url,{method:"POST",headers,body:JSON.stringify({name:name.trim(),email:email.trim(),interest,message:message.trim()}),signal:AbortSignal.timeout(10000),redirect:"error",cache:"no-store"});if(!res.ok)throw Error("Delivery failed");return NextResponse.json({ok:true});}catch{return fail("Message could not be delivered. Please try again later.",502)}
}
