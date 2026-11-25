"""Capture actual Lutic page and create review stills; no MP4 export."""
import argparse, json, math, os, threading
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
W,H=1440,1152
CHECKPOINTS=[0,1.6,2.5,5,6.5,9.3,11]
def capture(url,out):
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=['--no-sandbox'], executable_path=os.environ.get('CHROMIUM_PATH') or None)
        page=browser.new_page(viewport={'width':W,'height':H},device_scale_factor=2,reduced_motion='reduce')
        page.goto(url,wait_until='networkidle',timeout=90000)
        page.evaluate("document.documentElement.classList.add('film-capture')")
        page.add_style_tag(content="html{scroll-behavior:auto!important}*,*::before,*::after{animation:none!important;transition:none!important}.reveal{opacity:1!important;transform:none!important}header,.scene{position:static!important}.scroll-meter{display:none!important}.hero-system{transform:none!important}")
        page.evaluate("async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,70))}scrollTo(0,0);await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))}")
        page.wait_for_timeout(300)
        meta=page.evaluate("""()=>{const box=e=>{const r=e.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height}};const els=[...document.querySelectorAll('[data-layer],.hero-copy .cta')].filter(e=>!e.parentElement.closest('[data-layer]'));return {width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,hero:box(document.querySelector('.hero')),layers:els.map((e,i)=>{e.setAttribute('data-film-id',String(i));return {id:i,name:e.dataset.layer||'hero-button',...box(e)}}),fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)}}""")
        if meta['width']!=W: raise RuntimeError('Page overflow: '+str(meta['width']))
        page.screenshot(path=str(out/'full.png'),full_page=True,animations='disabled')
        hidden=page.add_style_tag(content="[data-film-id]{visibility:hidden!important}")
        page.screenshot(path=str(out/'base.png'),full_page=True,animations='disabled')
        hidden.evaluate('el=>el.remove()')
        for a in meta['layers']:
            i=a['id']; x=max(0,math.floor(a['x']-28));y=max(0,math.floor(a['y']-28));right=min(meta['width'],math.ceil(a['x']+a['w']+28));bottom=min(meta['height'],math.ceil(a['y']+a['h']+28))
            selector=f'[data-film-id="{i}"]'
            style=page.add_style_tag(content=f"""html,body{{background:transparent!important}}body *{{visibility:hidden!important}}{selector},{selector} *{{visibility:visible!important}}""")
            page.screenshot(path=str(out/f'layer-{i:02}.png'),clip={'x':x,'y':y,'width':right-x,'height':bottom-y},omit_background=True,animations='disabled')
            style.evaluate('el=>el.remove()')
            a.update(clip=[x,y,right-x,bottom-y],file=f'layer-{i:02}.png')
        meta.update(url=url,deviceScale=2,renderer='review stills: perspective composite, not final WebGL2')
        (out/'layout.json').write_text(json.dumps(meta,indent=2))
        browser.close()
    return meta

def ease(t): t=max(0,min(1,t));return t*t*(3-2*t)
def ramp(t,a,b):return ease((t-a)/(b-a))
def speed(t):
    if t<.6:return .5*ramp(t,0,.6)
    if t<1.25:return .5
    if t<1.6:return .5+.5*ramp(t,1.25,1.6)
    if t<7.3:return 1
    return 1-.88*ramp(t,7.3,8.3)
def travel(t):
    t=min(t,8.3)
    if not t:return 0
    n=math.ceil(t*240)
    return sum(speed((i+.5)*t/n) for i in range(n))*t/n
def font(size,italic=False):
    options=['/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf','/usr/share/fonts/truetype/liberation2/LiberationSerif-Italic.ttf'] if italic else ['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']
    for p in options:
        if Path(p).exists():return ImageFont.truetype(p,size)
    return ImageFont.load_default()
def floor():
    yy,xx=np.mgrid[0:H,0:W];r=np.clip(np.sqrt(((xx-W/2)/(W*.72))**2+((yy-H/2)/(H*.72))**2),0,1)[...,None]
    rgb=np.uint8(np.array([249,251,251])*(1-r)+np.array([242,243,246])*r)
    return Image.fromarray(rgb).convert('RGBA')
def round_alpha(im,radius):
    im=im.copy();mask=Image.new('L',im.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,im.width-1,im.height-1),radius=radius,fill=255)
    im.putalpha(Image.fromarray(np.minimum(np.asarray(im.getchannel('A')),np.asarray(mask))));return im
def composite(canvas,im,quad,shadow=True,blur=0):
    src=np.float32([[0,0],[im.width-1,0],[im.width-1,im.height-1],[0,im.height-1]])
    mat=cv2.getPerspectiveTransform(src,np.float32(quad))
    arr=np.asarray(im.convert('RGBA')); alpha=arr[:,:,3:4].astype(np.float32)/255
    premul=np.concatenate([arr[:,:,:3].astype(np.float32)*alpha,arr[:,:,3:4].astype(np.float32)],axis=2)
    warped=cv2.warpPerspective(premul,mat,(W,H),flags=cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
    if blur>0:warped=cv2.GaussianBlur(warped,(0,0),blur)
    a=warped[:,:,3:4];rgb=np.divide(warped[:,:,:3]*255,a,out=np.zeros_like(warped[:,:,:3]),where=a>0.01)
    result=Image.fromarray(np.uint8(np.clip(np.concatenate([rgb,a],axis=2),0,255)))
    if shadow:
        mask=result.getchannel('A').filter(ImageFilter.GaussianBlur(22)).point(lambda v:int(v*.22))
        sh=Image.new('RGBA',(W,H),(26,33,51,0));sh.putalpha(mask);canvas.alpha_composite(sh,(0,12))
    canvas.alpha_composite(result)
def tile(canvas,x,y,s,blur=0):
    size=int(s);im=Image.new('RGBA',(size,size));d=ImageDraw.Draw(im);d.rounded_rectangle((0,0,size-1,size-1),radius=size*.18,fill='white')
    d.polygon([(s*.24,s*.24),(s*.38,s*.24),(s*.38,s*.62),(s*.76,s*.62),(s*.76,s*.76),(s*.24,s*.76)],fill='#294bcf');d.rectangle((s*.57,s*.24,s*.76,s*.43),fill='#8fa2e7')
    if blur:im=im.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(im,(int(x-s/2),int(y-s/2)))
def preview(out,meta):
    full=Image.open(out/'full.png').convert('RGBA').resize((W,meta['height']),Image.Resampling.LANCZOS)
    base=Image.open(out/'base.png').convert('RGBA').resize(full.size,Image.Resampling.LANCZOS)
    layers=[(a,Image.open(out/a['file']).convert('RGBA').resize(tuple(a['clip'][2:]),Image.Resampling.LANCZOS)) for a in meta['layers']]
    PH=meta['height'];hero=meta['hero'];hero_end=math.ceil(hero['y']+hero['h']);heroim=round_alpha(full.crop((0,0,W,hero_end)),38)
    cruise=(PH-850)/max(1,travel(8.2))
    for t in CHECKPOINTS:
        canvas=floor()
        if t>=9.97:
            s=1018/W*(1+.02*ramp(t,10.6,14.5));hh=hero_end*s;x=(W-W*s)/2;y=283
            composite(canvas,heroim,[(x,y),(W-x,y),(W-x,y+hh),(x,y+hh)])
            for x1,y1,sz,bl in [(220,310,120,0),(1220,310,130,0),(55,1070,300,13),(1380,1100,320,17)]:tile(canvas,x1,y1,sz,bl)
            d=ImageDraw.Draw(canvas);d.rounded_rectangle((640,44,800,89),23,fill='white');d.text((720,66),'Lutic',font=font(21),fill='#202737',anchor='mm');d.text((720,160),'AI that works.',font=font(74),fill='#202737',anchor='mm');d.text((720,239),'In the real world.',font=font(82,True),fill='#8b8b92',anchor='mm')
        elif t>=9.25:
            s=min(1300/W,(H-84)/PH);x=(W-W*s)/2;y=H-42-PH*s
            composite(canvas,round_alpha(full,24),[(x,y),(W-x,y),(W-x,H-42),(x,H-42)])
        else:
            look=hero['y']+hero['h']*.48+travel(t)*cruise;angle=math.radians(56);distance=1360+340*ramp(t,0,7.3)
            # Camera is behind the current subject; keep projection forward and fixed yaw.
            def proj(x,y,z=0):
                delta=y-look; depth=distance-delta*math.sin(angle)-z*math.cos(angle)
                depth=max(200,depth)
                return (W/2+(x-W/2)*1880/depth,H/2+(delta*math.cos(angle)-z*math.sin(angle))*1880/depth)
            # Crop around the focus plane to avoid projecting points behind the camera.
            lo=max(0,int(look-2200));hi=min(PH,int(look+min(1100,(distance-260)/math.sin(angle))))
            section=base.crop((0,lo,W,hi))
            composite(canvas,section,[proj(0,lo),proj(W,lo),proj(W,hi),proj(0,hi)])
            visible=[]
            for a,im in layers:
                x,y,w,h=a['clip'];mid=y+h/2
                if y+h<lo or y>hi:continue
                lift=20+25*math.exp(-((mid-look)/500)**2)
                if a['name']=='hero-system':lift+=45*math.exp(-((mid-look)/500)**2)
                visible.append((lift,a,im))
            for lift,a,im in sorted(visible,key=lambda q:q[0]):
                x,y,w,h=a['clip'];dof=min(8,max(0,(y+h/2-look)/180))
                composite(canvas,im,[proj(x,y,lift+10),proj(x+w,y,lift+10),proj(x+w,y+h,lift),proj(x,y+h,lift)],blur=dof)
            v=ramp(t,.1,1.35)
            for x,y,s,bl in [(270,210-t*95,32+115*v,1),(1160,220-t*80,32+130*v,1),(120,920-t*65,32+145*v,9),(1320,980-t*70,32+155*v,12)]:tile(canvas,x,y,s,bl)
        canvas.convert('RGB').save(out/f'still-{t:04.1f}.jpg',quality=93)
    (out/'REVIEW.txt').write_text('Seven stills generated from the captured page. Camera perspective and layer lifts are review approximations; per-pixel DOF, continuous rise/dive, optical flow, final fonts and GPU motion blur are not validated. No final video rendered.\n')
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--url');parser.add_argument('--out',default='film-review');args=parser.parse_args();out=Path(args.out).resolve();out.mkdir(parents=True,exist_ok=True)
    server=None
    if not args.url:
        server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/index.html?capture=1'
    else:url=args.url
    try:meta=capture(url,out);preview(out,meta);print('Review files:',out)
    finally:
        if server:server.shutdown()
if __name__=='__main__':main()
