import test from "node:test";
import assert from "node:assert/strict";
import {INTRO_DURATION,INTRO_HANDOFF,INTRO_RECENTER,INTRO_PHASES,shouldPlayIntro,handoffGeometry,cursorPose} from "../lib/intro.mjs";

test("wordmark, mascot and homepage fit into the 4.5-second sequence",()=>{
 assert.equal(INTRO_DURATION,4500);
 assert.equal(INTRO_HANDOFF,3600);
 assert.equal(INTRO_RECENTER,3350);
 assert.ok(INTRO_RECENTER<INTRO_HANDOFF&&INTRO_HANDOFF<INTRO_DURATION);
 assert.deepEqual(INTRO_PHASES.map(p=>[p.start,p.label]),[[0,"Wordmark"],[1170,"Mascot"],[3600,"Homepage"]]);
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
