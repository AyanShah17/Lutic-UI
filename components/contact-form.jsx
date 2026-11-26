"use client";
import {useState} from "react";
export default function ContactForm(){
 const [state,setState]=useState({kind:"idle",message:""});
 async function submit(e){
  e.preventDefault();const form=e.currentTarget;setState({kind:"pending",message:"Sending…"});
  try{const res=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(form)))});const data=await res.json();if(!res.ok)throw new Error(data.error||"Unable to send your message.");form.reset();setState({kind:"success",message:"Thank you. Your message was sent."});}
  catch(err){setState({kind:"error",message:err.message||"Unable to send your message."});}
 }
 return <form onSubmit={submit}><input name="name" required maxLength={120} autoComplete="name" placeholder="Your name" aria-label="Name"/><input name="email" required maxLength={254} type="email" autoComplete="email" placeholder="Work email" aria-label="Email"/><select name="interest" aria-label="Interest">{["AI solutions","Agentic automations","Production consulting","AI support","Integrations","Autonomous systems"].map(x=><option key={x}>{x}</option>)}</select><textarea name="message" required maxLength={5000} rows={5} placeholder="What should the AI do for you?" aria-label="Message"/><button className="btn" type="submit" disabled={state.kind==="pending"}>{state.kind==="pending"?"Sending…":"Send message"}</button><p role="status" aria-live="polite" className={"form-status"+(state.kind==="error"?" form-error":"")}>{state.message}</p></form>;
}
