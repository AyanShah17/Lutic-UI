import test from "node:test";
import assert from "node:assert/strict";
import {pages,getSiteSettings,pageMetadata,sitemapEntries,robotsConfig,structuredData} from "../lib/seo.mjs";
const live=getSiteSettings({SITE_URL:"https://example.com",NODE_ENV:"production"});
const preview=getSiteSettings({SITE_URL:"https://example.com",NODE_ENV:"production",VERCEL_ENV:"preview"});
test("only configured production is indexable",()=>{
 assert.equal(live.indexable,true);assert.equal(preview.indexable,false);
 for(const env of [{},{NODE_ENV:"production"},{SITE_URL:"http://example.com",NODE_ENV:"production"},{SITE_URL:"https://localhost",NODE_ENV:"production"},{SITE_URL:"https://example.com/path",NODE_ENV:"production"},{SITE_URL:"https://example.com",NODE_ENV:"development"},{SITE_URL:"https://example.com",NODE_ENV:"production",SEO_NOINDEX:"1"},{SITE_URL:"https://example.com",NODE_ENV:"production",CONTEXT:"deploy-preview"}])assert.equal(getSiteSettings(env).indexable,false);
});
test("unique page metadata and matching canonical URLs",()=>{
 const titles=new Set(),descriptions=new Set();
 for(const [key,p] of Object.entries(pages)){
  const m=pageMetadata(key,live);titles.add(typeof m.title==="string"?m.title:m.title.absolute);descriptions.add(m.description);
  assert.equal(m.alternates.canonical,"https://example.com"+p.path);
  assert.equal(m.openGraph.url,m.alternates.canonical);
  assert.equal(m.openGraph.images[0].url,"https://example.com/og/"+key);
  assert.equal(pageMetadata(key,preview).robots.index,false);
  assert.equal(pageMetadata(key,preview).alternates,undefined);
 }
 assert.equal(titles.size,Object.keys(pages).length);assert.equal(descriptions.size,Object.keys(pages).length);assert.equal(Object.keys(pages).length,13);
});
test("sitemap and robots share canonical origin",()=>{
 assert.deepEqual(sitemapEntries(live).map(x=>x.url),Object.values(pages).map(x=>"https://example.com"+x.path));
 assert.deepEqual(sitemapEntries(preview),[]);
 assert.equal(robotsConfig(live).sitemap,"https://example.com/sitemap.xml");assert.equal(robotsConfig(preview).sitemap,undefined);
});
test("structured data matches public page identities",()=>{
 for(const [key,p] of Object.entries(pages)){
  const graph=structuredData(key,live)["@graph"];
  assert.equal(graph.filter(n=>n["@type"]==="Organization").length,1);
  assert.equal(graph.filter(n=>n["@type"]==="BreadcrumbList").length,key==="home"?0:1);
  assert.ok(graph.some(n=>n["@id"]==="https://example.com"+p.path+"#webpage"));
  assert.equal(graph.filter(n=>n["@type"]==="Service").length,p.services?.length||0);
  assert.equal(structuredData(key,preview),null);
 }
});

test("brand-first homepage, editorial pages and service URLs",()=>{
 assert.equal(pageMetadata("home",live).title.absolute,"Lutic | AI Solutions, Automation & Consulting");
 const names=["agentic-automation","ai-integrations","ai-support","about","insights","production-ai-checklist","agentic-workflow-design"];
 for(const key of names)assert.ok(pages[key]);
 const graph=structuredData("production-ai-checklist",live)["@graph"];
 assert.equal(graph.find(n=>n["@type"]==="BreadcrumbList").itemListElement.length,3);
 assert.equal(graph.find(n=>n["@type"]==="Article").headline,pages["production-ai-checklist"].heading);
});

test("preferred site name and square organization logo",()=>{
 const graph=structuredData("home",live)["@graph"];
 const website=graph.find(n=>n["@type"]==="WebSite"),org=graph.find(n=>n["@type"]==="Organization");
 assert.equal(website.name,"Lutic");assert.equal(website.url,"https://example.com/");
 assert.ok(website.alternateName.includes("Lutic AI Studio"));
 assert.equal(org.logo.url,"https://example.com/favicon.png");
 assert.equal(org.logo.width,192);assert.equal(org.logo.height,192);
 assert.equal(pageMetadata("home",live).openGraph.siteName,"Lutic");
});
