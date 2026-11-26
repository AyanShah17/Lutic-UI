import test from "node:test";
import assert from "node:assert/strict";
import {SCENES,SCENE_SECONDS,REEL_SECONDS,reelPosition,advanceReel} from "../lib/studio-reel.mjs";
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
