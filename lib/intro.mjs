// All phase boundaries are expressed in milliseconds.
export const INTRO_DURATION = 10000;
export const INTRO_HANDOFF = 8800;
export const INTRO_STORAGE_KEY = "lutic:intro:v1";
export const INTRO_PHASES = [
 {start:0,label:"Awaken",detail:"Intelligence comes to life."},
 {start:2000,label:"Connect",detail:"Applications and intelligent agents connect."},
 {start:4500,label:"Execute",detail:"Autonomous workflows execute and verify."},
 {start:7500,label:"Return",detail:"Intelligence, put to work."}
];
export function shouldPlayIntro({seen=false,reducedMotion=false,hash="",scrollY=0,reload=false}={}){
 // A hard reload is an explicit replay request, including from farther down the homepage.
 return !reducedMotion&&!hash&&(reload||(!seen&&scrollY<2));
}
export function handoffGeometry(source,target){
 if(!source||!target||source.width<=0||source.height<=0||target.width<=0||target.height<=0)return {x:0,y:0,scale:1,matched:false};
 return {x:target.left+target.width/2-source.left-source.width/2,y:target.top+target.height/2-source.top-source.height/2,scale:target.width/source.width,matched:true};
}
