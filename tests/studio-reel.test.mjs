import test from "node:test";
import assert from "node:assert/strict";
import {SCENES,SCENE_SECONDS,FILM_PACE,REEL_SECONDS,reelPosition,advanceReel,nextSceneIndex,shouldRunReel,automationFlow,nextReelState,mascotExpression,mascotEyePose} from "../lib/studio-reel.mjs";
import {pages} from "../lib/seo.mjs";
test("all six studio offerings have distinct scenes and real service links",()=>{
 assert.equal(SCENES.length,6);assert.equal(REEL_SECONDS,42);
 assert.equal(new Set(SCENES.map(s=>s.key)).size,6);
 for(const s of SCENES){assert.equal(s.steps.length,3);assert.ok(Object.values(pages).some(p=>p.path===s.href));}
});
test("chapter seeking, progress, and loop boundaries",()=>{
 for(let i=0;i<6;i++){assert.deepEqual(reelPosition(i*SCENE_SECONDS),{index:i,progress:0,step:0});}
 assert.deepEqual(reelPosition(42),{index:5,progress:1,step:2});
 assert.equal(reelPosition(-3).index,0);
 assert.equal(reelPosition(NaN).index,0);
 assert.equal(reelPosition(3).step,1);
 assert.equal(advanceReel(41,1),0);
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

test("automation connects every stage to the bottom-center mascot port",()=>{
 for(const reviewRequired of [true,false]){
  const nodes=automationFlow(reviewRequired);
  assert.deepEqual(nodes.map(n=>n.key),["request","plan","tools","review","result"]);
  assert.ok(nodes.every(n=>n.d.includes("270 73")||n.d.endsWith("V73")));
  assert.ok(nodes.slice(0,3).every(n=>n.enabled));
  assert.equal(nodes[3].enabled,reviewRequired);
  assert.equal(nodes[4].enabled,!reviewRequired);
  assert.ok(nodes.every(n=>n.x>=0&&n.x+100<=540));
  assert.ok(nodes.every(n=>n.wireAt+.58<SCENE_SECONDS));
 }
});
test("each reel cycle alternates the review-required and direct-result examples",()=>{
 let state={index:0,reviewRequired:true};
 for(let i=0;i<6;i++)state=nextReelState(state);
 assert.deepEqual(state,{index:0,reviewRequired:false});
 for(let i=0;i<6;i++)state=nextReelState(state);
 assert.deepEqual(state,{index:0,reviewRequired:true});
});

test("automation signals arrive in story order before the final hold",()=>{
 const flow=automationFlow(false);
 assert.ok(flow[0].wireAt+.58<=flow[1].wireAt);
 assert.ok(flow[1].wireAt+.58<=flow[2].wireAt);
 assert.ok(flow[2].wireAt+.58<2.46);
 assert.ok(2.46+.4<flow[4].wireAt);
 assert.ok(flow[4].wireAt+.58<SCENE_SECONDS);
});

test("every service has a distinctive mascot expression and meaningful outcome face",()=>{
 const initial=SCENES.map(s=>mascotExpression(s.key).initial);
 assert.equal(new Set(initial).size,SCENES.length);
 assert.equal(mascotExpression("automation",true).final,"patient");
 assert.equal(mascotExpression("automation",false).final,"delighted");
 assert.equal(mascotExpression("support").final,"relieved");
 assert.equal(mascotExpression("consulting").final,"confident");
});

test("slower film holds the completed automation scene before fading out",()=>{
 const flow=automationFlow(false);
 const lastCheck=(flow[4].at+.4+.38)*FILM_PACE;
 assert.equal(SCENE_SECONDS,7);assert.equal(FILM_PACE,1.25);
 assert.ok(SCENE_SECONDS*.955-lastCheck>1);
});
test("all expressions preserve two subtle oval-eye transforms",()=>{
 for(const scene of SCENES)for(const review of [true,false]){
  const faces=mascotExpression(scene.key,review);
  for(const expression of [faces.initial,faces.final]){
   const pose=mascotEyePose(expression);assert.equal(pose.length,2);
   for(const [dx,dy,sx,sy,angle] of pose){
    assert.ok(Math.abs(dx)<=3&&Math.abs(dy)<=3);
    assert.ok(sx>=.9&&sx<=1.15&&sy>=.6&&sy<=1.25&&Math.abs(angle)<=12);
   }
  }
 }
});
