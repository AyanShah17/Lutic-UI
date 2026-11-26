import test from "node:test";
import assert from "node:assert/strict";
import {INTRO_DURATION,INTRO_HANDOFF,INTRO_PHASES,shouldPlayIntro,handoffGeometry} from "../lib/intro.mjs";

test("storyboard timing is exactly ten seconds",()=>{
 assert.equal(INTRO_DURATION,10000);
 assert.equal(INTRO_HANDOFF,8800);
 assert.deepEqual(INTRO_PHASES.map(p=>[p.start,p.label]),[[0,"Awaken"],[2000,"Connect"],[4500,"Execute"],[7500,"Return"]]);
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
