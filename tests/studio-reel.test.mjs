import test from "node:test";
import assert from "node:assert/strict";
import {SCENES,SCENE_SECONDS,REEL_SECONDS,reelPosition,advanceReel,nextSceneIndex,shouldRunReel} from "../lib/studio-reel.mjs";
import {pages} from "../lib/seo.mjs";
test("all six studio offerings have distinct scenes and real service links",()=>{
 assert.equal(SCENES.length,6);assert.equal(REEL_SECONDS,24);
 assert.equal(new Set(SCENES.map(s=>s.key)).size,6);
 for(const s of SCENES){assert.equal(s.steps.length,3);assert.ok(Object.values(pages).some(p=>p.path===s.href));}
});
test("chapter seeking, progress, and loop boundaries",()=>{
 for(let i=0;i<6;i++){assert.deepEqual(reelPosition(i*SCENE_SECONDS),{index:i,progress:0,step:0});}
 assert.deepEqual(reelPosition(24),{index:5,progress:1,step:2});
 assert.equal(reelPosition(-3).index,0);
 assert.equal(reelPosition(NaN).index,0);
 assert.equal(reelPosition(2).step,1);
 assert.equal(advanceReel(23,1),0);
 assert.equal(advanceReel(3,-1),3);
});

test("native scene clock loops through every offering and returns to the first",()=>{
 let index=0;const seen=[];
 for(let i=0;i<SCENES.length;i++){seen.push(index);index=nextSceneIndex(index);}
 assert.deepEqual(seen,[0,1,2,3,4,5]);assert.equal(index,0);
});
test("hover or incidental pointer focus cannot freeze visible autoplay",()=>{
 assert.equal(shouldRunReel({visible:true,hovered:true,focused:true}),true);
 for(const flags of [{visible:false},{visible:true,reduced:true},{visible:true,paused:true},{visible:true,keyboardLinkFocus:true}])assert.equal(shouldRunReel(flags),false);
 assert.equal(shouldRunReel({visible:true,paused:false}),true);
});
