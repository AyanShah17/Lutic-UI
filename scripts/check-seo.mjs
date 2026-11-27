import assert from "node:assert/strict";
import {pages} from "../lib/seo.mjs";
const target=new URL(process.argv[2]||"http://localhost:3000").origin;
const expected=new URL(process.env.SITE_URL||target).origin;
const noindex=process.env.EXPECT_NOINDEX==="1";
async function get(path){const r=await fetch(target+path,{headers:{"User-Agent":"Googlebot"}});assert.equal(r.status,200,path);return r;}
const attr=(tag,name)=>tag.match(new RegExp("\\b"+name+"=\"([^\"]*)\"","i"))?.[1];
for(const [key,p] of Object.entries(pages)){
 const r=await get(p.path),html=await r.text(),tags=html.match(/<(meta|link)\b[^>]*>/gi)||[];
 const find=(name,value)=>tags.find(t=>attr(t,name)===value)||"";
 const meta=(name,value)=>attr(find(name,value),"content");
 assert.equal((html.match(/<h1(?:\s|>)/gi)||[]).length,1,p.path);
 assert.ok(html.includes("<title>"));assert.ok(meta("name","description"));assert.ok(meta("property","og:title"));assert.equal(meta("name","twitter:card"),"summary_large_image");
 if(noindex)assert.match(meta("name","robots")||r.headers.get("x-robots-tag")||"",/noindex/i);
 else{
  assert.equal(attr(find("rel","canonical"),"href"),expected+p.path);
  assert.doesNotMatch(meta("name","robots")||"",/noindex/i);
  assert.doesNotMatch(r.headers.get("x-robots-tag")||"",/noindex/i);
  assert.match(html,/application\/ld\+json/);
 }
 const og=await get("/og/"+key);assert.match(og.headers.get("content-type")||"",/image\/png/);
 console.log("PASS",p.path);
}
const robots=await (await get("/robots.txt")).text(),sitemap=await (await get("/sitemap.xml")).text();
if(noindex)assert.ok(!sitemap.includes("<loc>"));
else{assert.ok(robots.includes(expected+"/sitemap.xml"));for(const p of Object.values(pages))assert.ok(sitemap.includes("<loc>"+expected+p.path+"</loc>"));}
const homepage=await (await get("/")).text();
const iconTags=(homepage.match(/<link\b[^>]*>/gi)||[]).filter(t=>attr(t,"rel")==="icon");
assert.ok(iconTags.some(t=>new URL(attr(t,"href"),target).pathname==="/favicon.png"&&attr(t,"sizes")==="192x192"&&attr(t,"type")==="image/png"),"stable PNG favicon link");
const favicon=await get("/favicon.png");
assert.match(favicon.headers.get("content-type")||"",/image\/png/);
if(!noindex)assert.doesNotMatch(favicon.headers.get("x-robots-tag")||"",/noindex/i);
const png=Buffer.from(await favicon.arrayBuffer());
assert.equal(png.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
assert.equal(png.readUInt32BE(16),192);assert.equal(png.readUInt32BE(20),192);
assert.equal((await get("/icon.svg")).status,200);
const reel=await get("/motion-loop.html");assert.match(reel.headers.get("x-robots-tag")||"",/noindex/i);
console.log("PASS robots, sitemap and motion asset");
