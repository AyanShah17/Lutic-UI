import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {SCENES,SCENE_SECONDS,FILM_PACE,REEL_SECONDS,reelPosition,advanceReel,nextSceneIndex,shouldRunReel,automationFlow,nextReelState,mascotExpression,mascotEyePose,mascotStoryCSS,expressionLineBeats,AUTOMATION_TIMING,mascotGazeStory,mascotGazeCSS,mascotGazeSignals,gazePathPoints,gazePathSample,gazeOffsetAt,MASCOT_CENTERS} from "../lib/studio-reel.mjs";
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
  assert.equal(nodes[4].enabled,true);
  assert.ok(nodes.every(n=>n.x>=0&&n.x+100<=540));
  assert.ok(nodes.every(n=>(n.wireAt+n.wireDuration)*FILM_PACE<SCENE_SECONDS));
 }
});
test("each reel cycle alternates the review-required and direct-result examples",()=>{
 let state={index:0,reviewRequired:true};
 for(let i=0;i<6;i++)state=nextReelState(state);
 assert.deepEqual(state,{index:0,reviewRequired:false});
 for(let i=0;i<6;i++)state=nextReelState(state);
 assert.deepEqual(state,{index:0,reviewRequired:true});
});

test("review returns a human approval and then delivers the result",()=>{
 const t=AUTOMATION_TIMING;
 const end=slot=>slot.at+slot.duration;
 assert.ok(end(t.request)<=t.plan.at);
 assert.ok(end(t.plan)<=t.tools.at);
 assert.ok(end(t.tools)<=t.toolReturn.at);
 assert.ok(end(t.toolReturn)<=t.review.at);
 assert.ok(end(t.review)<=t.approval.at);
 assert.ok(end(t.approval)<=t.reviewResult.at);
 assert.ok(Math.abs(end(t.reviewResult)-t.reviewResultReady)<1e-9);
 assert.ok(end(t.toolReturn)<=t.directResult.at);
 assert.equal(automationFlow(true)[4].wireAt,t.reviewResult.at);
 assert.equal(automationFlow(false)[4].wireAt,t.directResult.at);
 for(const review of [true,false]){
  const result=automationFlow(review)[4];
  assert.ok(SCENE_SECONDS*.955-(result.checkAt+.38)*FILM_PACE>.9);
 }
});
test("state-based eye stories match the service workflow and its outcome",()=>{
 const stylesheet=readFileSync(new URL("../app/globals.css",import.meta.url),"utf8");
 for(const scene of SCENES)for(const review of [true,false]){
  const story=mascotExpression(scene.key,review);
  assert.equal(story.beats[0][1],0);
  assert.ok(story.beats.length>=4);
  for(let i=1;i<story.beats.length;i++)assert.ok(story.beats[i][1]>story.beats[i-1][1]+.20);
  assert.equal(story.beats.at(-1)[0],story.final);
  assert.ok((story.beats.at(-1)[1]+.20)*FILM_PACE<SCENE_SECONDS*.955);
  assert.ok(stylesheet.includes(mascotStoryCSS(story)),story.animation+" CSS is out of sync");
 }
 for(const review of [true,false]){
  const story=mascotExpression("automation",review);
  assert.equal(story.beats.at(-1)[1],review?AUTOMATION_TIMING.reviewResultReady:AUTOMATION_TIMING.directResultReady);
  assert.equal(story.final,"result");
  assert.equal(story.beats.some(([state])=>state==="checking-right"),review);
 }
 assert.equal(mascotExpression("support").final,"relieved");
});
test("slower film holds the completed automation scene before fading out",()=>{
 const flow=automationFlow(false);
 const lastCheck=(flow[4].checkAt+.38)*FILM_PACE;
 assert.equal(SCENE_SECONDS,7);assert.equal(FILM_PACE,1.25);
 assert.ok(SCENE_SECONDS*.955-lastCheck>1);
});
test("all expressions preserve two subtle oval-eye transforms",()=>{
 for(const scene of SCENES)for(const review of [true,false]){
  const faces=mascotExpression(scene.key,review);
  for(const [expression] of faces.beats){
   const pose=mascotEyePose(expression);assert.equal(pose.length,2);
   for(const [dx,dy,sx,sy,angle] of pose){
    assert.ok(Math.abs(dx)<=4&&Math.abs(dy)<=4);
    assert.ok(sx>=.9&&sx<=1.15&&sy>=.6&&sy<=1.35&&Math.abs(angle)<=12);
   }
  }
 }
});

test("head accents follow every eye beat without overlapping or preceding the outcome",()=>{
 for(const scene of SCENES)for(const review of [true,false]){
  const story=mascotExpression(scene.key,review);
  const marks=expressionLineBeats(story);
  assert.equal(marks.length,story.beats.length);
  for(let i=0;i<marks.length;i++){
   const mark=marks[i],next=story.beats[i+1]?.[1]??SCENE_SECONDS/FILM_PACE;
   assert.equal(mark.state,story.beats[i][0]);
   assert.ok(mark.delay>=story.beats[i][1]);
   assert.ok(mark.duration>0&&mark.delay+mark.duration<=next);
   assert.ok(mark.paths.length>=2&&mark.paths.length<=3);
  }
 }
 for(const review of [true,false]){
  const mark=expressionLineBeats(mascotExpression("automation",review)).at(-1);
  assert.equal(mark.state,"result");
  assert.ok(mark.delay>=(review?AUTOMATION_TIMING.reviewResultReady:AUTOMATION_TIMING.directResultReady));
 }
});

test("gaze follows the actual signal paths and settles before the scene ends",()=>{
 const stylesheet=readFileSync(new URL("../app/globals.css",import.meta.url),"utf8");
 for(const scene of SCENES)for(const review of [true,false]){
  const gaze=mascotGazeStory(scene.key,review);
  assert.deepEqual(gaze.frames[0].offset,[0,0]);
  assert.deepEqual(gaze.frames.at(-1).offset,[0,0]);
  assert.ok(gaze.frames.some(f=>Math.hypot(...f.offset)>3));
  assert.ok(gaze.frames.every(f=>Math.abs(f.offset[0])<=11.00001&&Math.abs(f.offset[1])<=10.00001));
  assert.ok(stylesheet.includes(mascotGazeCSS(gaze)));
 }
 const signal=(service,review,index)=>{const s=mascotGazeSignals(service,review)[index];return {...s,points:gazePathPoints(s.d)};};
 const offset=(service,s,progress)=>gazeOffsetAt([s],MASCOT_CENTERS[service],s.at+s.duration*progress);
 const question=signal("solutions",true,0),knowledge=signal("solutions",true,1);
 assert.ok(offset("solutions",question,.5)[0]<0&&offset("solutions",question,.5)[1]<0);
 assert.ok(offset("solutions",knowledge,.5)[0]<0&&offset("solutions",knowledge,.5)[1]>0);
 const request=signal("automation",true,0);
 assert.ok(offset("automation",request,.25)[0]<0&&offset("automation",request,.25)[1]>0);
 assert.ok(Math.abs(offset("automation",request,.85)[0])<Math.abs(offset("automation",request,.25)[0]));
 const returns=mascotGazeSignals("automation",true);
 const approval={...returns.at(-1),points:gazePathPoints(returns.at(-1).d)};
 assert.ok(offset("automation",approval,.3)[0]>0&&offset("automation",approval,.3)[1]>0);
 assert.equal(mascotGazeSignals("automation",false).some(s=>s.d===approval.d),false);
 assert.deepEqual(gazePathSample(gazePathPoints("M0 0H10V10"),.75),[10,5]);
});
