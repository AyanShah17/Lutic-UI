import test from "node:test";
import assert from "node:assert/strict";
import {INTRO_DURATION,INTRO_HANDOFF,INTRO_RECENTER,INTRO_GATE_OPEN,INTRO_PHASES,shouldPlayIntro,shouldResetHomepageScroll,HOME_RELOAD_SCROLL_SCRIPT,handoffGeometry,cursorPose,PIXEL_GLYPHS,pixelWordmark,revealProgress} from "../lib/intro.mjs";

test("wordmark, mascot and homepage fit into the 4.5-second sequence",()=>{
 assert.equal(INTRO_DURATION,4500);
 assert.equal(INTRO_HANDOFF,3420);
 assert.equal(INTRO_RECENTER,3150);
 assert.equal(INTRO_GATE_OPEN,INTRO_HANDOFF);
 assert.ok(INTRO_RECENTER<INTRO_HANDOFF&&INTRO_HANDOFF<INTRO_DURATION);
 assert.deepEqual(INTRO_PHASES.map(p=>[p.start,p.label]),[[0,"Wordmark"],[1170,"Mascot"],[3420,"Gate opening"]]);
});
test("fresh homepage and homepage reload play; ordinary repeat visits bypass",()=>{
 assert.equal(shouldPlayIntro(),true);
 assert.equal(shouldPlayIntro({seen:true,reload:true}),true);
 assert.equal(shouldPlayIntro({seen:true,reload:true,scrollY:800}),true);
 for(const options of [{seen:true},{reducedMotion:true},{hash:"#main-content"},{scrollY:12},{reload:true,reducedMotion:true},{reload:true,hash:"#main-content"}])assert.equal(shouldPlayIntro(options),false);
});
test("shared mascot lands at hero center and scales to hero width",()=>{
 assert.deepEqual(handoffGeometry({left:300,top:200,width:100,height:100},{left:700,top:100,width:300,height:300}),{x:500,y:0,scale:3,matched:true});
 assert.equal(handoffGeometry(null,null).matched,false);
 assert.equal(handoffGeometry({width:0,height:0},{width:100,height:100}).matched,false);
});

test("cursor follow is directional, bounded and neutral at center",()=>{
 assert.deepEqual(cursorPose(0,0,140),{x:0,y:0,eyeX:0,eyeY:0});
 const far=cursorPose(1000,-1000,140);
 assert.ok(far.x>0&&far.y<0&&far.eyeX>0&&far.eyeY<0);
 assert.ok(Math.hypot(far.x,far.y)<=20.001);
 assert.ok(Math.hypot(far.eyeX,far.eyeY)<=8.001);
 assert.ok(cursorPose(50,0,140).x<cursorPose(1000,0,140).x);
 assert.deepEqual(cursorPose(NaN,0,140),{x:0,y:0,eyeX:0,eyeY:0});
});

test("pixel wordmark has five glyphs, unique integer cells and fixed dimensions",()=>{
 const mark=pixelWordmark(PIXEL_GLYPHS);
 assert.equal(mark.height,9);assert.equal(PIXEL_GLYPHS.length,5);
 assert.equal(new Set(mark.pixels.map(p=>p.x+","+p.y)).size,mark.pixels.length);
 assert.ok(mark.pixels.every(p=>Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=0&&p.x<mark.width&&p.y>=0&&p.y<mark.height));
});
test("gate and logo share a bounded easing clock",()=>{
 assert.equal(revealProgress(0,1080),0);assert.equal(revealProgress(540,1080),.5);assert.equal(revealProgress(1080,1080),1);assert.equal(revealProgress(5000,1080),1);
});

test("scroll reset only applies to a fresh homepage reload, not deep links or history traversal",()=>{
 const reload={navigationType:"reload",pathname:"/"};
 assert.equal(shouldResetHomepageScroll(reload),true);
 for(const options of [{...reload,hash:"#lutic-services"},{...reload,consumed:true},{...reload,pathname:"/solutions"},{...reload,navigationType:"back_forward"},{...reload,navigationType:"navigate"}])assert.equal(shouldResetHomepageScroll(options),false);
});
test("early scroll script holds manual restoration while intro is active and releases after pageshow",()=>{
 // Simulate the browser lifecycle without a DOM or a network.
 const callbacks=[],events={},calls=[];
 const history={scrollRestoration:"auto"};
 const window={scrollTo:opts=>calls.push(opts),addEventListener:(name,fn)=>events[name]=fn};
 const document={documentElement:{classList:{contains:()=>true}}};
 const performance={getEntriesByType:()=>[{type:"reload"}]};
 const location={pathname:"/",hash:""};
 const requestAnimationFrame=fn=>callbacks.push(fn);
 new Function("window","document","performance","history","location","requestAnimationFrame",HOME_RELOAD_SCROLL_SCRIPT)(window,document,performance,history,location,requestAnimationFrame);
 assert.equal(history.scrollRestoration,"manual");
 assert.deepEqual(calls[0],{top:0,left:0,behavior:"instant"});
 events.pageshow();callbacks.shift()();callbacks.shift()();
 assert.equal(history.scrollRestoration,"manual");
 window.__luticReleaseHomeScroll();
 assert.equal(history.scrollRestoration,"auto");
 assert.equal(window.__luticReleaseHomeScroll,undefined);
});
