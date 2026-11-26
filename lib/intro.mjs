// All phase boundaries are expressed in milliseconds.
export const INTRO_DURATION = 4500;
export const INTRO_HANDOFF = 3420;
export const INTRO_RECENTER = 3150;
export const INTRO_GATE_OPEN = 3420;
export const INTRO_STORAGE_KEY = "lutic:intro:v1";
export const INTRO_PHASES = [
 {start:0,label:"Wordmark"},
 {start:1170,label:"Mascot"},
 {start:INTRO_GATE_OPEN,label:"Gate opening"}
];
export function shouldPlayIntro({seen=false,reducedMotion=false,hash="",scrollY=0,reload=false}={}){
 // A hard reload is an explicit replay request, including from farther down the homepage.
 return !reducedMotion&&!hash&&(reload||(!seen&&scrollY<2));
}
export function handoffGeometry(source,target){
 if(!source||!target||source.width<=0||source.height<=0||target.width<=0||target.height<=0)return {x:0,y:0,scale:1,matched:false};
 return {x:target.left+target.width/2-source.left-source.width/2,y:target.top+target.height/2-source.top-source.height/2,scale:target.width/source.width,matched:true};
}

// Bounded cursor response: keeps the mascot near the center before handoff.
export function cursorPose(dx,dy,width){
 if(!Number.isFinite(dx)||!Number.isFinite(dy)||!Number.isFinite(width)||width<=0)return {x:0,y:0,eyeX:0,eyeY:0};
 const distance=Math.hypot(dx,dy);
 if(!distance)return {x:0,y:0,eyeX:0,eyeY:0};
 const strength=Math.min(1,distance/Math.max(100,width*2));
 const body=Math.min(20,width*.14)*strength;
 const eye=8*strength;
 return {x:dx/distance*body,y:dy/distance*body,eyeX:dx/distance*eye,eyeY:dy/distance*eye};
}

// Pixel lettering is geometry, not a web-font fallback.
export const PIXEL_GLYPHS=[["110000","110000","110000","110000","110000","110000","110000","111111","111111"],["000000","000000","000000","110011","110011","110011","110011","110011","011111"],["001100","001100","111111","111111","001100","001100","001100","001101","000111"],["11","11","00","11","11","11","11","11","11"],["000000","000000","000000","011111","110000","110000","110000","110000","011111"]];
export function pixelWordmark(glyphs){
 let offset=0;const pixels=[];
 for(const [letter,rows] of glyphs.entries()){
  for(const [y,row] of rows.entries())for(let x=0;x<row.length;x++)if(row[x]==="1")pixels.push({x:x+offset,y,letter});
  offset+=rows[0].length+1;
 }
 return {width:offset-1,height:9,pixels};
}
export function revealProgress(elapsed,duration){
 const t=Math.max(0,Math.min(1,elapsed/duration));
 return t*t*(3-2*t);
}
