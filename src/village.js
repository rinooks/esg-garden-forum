// 정원마을 지도 (/village): low-poly 3D garden village + plain list. All geometry is generated in code.
const ZONES = ['방문자센터', '탄소정원 · 온실', '협력관', '소식 광장', '회원의 숲'];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const href = p => { const s = String(p ?? ''); return esc(s.charAt(0) === '/' && s.charAt(1) !== '/' && s.charAt(1) !== '\\' ? s : '#'); };
const zoneData = groups => (Array.isArray(groups) ? groups : []).slice(0, ZONES.length).map((g, i) => ({
  name: ZONES[i], title: String(g?.title ?? ''), path: String(g?.path ?? ''), label: String(g?.label ?? ''), desc: String(g?.desc ?? ''),
  items: (Array.isArray(g?.items) ? g.items : []).filter(it => Array.isArray(it) && it.length > 1).map(it => [String(it[0]), String(it[1])])
}));

export const villageMeta = { title: '정원마을 지도', desc: '대한민국 ESG정원정책포럼의 소개, 사업, 협력, 소식, 회원 안내를 정원마을의 다섯 구역으로 둘러보는 3D 지도입니다.' };

const CSS = String.raw`
.village-page{display:block;margin:0;padding:0;max-width:none;background:#f7f5ee;color:#26352b;--vg-g:#286044;--vg-gd:#244f36;--vg-gl:#39734e;--vg-line:#dce4da;--vg-mut:#566358}
.village-page *,.village-page *::before,.village-page *::after{box-sizing:border-box}
.village-page [hidden]{display:none!important}
.vg-wrap{width:min(1240px,calc(100% - 40px));margin-inline:auto}
.vg-hero{position:relative;isolation:isolate;overflow:hidden;background:linear-gradient(180deg,#f7f5ee 0%,#f3f4ec 26%,#dfeaf1 62%,#e6eef0 100%)}
.vg-copy{position:relative;z-index:2;padding:36px 0 8px}
.vg-eyebrow{margin:0 0 12px;font-family:var(--sans,inherit);font-size:13px;line-height:1.4;font-weight:700;letter-spacing:.16em;color:#39734e}
.vg-h1{margin:0 0 16px;font-family:var(--sans,inherit);font-size:30px;line-height:1.34;font-weight:700;letter-spacing:-.045em;color:#1f3a2a;word-break:keep-all}
.vg-lead{margin:0 0 8px;font-size:16px;line-height:1.8;letter-spacing:-.015em;color:#3d4c41;word-break:keep-all}
.vg-lead strong{font-weight:700;color:#244f36}
.vg-btn{display:inline-flex;align-items:center;gap:8px;min-height:48px;margin-top:14px;padding:0 22px;border-radius:999px;background:#286044;color:#fff;font-size:16px;font-weight:700;line-height:1.3;text-decoration:none;transition:background .2s}
.vg-btn:hover{background:#244f36;color:#fff}
.vg-btn svg{width:16px;height:16px;flex:none}
.vg-stage{display:none;position:relative;height:58vh;height:58svh;min-height:380px;max-height:600px}
.vg-veil{display:none}
.vg-on .vg-stage{display:block}
.vg-canvas{position:absolute;inset:0;display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab;opacity:0;transition:opacity .7s ease;outline:0;-webkit-tap-highlight-color:transparent}
.vg-ready .vg-canvas{opacity:1}
.vg-canvas.vg-point{cursor:pointer}
.vg-canvas.vg-grab{cursor:grabbing}
.vg-signs{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;opacity:0;transition:opacity .5s ease .2s}
.vg-ready .vg-signs{opacity:1}
.vg-sign{position:absolute;left:0;top:0;transform:translate(-999px,-999px);pointer-events:auto;appearance:none;-webkit-appearance:none;margin:0;padding:5px 10px 6px;border:1px solid rgba(36,79,54,.18);border-radius:9px;background:#fff;color:#1f3a2a;font:inherit;line-height:1.25;text-align:center;white-space:nowrap;cursor:pointer;box-shadow:0 6px 16px rgba(31,58,42,.16);transition:background .2s,color .2s,border-color .2s,box-shadow .2s,opacity .2s;-webkit-tap-highlight-color:transparent}
.vg-sign b{display:block;font-size:13px;font-weight:700;letter-spacing:-.02em}
.vg-sign span{display:none;margin-top:1px;font-size:11.5px;font-weight:500;color:#566358}
.vg-sign::after{content:"";position:absolute;left:50%;top:100%;width:2px;height:var(--vg-stem,14px);margin:1px 0 0 -1px;background:rgba(36,79,54,.72);pointer-events:none}
.vg-sign::before{content:"";position:absolute;left:50%;top:calc(100% + var(--vg-stem,14px));width:8px;height:8px;margin:-3px 0 0 -4px;border:1.5px solid #fff;border-radius:50%;background:#286044;pointer-events:none}
.vg-sign.vg-nostem::after,.vg-sign.vg-nostem::before{display:none}
.vg-sign:hover,.vg-sign.vg-hot{border-color:#39734e;box-shadow:0 8px 22px rgba(31,58,42,.28)}
.vg-sign[aria-pressed="true"]{background:#286044;border-color:#286044;color:#fff}
.vg-sign[aria-pressed="true"] span{color:#dcebe0}
.vg-sel .vg-sign:not([aria-pressed="true"]){opacity:.86}
.vg-sign.vg-off{visibility:hidden}
.village-page :is(.vg-sign,.vg-pill,.vg-btn,.vg-card-x,.vg-show,.vg-card,a):focus-visible{outline:3px solid #244f36;outline-offset:3px}
.vg-tools{position:absolute;left:14px;right:14px;bottom:12px;z-index:3;display:flex;align-items:center;gap:6px 12px;flex-wrap:wrap;pointer-events:none}
.vg-pill{pointer-events:auto;appearance:none;-webkit-appearance:none;min-height:44px;margin:0;padding:0 18px;border:1px solid #c6d4c6;border-radius:999px;background:#fff;color:#244f36;font:inherit;font-size:15px;font-weight:700;line-height:1.2;cursor:pointer;box-shadow:0 4px 12px rgba(31,58,42,.08);transition:background .2s,border-color .2s}
.vg-pill:hover{background:#edf2e9;border-color:#39734e}
.vg-hint{padding:5px 12px;border-radius:999px;background:rgba(255,255,255,.78);font-size:13px;line-height:1.5;color:#3d4c41;letter-spacing:-.01em}
.vg-note{width:min(1240px,calc(100% - 40px));margin:14px auto 30px;padding:14px 18px;border:1px solid #dce4da;border-radius:14px;background:#fff;font-size:16px;line-height:1.7;color:#3d4c41}
.vg-card{position:relative;z-index:4;margin:14px 16px 24px;padding:22px 20px 14px;border:1px solid #dce4da;border-radius:18px;background:#fff;box-shadow:0 14px 36px rgba(31,58,42,.12)}
.vg-card-x{position:absolute;right:10px;top:10px;display:grid;place-items:center;width:44px;height:44px;margin:0;padding:0;border:0;border-radius:50%;background:transparent;color:#3d4c41;cursor:pointer;appearance:none;-webkit-appearance:none}
.vg-card-x:hover{background:#edf2e9;color:#244f36}
.vg-card-x svg{width:18px;height:18px}
.vg-card-label,.vg-zone-label{margin:0 0 6px;font-size:12px;line-height:1.4;font-weight:700;letter-spacing:.14em;color:#39734e}
.vg-card-name{margin:0 44px 4px 0;font-family:var(--sans,inherit);font-size:24px;line-height:1.35;font-weight:700;letter-spacing:-.04em;color:#1f3a2a}
.vg-card-group,.vg-zone-group{margin:0 0 10px;font-size:15px;line-height:1.6;color:#566358}
.vg-card-group a,.vg-zone-group a{color:#286044;font-weight:700;text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(40,96,68,.35)}
.vg-card-group a:hover,.vg-zone-group a:hover{text-decoration-color:#286044}
.vg-card-desc,.vg-zone-desc{margin:0 0 12px;font-size:16px;line-height:1.7;letter-spacing:-.015em;color:#3d4c41;word-break:keep-all}
.vg-links{list-style:none;margin:0;padding:0;border-top:1px solid #e3e9e0}
.vg-links li{margin:0;padding:0;border-bottom:1px solid #edf1ea}
.vg-links li:last-child{border-bottom:0}
.vg-links a{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:46px;padding:9px 8px 9px 6px;border-radius:8px;color:#26352b;font-size:16px;line-height:1.5;font-weight:500;text-decoration:none;transition:background .15s,color .15s}
.vg-links a::after{content:"";flex:none;width:7px;height:7px;margin-right:4px;border-top:2px solid #8aa390;border-right:2px solid #8aa390;transform:rotate(45deg);transition:border-color .15s,transform .15s}
.vg-links a:hover{background:#edf2e9;color:#244f36}
.vg-links a:hover::after{border-color:#286044;transform:translateX(2px) rotate(45deg)}
.vg-list{padding:48px 0 68px;background:#f7f5ee;border-top:1px solid #e3e9e0;scroll-margin-top:90px}
.vg-list-h{margin:0 0 8px;font-family:var(--sans,inherit);font-size:26px;line-height:1.35;font-weight:700;letter-spacing:-.045em;color:#1f3a2a}
.vg-list-lead{margin:0 0 26px;font-size:16px;line-height:1.75;color:#566358;word-break:keep-all}
.vg-grid{display:grid;grid-template-columns:1fr;gap:16px}
.vg-zone{display:flex;flex-direction:column;min-width:0;padding:24px 20px 16px;border:1px solid #dce4da;border-radius:18px;background:#fff}
.vg-zone-name{margin:0 0 4px;font-family:var(--sans,inherit);font-size:22px;line-height:1.4;font-weight:700;letter-spacing:-.04em;color:#1f3a2a}
.vg-zone .vg-links{margin-bottom:auto}
.vg-show{display:none;align-self:flex-start;align-items:center;min-height:44px;margin:14px 0 4px;padding:0 16px;border:1px solid #c6d4c6;border-radius:999px;background:#fff;color:#244f36;font:inherit;font-size:14px;font-weight:700;cursor:pointer;appearance:none;-webkit-appearance:none}
.vg-show:hover{background:#edf2e9;border-color:#39734e}
.vg-ready .vg-show{display:inline-flex}
@media (min-width:1024px){
.vg-wrap{width:min(1240px,calc(100% - 64px))}
.vg-hero{background:linear-gradient(90deg,#f7f5ee 0%,#f5f4ec 30%,#e7eef0 58%,#d9e8f2 100%)}
.vg-copy{padding:76px 0 72px}
.vg-copy-in{width:min(450px,38%)}
.vg-on .vg-hero{height:min(820px,calc(100vh - 90px));min-height:620px}
.vg-on .vg-copy{position:absolute;left:0;right:0;top:50%;padding:0;transform:translateY(-58%);pointer-events:none}
.vg-on .vg-copy-in{pointer-events:auto}
.vg-on .vg-stage{position:absolute;inset:0;height:auto;min-height:0;max-height:none}
.vg-on .vg-veil{display:block;position:absolute;z-index:1;left:0;top:0;bottom:0;width:46%;background:linear-gradient(90deg,#f7f5ee 0%,#f6f5ed 68%,rgba(246,245,237,0) 100%);opacity:0;transition:opacity .6s ease;pointer-events:none}
.vg-sel .vg-veil{opacity:1}
.vg-eyebrow{font-size:14px;margin-bottom:16px}
.vg-h1{font-size:46px;line-height:1.3;margin-bottom:22px}
.vg-lead{font-size:18px;line-height:1.85}
.vg-btn{margin-top:20px;min-height:52px;padding:0 26px;font-size:17px}
.vg-sign{padding:6px 12px 7px;border-radius:10px}
.vg-sign b{font-size:15px}
.vg-sign span{display:block}
.vg-tools{left:max(32px,calc((100% - 1240px)/2));right:auto;bottom:26px;gap:14px}
.vg-hint{font-size:14px}
.vg-note{width:min(1240px,calc(100% - 64px));margin:0 auto 56px;font-size:17px}
.vg-card{position:absolute;right:max(24px,calc((100% - 1240px)/2));top:50%;width:340px;max-height:calc(100% - 48px);margin:0;overflow:auto;transform:translateY(-50%);padding:26px 24px 16px;box-shadow:0 22px 54px rgba(31,58,42,.2)}
.vg-list{padding:76px 0 104px}
.vg-list-h{font-size:32px}
.vg-list-lead{font-size:18px;margin-bottom:34px}
.vg-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.vg-zone{padding:30px 28px 20px;border-radius:20px}
.vg-zone-name{font-size:24px}
.vg-zone-desc,.vg-links a{font-size:18px}
.vg-links a{min-height:50px}
.vg-card .vg-links a{font-size:17px;min-height:46px}
}
@media (min-width:1024px) and (max-width:1199px){.vg-h1{font-size:40px}.vg-card{width:310px}}
@media (prefers-reduced-motion:reduce){.vg-veil,.vg-canvas,.vg-signs,.vg-sign,.vg-btn,.vg-links a,.vg-links a::after{transition:none}}
`;

const CLIENT = String.raw`
(function(){
'use strict';
var root=document.querySelector('.village-page'),hero=document.getElementById('vg-hero'),stage=document.getElementById('vg-stage'),canvas=document.getElementById('vg-canvas'),card=document.getElementById('vg-card'),note=document.getElementById('vg-note'),resetBtn=document.getElementById('vg-reset');
if(!root||!hero||!stage||!canvas||!card)return;
var DATA=[];try{DATA=JSON.parse(document.getElementById('vg-data').textContent)||[];}catch(e){DATA=[];}
var reduce=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
var failed=false,stopAll=null;
function fail(err){if(failed)return;failed=true;if(stopAll)stopAll();root.classList.remove('vg-on','vg-ready','vg-sel');card.hidden=true;if(note)note.hidden=false;if(window.console&&console.warn)console.warn('[village] 3D 지도를 표시하지 못해 목록으로 안내합니다.',err&&err.message?err.message:'');}
function hasGL(){try{var c=document.createElement('canvas'),g=c.getContext('webgl2')||c.getContext('webgl');if(!g)return false;var x=g.getExtension('WEBGL_lose_context');if(x)x.loseContext();return true;}catch(e){return false;}}
if(!window.requestAnimationFrame||!hasGL()){fail(new Error('WebGL unavailable'));return;}
root.classList.add('vg-on');
import('/vendor/three-0.169.0.module.min.js').then(function(T){try{start(T);}catch(e){fail(e);}},fail);

function start(THREE){
var V3=THREE.Vector3,PI=Math.PI;
var mqSmall=window.matchMedia('(max-width: 1023px)'),isSmall=mqSmall.matches;
var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true});
renderer.setClearColor(0x000000,0);
var useShadow=!isSmall;
renderer.shadowMap.enabled=useShadow;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
var scene=new THREE.Scene();
var FOV=30,tanH=Math.tan(FOV*PI/360);
var camera=new THREE.PerspectiveCamera(FOV,1,4,320);

/* ---------- helpers ---------- */
var seed=20261110;
function rnd(){seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}
function rr(a,b){return a+(b-a)*rnd();}
function pick(a){return a[Math.floor(rnd()*a.length)];}
var CC=new THREE.Color(),tM=new THREE.Matrix4(),tQ=new THREE.Quaternion(),tE=new THREE.Euler(),tS=new V3(),tP=new V3(),tV=new V3();
function rgb(hex,j){CC.set(hex);if(j)CC.offsetHSL(0,0,(rnd()-.5)*j);return CC;}
function Builder(j){this.p=[];this.c=[];this.m=new THREE.Matrix4();this.st=[];this.j=j===undefined?.03:j;}
var BP=Builder.prototype;
BP.push=function(x,y,z,ry,s){this.st.push(this.m.clone());s=s||1;this.m.multiply(new THREE.Matrix4().compose(new V3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,ry||0,0)),new V3(s,s,s)));return this;};
BP.pop=function(){this.m=this.st.pop();return this;};
BP.add=function(geo,color,x,y,z,rx,ry,rz,sx,sy,sz){
 var g=geo.index?geo.toNonIndexed():geo,a=g.attributes.position,n=a.count,i,fn=typeof color==='function',k,r=1,gg=1,b=1;
 tE.set(rx||0,ry||0,rz||0);tQ.setFromEuler(tE);tP.set(x||0,y||0,z||0);tS.set(sx||1,sy||1,sz||1);
 tM.compose(tP,tQ,tS).premultiply(this.m);
 if(!fn){k=rgb(color,this.j);r=k.r;gg=k.g;b=k.b;}
 for(i=0;i<n;i++){
  if(fn&&i%3===0){k=rgb(color((a.getX(i)+a.getX(i+1)+a.getX(i+2))/3,(a.getY(i)+a.getY(i+1)+a.getY(i+2))/3,(a.getZ(i)+a.getZ(i+1)+a.getZ(i+2))/3),this.j);r=k.r;gg=k.g;b=k.b;}
  tV.fromBufferAttribute(a,i).applyMatrix4(tM);this.p.push(tV.x,tV.y,tV.z);this.c.push(r,gg,b);
 }
 if(g!==geo)g.dispose();geo.dispose();return this;
};
BP.poly=function(pts,color){var k=rgb(color,this.j),r=k.r,g=k.g,b=k.b,i;for(i=0;i<pts.length;i++){tV.set(pts[i][0],pts[i][1],pts[i][2]).applyMatrix4(this.m);this.p.push(tV.x,tV.y,tV.z);this.c.push(r,g,b);}return this;};
BP.tri=function(a,b,c,color){return this.poly([a,b,c],color);};
BP.quad=function(a,b,c,d,color){return this.poly([a,b,c,a,c,d],color);};
BP.mesh=function(mat,cast,recv){var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));g.computeVertexNormals();g.computeBoundingSphere();var m=new THREE.Mesh(g,mat);m.castShadow=useShadow&&cast!==false;m.receiveShadow=useShadow&&recv!==false;m.matrixAutoUpdate=true;return m;};
function box(b,w,h,d,x,y,z,c,ry){b.add(new THREE.BoxGeometry(w,h,d),c,x,y+h/2,z,0,ry||0,0);}
function cyl(b,rt,rb,h,n,x,y,z,c,ry){b.add(new THREE.CylinderGeometry(rt,rb,h,n),c,x,y+h/2,z,0,ry||0,0);}
function cone(b,r,h,n,x,y,z,c,ry){b.add(new THREE.ConeGeometry(r,h,n),c,x,y+h/2,z,0,ry||0,0);}
function ico(b,r,d,x,y,z,c,sx,sy,sz){b.add(new THREE.IcosahedronGeometry(r,d||0),c,x,y,z,0,rr(0,3),0,sx,sy,sz);}
function pyr(b,w,h,d,x,y,z,c,ry){var g=new THREE.ConeGeometry(.7071,1,4);g.rotateY(PI/4);b.add(g,c,x,y+h/2,z,0,ry||0,0,w,h,d);}
function gable(b,w,h,d,x,y,z,c,ry,ec){b.push(x,y,z,ry||0);var A=[-w/2,0,d/2],B=[w/2,0,d/2],T=[0,h,d/2],A2=[-w/2,0,-d/2],B2=[w/2,0,-d/2],T2=[0,h,-d/2];ec=ec===undefined?c:ec;b.tri(A,B,T,ec);b.tri(B2,A2,T2,ec);b.quad(B,B2,T2,T,c);b.quad(A2,A,T,T2,c);b.pop();}
var avoid=[];
function ribbon(b,pts,wd,y,c,keep,closed){
 var curve=new THREE.CatmullRomCurve3(pts.map(function(p){return new V3(p[0],0,p[1]);}),!!closed);
 var n=Math.max(3,Math.round(curve.getLength()/.5)),ps=curve.getSpacedPoints(n),i,L=[],R=[];
 for(i=0;i<=n;i++){var a=closed?ps[(i-1+n)%n]:ps[Math.max(0,i-1)],d=closed?ps[(i+1)%n]:ps[Math.min(n,i+1)],tx=d.x-a.x,tz=d.z-a.z,l=Math.sqrt(tx*tx+tz*tz)||1;tx/=l;tz/=l;var ox=tz*wd/2,oz=-tx*wd/2;L.push([ps[i].x-ox,y,ps[i].z-oz]);R.push([ps[i].x+ox,y,ps[i].z+oz]);if(keep)avoid.push([ps[i].x,ps[i].z,keep]);}
 for(i=0;i<n;i++)b.quad(L[i],L[i+1],R[i+1],R[i],c);
 return ps;
}
function blob(b,cx,cz,r,y,c,n,wob,ph){var pts=[],i,a,rad;for(i=0;i<n;i++){a=i/n*PI*2;rad=r*(1+wob*Math.sin(3*a+ph)+wob*.6*Math.sin(2*a+ph*1.7));pts.push([cx+Math.cos(a)*rad,y,cz+Math.sin(a)*rad]);}for(i=0;i<n;i++)b.tri([cx,y,cz],pts[(i+1)%n],pts[i],c);}
function flat(g){var n=g.index?g.toNonIndexed():g;n.computeVertexNormals();return n;}

/* ---------- palette ---------- */
var IVORY=0xf3efe2,IVORY2=0xe8e1cf,STONE=0xd6d0bf,STONE2=0xc3bdab,ROOF=0x2f6b4b,ROOF2=0x4b8263,ROOF3=0xb7775a,FR=0x2f6b4b,WOOD=0xa9825a,WOOD2=0x8f6c49,TRUNK=0x7a5c41,PATH=0xefe6cc,WATER=0x8fcbd8,SAND=0xdbd1b0,GLS=0xdaf0f1,DARK=0x4e5f55,WIN=0x9cc3cf;
var GREENS=[0x2f6b4b,0x39734e,0x39734e,0x4a8558,0x4a8558,0x5c9661,0x6fa35f,0x83b26a],AUTUMN=[0xc9924a,0xbf7a3e,0xd9a94a,0xd3a05a];
var baseMat=new THREE.MeshLambertMaterial({vertexColors:true});
var glassMat=new THREE.MeshLambertMaterial({color:GLS,transparent:true,opacity:.42,depthWrite:false,emissive:0x2a3a3c});
var waterMat=new THREE.MeshLambertMaterial({color:WATER});
var W1=new THREE.Color(WATER),W2=new THREE.Color(0xa6dbe6);

/* ---------- island ---------- */
var RI=13.5;
function edgeR(a){return RI*(1+.07*Math.sin(3*a+.6)+.05*Math.sin(5*a+2.1)+.03*Math.sin(2*a+4));}
function inside(x,z,m){return Math.sqrt(x*x+z*z)<edgeR(Math.atan2(z,x))-(m||0);}
var base=new Builder(),water=new Builder(0),flowers=[];
(function(){
 var N=46,fr=[.3,.58,.82,1],rings=[],k,i,a,r,G=[0xa7ca88,0x9fc47f,0xb0d091,0xa9cc8a,0x98bf78];
 for(k=0;k<fr.length;k++){rings[k]=[];for(i=0;i<N;i++){a=i/N*PI*2+(k<3?rr(-.04,.04):0);r=edgeR(a)*fr[k]*(k<3?rr(.94,1.06):1);rings[k].push([Math.cos(a)*r,0,Math.sin(a)*r]);}}
 for(i=0;i<N;i++)base.tri([0,0,0],rings[0][(i+1)%N],rings[0][i],pick(G));
 for(k=0;k<3;k++)for(i=0;i<N;i++){var i1=(i+1)%N,A=rings[k][i],B=rings[k][i1],C=rings[k+1][i],D=rings[k+1][i1];base.tri(A,D,C,pick(G));base.tri(A,B,D,pick(G));}
 var prof=[[-.5,1.035],[-1.15,.985],[-3,.9],[-5.4,.73],[-7.9,.5],[-10.3,.26]];
 var sc=[[0x7fae63,0x76a65b],[0x648f4e,0x5c8748],[0xa98860,0x9c7b53],[0x97836c,0x8b7d6c,0xa08d74],[0x8f887c,0x817a70,0x9d9487],[0x878176,0x79736a,0x958d81],[0x7d776e,0x8b857a]];
 var up=rings[3],lo;
 for(k=0;k<prof.length;k++){lo=[];for(i=0;i<N;i++){a=i/N*PI*2;r=edgeR(a)*prof[k][1]*(k>=2?rr(.9,1.1):1);lo.push([Math.cos(a)*r+(k>=3?.3*(k-2):0),prof[k][0]+(k>=2?rr(-.45,.45):0),Math.sin(a)*r+(k>=3?.18*(k-2):0)]);}
  for(i=0;i<N;i++){var j=(i+1)%N;base.tri(up[i],up[j],lo[j],pick(sc[k]));base.tri(up[i],lo[j],lo[i],pick(sc[k]));}up=lo;}
 for(i=0;i<N;i++)base.tri(up[i],up[(i+1)%N],[1.3,-12.6,.8],pick(sc[6]));
 [[-6,-5.2,5,1.5,3.6],[5.5,-5.4,5.5,1.4,3.4],[7.5,-4,-1,1.1,2.8],[-1,-7.6,6,1.2,3],[-8,-4,-1,1,2.6]].forEach(function(s){base.add(new THREE.ConeGeometry(s[3],s[4],5),pick(sc[4]),s[0],s[1]-s[4]/2,s[2],PI,rr(0,3),0);});
})();

/* ---------- small props ---------- */
function win(b,x,y,z,w,h,ry){box(b,w,h,.06,x,y,z,WIN,ry);}
function door(b,x,y,z,w,h,ry){box(b,w,h,.08,x,y,z,0x7a5a3c,ry);}
function bench(b,x,z,ry){b.push(x,0,z,ry);box(b,.95,.06,.32,0,.26,0,WOOD);box(b,.95,.3,.06,0,.32,-.15,WOOD);box(b,.07,.26,.28,-.38,0,0,DARK);box(b,.07,.26,.28,.38,0,0,DARK);b.pop();}
function lamp(b,x,z){cyl(b,.035,.055,1.35,5,x,0,z,DARK);ico(b,.13,0,x,1.46,z,0xfff6d8);cone(b,.18,.1,6,x,1.56,z,DARK);}
var PCOL=[0x39734e,0xf3efe2,0xb7775a,0x5d7f96,0xd9a94a,0x7d8f84];
function person(b,x,z,y){y=y||0;cyl(b,.085,.14,.46,6,x,y,z,pick(PCOL));ico(b,.1,1,x,y+.58,z,0xe6d2b9);}
function hedge(b,x,z,w,d,ry){box(b,w,.42,d,x,0,z,0x3f7a52,ry);}
var FCOL=[0xfbf5e6,0xfbf5e6,0xeab9a8,0xf0d27a,0xcbb6de];
function bed(b,x,z,w,d,ry,n){ry=ry||0;box(b,w,.1,d,x,0,z,0x8b6b4b,ry);var i,lx,lz,c=Math.cos(ry),s=Math.sin(ry);for(i=0;i<n;i++){lx=rr(-w/2+.1,w/2-.1);lz=rr(-d/2+.1,d/2-.1);flowers.push([x+lx*c+lz*s,.17,z-lx*s+lz*c,pick(FCOL)]);}}
function clock(b,x,y,z,ry){b.push(x,y,z,ry);b.add(new THREE.CylinderGeometry(.43,.43,.06,12),ROOF,0,0,0,PI/2,0,0);b.add(new THREE.CylinderGeometry(.35,.35,.09,12),0xffffff,0,0,0,PI/2,0,0);box(b,.045,.25,.03,0,0,.05,0x26352b);box(b,.19,.045,.03,.08,-.02,.05,0x26352b);b.pop();}
function treeAt(b,x,y,z,s,c,pine){cyl(b,.08*s,.12*s,.6*s,5,x,y,z,TRUNK);if(pine){cone(b,.6*s,1.3*s,6,x,y+.45*s,z,c);cone(b,.44*s,1*s,6,x,y+1.15*s,z,c);}else ico(b,.75*s,0,x,y+1.2*s,z,c);}

/* ---------- paths, stream ---------- */
base.j=.018;
[[[1.2,10.8],[1.2,8.5]],
 [[1.2,9.4],[-.6,9.5],[-2.1,8],[-2.3,6.3],[-1.9,4.4],[-1.3,3]],
 [[-2.3,6.3],[-3.9,6.3],[-5,6],[-5.6,4.6],[-6.2,3],[-6.6,1.7]],
 [[-3.7,.5],[-5,1.1],[-6.3,1.5]],
 [[1.3,.6],[3.2,1],[5,.6],[6.6,.1]],
 [[1.2,9.4],[3.4,9.7],[5,8.6],[5.2,6.4],[4.9,4.4],[5.3,2.2],[6.2,.7]],
 [[-.9,-2.1],[-.6,-3.6],[0,-5],[.6,-5.8]],
 [[6.9,.3],[8.4,.9],[10,.5],[10.9,-1.2],[10.6,-3.6],[9.2,-5.6],[7,-7.2],[4.6,-8],[2.9,-7.9]],
 [[-1.3,-7.9],[-2.2,-7.4],[-3,-7.2]]
].forEach(function(p,i){ribbon(base,p,i===0?.95:.72,.035,PATH,.8);});
var STREAM=[[-4.6,3],[-4.1,4.6],[-3.9,6.3],[-4.3,8.4],[-5,10.2],[-5.6,11.8],[-5.95,12.7]];
ribbon(base,STREAM,1.25,.02,SAND,1.05);ribbon(water,STREAM,.78,.05,WATER,0);
blob(base,-4.6,3,1.25,.022,SAND,12,.05,.7);blob(water,-4.6,3,.95,.052,WATER,12,.05,.7);avoid.push([-4.6,3,1.6]);
water.add(new THREE.BoxGeometry(1,1.75,.2),0xa9dbe6,-6.13,-.82,13.1,0,-.43,0);
water.add(new THREE.BoxGeometry(.42,1.5,.2),0xddf1f4,-6.2,-.72,13.2,0,-.43,0);
base.j=0;ico(base,.34,0,-6.35,-1.75,13.3,0xffffff,1,.6,1);ico(base,.28,0,-5.85,-1.85,13.4,0xffffff,1,.6,1);ico(base,.22,0,-6.2,-2.05,13.6,0xf4fbfc,1,.6,1);ico(base,.17,0,-6,.07,12.82,0xffffff,1,.5,1);base.j=.018;
ico(base,.3,0,-5.3,.12,3.1,STONE2,1,.7,1);ico(base,.22,0,-3.9,.1,2.6,STONE,1,.7,1);ico(base,.2,0,-4.9,.1,3.9,STONE2,1,.7,1);
base.j=.03;

/* ---------- zones ---------- */
var ZB=[],GB={},wPond=new Builder(0),i;
for(i=0;i<5;i++)ZB.push(new Builder());
GB[1]=new Builder(0);GB[3]=new Builder(0);

(function(b){ /* 0 방문자센터 */
 b.push(1.2,0,6.8,0);
 box(b,4.7,.18,3.1,0,0,0,STONE);box(b,4.2,1.9,2.6,0,.18,0,IVORY);
 gable(b,3.1,1.25,4.6,0,2.08,0,ROOF,PI/2,IVORY2);
 box(b,1.3,1.45,.5,0,.18,1.45,IVORY2);gable(b,1.6,.62,.85,0,1.63,1.42,ROOF,0,IVORY);
 door(b,0,.18,1.7,.62,1.1);box(b,1.5,.1,.5,0,.02,1.9,STONE2);
 [-1.6,-.95,.95,1.6].forEach(function(x){win(b,x,.85,1.3,.4,.78);});
 win(b,-2.1,.85,-.55,.4,.78,PI/2);win(b,-2.1,.85,.55,.4,.78,PI/2);
 box(b,1.55,.24,1.55,2.75,0,.1,STONE);box(b,1.3,4.42,1.3,2.75,.2,.1,IVORY);box(b,1.52,.16,1.52,2.75,4.62,.1,STONE);
 pyr(b,1.6,1.5,1.6,2.75,4.78,.1,ROOF);cyl(b,.03,.03,.5,4,2.75,6.2,.1,DARK);ico(b,.09,0,2.75,6.76,.1,0xd9a94a);
 clock(b,2.75,3.8,.76,0);clock(b,3.41,3.8,.1,PI/2);clock(b,2.09,3.8,.1,-PI/2);
 win(b,2.75,1,.75,.34,.62);win(b,2.75,2.25,.75,.34,.62);win(b,3.4,1,.1,.34,.62,PI/2);win(b,3.4,2.25,.1,.34,.62,PI/2);
 b.pop();
 b.push(1.2,0,10.1,0);
 box(b,.44,1.55,.44,-.95,0,0,STONE);box(b,.44,1.55,.44,.95,0,0,STONE);box(b,.56,.12,.56,-.95,1.55,0,IVORY);box(b,.56,.12,.56,.95,1.55,0,IVORY);
 b.add(new THREE.TorusGeometry(.95,.16,4,10,PI),ROOF,0,1.67,0);
 hedge(b,-2.5,0,2.3,.5);hedge(b,2.5,0,2.3,.5);
 b.pop();
 lamp(b,.35,9.1);lamp(b,2.05,9.1);
})(ZB[0]);
bed(base,-.3,8.5,1.5,.5,0,12);bed(base,2.6,8.55,1.3,.5,0,10);
avoid.push([1.2,6.8,3.1],[3.95,6.9,1.5],[1.2,10.1,1.6],[-1.3,10.1,1.4],[3.7,10.1,1.4]);

(function(b,g){ /* 1 탄소정원 · 온실 */
 var F=.08,s;
 b.push(7.6,0,-1.8,-.35);g.push(7.6,0,-1.8,-.35);
 box(b,4.5,.4,2.9,0,0,0,STONE);box(b,1.95,.4,3.6,0,0,0,STONE);
 box(g,4.2,1.3,2.6,0,.4,0,GLS);gable(g,2.6,.95,4.2,0,1.7,0,GLS,PI/2);
 box(g,1.7,1.9,3.3,0,.4,0,GLS);gable(g,1.7,.8,3.3,0,2.3,0,GLS,0);
 [-2.1,-1.45,1.45,2.1].forEach(function(x){[-1.3,1.3].forEach(function(z){box(b,F,1.3,F,x,.4,z,FR);});
  [-1,1].forEach(function(s){b.add(new THREE.BoxGeometry(F,F,1.64),FR,x,2.18,s*.65,s*.631,0,0);});});
 box(b,4.28,F,F,0,1.66,1.3,FR);box(b,4.28,F,F,0,1.66,-1.3,FR);box(b,4.28,F,F,0,2.62,0,FR);
 box(b,F,.95,F,-2.1,1.7,0,FR);box(b,F,.95,F,2.1,1.7,0,FR);
 [-.85,.85].forEach(function(x){[-1.65,1.65].forEach(function(z){box(b,F,1.9,F,x,.4,z,FR);});box(b,F,F,3.38,x,2.26,0,FR);});
 box(b,F,F,3.38,0,3.07,0,FR);
 [-1.65,0,1.65].forEach(function(z){[-1,1].forEach(function(s){b.add(new THREE.BoxGeometry(1.19,F,F),FR,s*.425,2.72,z,0,0,-s*.755);});});
 box(b,1.78,F,F,0,2.26,1.65,FR);box(b,1.78,F,F,0,2.26,-1.65,FR);box(b,F,.8,F,0,2.3,1.65,FR);
 box(b,.66,1.3,.06,0,.4,1.66,FR);box(b,.46,1.08,.07,0,.46,1.67,0xc4e3e5);box(b,1,.12,.5,0,0,2.05,STONE2);
 [[-1.6,.5],[-1.5,-.5],[1.55,.45],[1.5,-.55],[0,-.9]].forEach(function(p){ico(b,.42,0,p[0],.82,p[1],pick(GREENS),1,1.1,1);});
 cyl(b,.07,.09,1.3,5,0,.4,.2,TRUNK);ico(b,.7,0,0,2,.2,0x4a8558,1,.75,1);
 b.pop();g.pop();
 blob(b,7.6,3.9,2.5,.022,SAND,18,.06,1.3);blob(wPond,7.6,3.9,2.15,.055,WATER,18,.06,1.3);
 [[7.2,3.2,.24],[8.3,3.6,.2],[7.9,4.8,.26],[6.9,4.7,.18],[8.6,4.5,.17],[7.7,2.6,.19]].forEach(function(p,k){cyl(b,p[2],p[2],.03,7,p[0],.065,p[1],0x5f9a5a);if(k%2===0)ico(b,.07,0,p[0]+.05,.14,p[1],0xf6dfe0);});
 [[9.4,2.9],[9.6,3.5],[9.5,4.4],[8.9,5.6],[6.2,5.6],[8.5,1.9]].forEach(function(p){for(var k=0;k<4;k++)cone(b,.045,rr(.5,.9),4,p[0]+rr(-.2,.2),0,p[1]+rr(-.2,.2),0x6f9a55);});
 ico(b,.3,0,9.8,.1,3.9,STONE2,1,.7,1);ico(b,.24,0,6.5,.1,2,STONE,1,.7,1);ico(b,.2,0,8.2,.1,6.2,STONE2,1,.7,1);
 b.push(5.95,0,4.3,0);
 box(b,1.8,.08,.95,0,.2,0,WOOD);[-.8,.8].forEach(function(x){[-.4,.4].forEach(function(z){cyl(b,.045,.045,.2,5,x,0,z,WOOD2);});});
 [-.85,0,.85].forEach(function(x){box(b,.05,.42,.05,x,.28,-.44,WOOD2);});box(b,1.8,.05,.05,0,.68,-.44,WOOD2);box(b,.05,.42,.05,.85,.28,.44,WOOD2);box(b,.05,.42,.05,.2,.28,.44,WOOD2);box(b,.7,.05,.05,.52,.68,.44,WOOD2);
 b.pop();
 person(b,6.3,4.3,.28);
})(ZB[1],GB[1]);
bed(base,5.6,-.9,.5,1.5,-.35,10);bed(base,8.2,.6,1.4,.5,-.35,10);
avoid.push([6.3,-2.3,2],[7.6,-1.8,2.4],[8.9,-1.3,2],[7.3,.1,1.2],[7.6,3.9,3],[5.9,4.3,1.3]);

(function(b){ /* 2 협력관 */
 var k,x;
 b.push(-7.8,0,-.8,.45);
 box(b,5.4,.14,4.3,0,0,.25,STONE);box(b,5,.14,3.9,0,.14,.25,STONE2);box(b,4.6,.14,3.5,0,.28,.25,STONE);
 box(b,3.9,2.1,2.3,0,.42,-.25,IVORY);
 for(k=0;k<6;k++){x=-1.95+k*.78;cyl(b,.15,.17,1.9,8,x,.52,1.55,0xf8f4ea);box(b,.42,.1,.42,x,.42,1.55,STONE);box(b,.4,.1,.4,x,2.42,1.55,STONE);}
 box(b,4.7,.34,3.6,0,2.52,.25,IVORY2);gable(b,4.95,1,3.8,0,2.86,.25,ROOF2,0,IVORY);
 b.add(new THREE.CylinderGeometry(.24,.24,.06,10),ROOF2,0,3.22,2.16,PI/2,0,0);
 door(b,0,.42,.91,.8,1.4);win(b,-1.2,1,.9,.5,.95);win(b,1.2,1,.9,.5,.95);
 win(b,1.96,1,-.7,.5,.95,PI/2);win(b,1.96,1,.2,.5,.95,PI/2);win(b,-1.96,1,-.7,.5,.95,PI/2);win(b,-1.96,1,.2,.5,.95,PI/2);
 b.pop();
 b.push(-8.6,0,5.6,1.35);
 box(b,2.7,.3,1.5,0,0,0,WOOD2);box(b,2.7,1.45,.12,0,.3,-.7,IVORY);
 box(b,.12,1.75,.12,-1.28,.3,.62,WOOD);box(b,.12,1.75,.12,1.28,.3,.62,WOOD);
 b.add(new THREE.BoxGeometry(3,.1,1.9),ROOF,0,2.08,0,.17,0,0);
 box(b,2.3,.2,.3,0,0,1.55,STONE2);box(b,2.6,.2,.3,0,0,2.15,STONE2);box(b,2.9,.2,.3,0,0,2.75,STONE2);
 person(b,.3,.2,.3);
 b.pop();
 b.push(-3.9,0,6.3,0);
 [-2,-1,0,1,2].forEach(function(q){box(b,.47,.08,.95,q*.44,.3-.055*q*q,0,WOOD);});
 [-.42,.42].forEach(function(z){[-1,0,1].forEach(function(q){box(b,.06,.5,.06,q*.95,.12+(q===0?.18:0),z,WOOD2);});
  b.add(new THREE.BoxGeometry(.98,.05,.05),WOOD2,-.475,.69,z,0,0,.19);b.add(new THREE.BoxGeometry(.98,.05,.05),WOOD2,.475,.69,z,0,0,-.19);});
 b.pop();
 lamp(b,-6.1,2.3);lamp(b,-7.4,2.6);
})(ZB[2]);
bed(base,-5.6,-1.3,.5,1.6,.45,10);
avoid.push([-7.8,-.6,3.7],[-6.9,1.2,1.6],[-8.5,5.5,1.9],[-7.2,6,1.4],[-6.2,6.3,1.2],[-3.9,6.3,1.4]);

(function(b,g){ /* 3 소식 광장 */
 var k,a,PC=[0xf7f3e8,0x39734e,0xd9a94a,0xf7f3e8,0xb7775a,0x9cc3cf];
 cyl(b,2.6,2.6,.07,26,-1.2,0,.4,0xe9e1cc);cyl(b,1.55,1.55,.03,20,-1.2,.07,.4,0xd9cfb5);cyl(b,.85,.85,.03,12,-1.2,.1,.4,0xe9e1cc);
 b.push(-1.2,.12,.4,.25);
 cyl(b,.52,.58,.14,6,0,0,0,STONE);cyl(b,.42,.42,2,6,0,.14,0,IVORY);
 for(k=0;k<6;k++){a=k*PI/3+PI/6;box(b,.3,.42,.04,Math.sin(a)*.375,.6,Math.cos(a)*.375,PC[k],a);box(b,.3,.3,.04,Math.sin(a)*.375,1.1,Math.cos(a)*.375,PC[(k+2)%6],a);box(b,.3,.2,.04,Math.sin(a)*.375,1.52,Math.cos(a)*.375,PC[(k+4)%6],a);}
 box(b,.9,.07,.9,0,2.1,0,STONE,.25);cone(b,.8,.6,6,0,2.17,0,ROOF);ico(b,.08,0,0,2.82,0,0xd9a94a);
 b.pop();
 [[-2.9,-.9,.7],[.4,-1.1,-.35]].forEach(function(p){b.push(p[0],.07,p[1],p[2]);box(b,.07,1.15,.07,-.52,0,0,WOOD2);box(b,.07,1.15,.07,.52,0,0,WOOD2);box(b,1.04,.66,.06,0,.46,0,ROOF);box(b,.26,.34,.03,-.3,.62,.04,0xf7f3e8);box(b,.26,.24,.03,.02,.7,.04,0xf0d27a);box(b,.24,.36,.03,.32,.6,.04,0xf7f3e8);box(b,1.2,.06,.22,0,1.15,0,WOOD);b.pop();});
 bench(b,-2.9,1.6,2.2);bench(b,.5,1.7,-2.2);bench(b,-3.3,.2,PI/2);
 lamp(b,-3,2.1);lamp(b,.7,2);lamp(b,-3.5,-.9);lamp(b,1.2,-.9);
 person(b,-.3,1.3,.07);person(b,-2.1,-.3,.07);person(b,-1.8,-.1,.07);
 b.push(-3.9,0,-4,.25);
 box(b,3.4,.2,2.6,0,0,0,STONE);box(b,3,2,2.2,0,.2,0,0xefe6d2);box(b,3.14,.12,2.34,0,2.2,0,STONE);
 pyr(b,3.5,1.05,2.7,0,2.32,0,ROOF3);
 [-1.15,-.62,.62,1.15].forEach(function(x){win(b,x,.7,1.1,.3,1.15);});win(b,1.5,.7,-.4,.3,1.15,PI/2);win(b,1.5,.7,.4,.3,1.15,PI/2);
 door(b,0,.2,1.1,.52,1.05);box(b,1,.1,.55,0,1.42,1.32,STONE);box(b,.09,1.22,.09,-.42,.2,1.5,IVORY);box(b,.09,1.22,.09,.42,.2,1.5,IVORY);box(b,1.1,.1,.6,0,.05,1.5,STONE2);
 b.pop();
 b.push(2.5,0,-3.7,-.2);g.push(2.5,0,-3.7,-.2);
 box(b,3.7,.15,2.8,0,0,0,STONE);box(b,3,1.6,.14,0,.15,-1,IVORY);box(b,.14,1.6,1.6,-1.43,.15,-.25,IVORY);
 box(g,2.75,1.5,1.45,.06,.15,-.2,GLS);
 box(b,.52,.62,.04,-.75,.72,-.91,0xc98a3c);box(b,.52,.62,.04,.05,.72,-.91,0x39734e);box(b,.52,.62,.04,.85,.72,-.91,0x7da7b5);
 [-1.6,0,1.6].forEach(function(x){cyl(b,.055,.055,1.6,6,x,.15,1.1,DARK);});
 box(b,3.9,.09,3,0,1.72,0,FR);box(b,3.84,.14,2.94,0,1.8,0,0xfbf8ef);
 box(b,.4,.5,.4,2.25,.15,.95,STONE2);ico(b,.26,0,2.25,.9,.95,0xb7775a,1,1.3,1);
 b.pop();g.pop();
})(ZB[3],GB[3]);
bed(base,-1.6,-4.9,.5,1.4,.25,10);bed(base,.9,-5.1,1.3,.5,-.2,9);
avoid.push([-1.2,.4,3.2],[-3.9,-4,2.5],[2.5,-3.7,2.6]);

(function(b){ /* 4 회원의 숲 */
 var cx=.8,cz=-7.9,k,a,pts=[];
 cyl(b,1.25,1.25,.05,14,cx,0,cz,0xbcd69c);
 for(k=0;k<14;k++){a=k/14*PI*2;pts.push([cx+Math.cos(a)*2.1,cz+Math.sin(a)*2.1]);}
 b.j=.018;ribbon(b,pts,.55,.04,PATH,0,true);b.j=.03;
 b.push(cx,0,cz,0);
 cyl(b,.36,.62,2.5,7,0,0,0,TRUNK);cone(b,.85,.5,6,0,0,0,TRUNK);
 b.add(new THREE.CylinderGeometry(.13,.2,1.6,5),TRUNK,.75,2.75,.1,0,0,-.85);b.add(new THREE.CylinderGeometry(.13,.2,1.6,5),TRUNK,-.7,2.8,-.2,0,0,.8);b.add(new THREE.CylinderGeometry(.12,.18,1.4,5),TRUNK,.1,2.8,.7,.8,0,0);
 [[0,4.5,0,2],[1.5,3.7,.4,1.4],[-1.4,3.8,-.3,1.5],[.2,3.6,1.4,1.35],[-.3,3.7,-1.3,1.3],[.4,5.6,-.1,1.35],[-.9,4.9,.8,1.1],[1,4.9,-.8,1.1]].forEach(function(f,q){ico(b,f[3],1,f[0],f[1],f[2],[0x2f6b4b,0x39734e,0x286044,0x4a8558][q%4],1,.9,1);});
 b.pop();
 for(k=0;k<8;k++){a=k/8*PI*2+.2;var x=cx+Math.cos(a)*2.95,z=cz+Math.sin(a)*2.95;cyl(b,.04,.05,.75,5,x,0,z,TRUNK);ico(b,.4,0,x,1,z,k%3===0?0x9cc27c:0x83b26a,1,1.1,1);box(b,.03,.6,.03,x+.14,0,z+.05,WOOD);
  b.push(cx+Math.cos(a)*2.52,0,cz+Math.sin(a)*2.52,Math.atan2(-Math.cos(a),-Math.sin(a)));box(b,.04,.24,.04,0,0,0,DARK);b.add(new THREE.BoxGeometry(.28,.2,.03),0xf8f4ea,0,.3,.02,-.6,0,0);b.pop();}
 bench(b,cx+1.2,cz+1.25,-2.4);bench(b,cx-1.3,cz+1.2,2.4);
 person(b,cx+2.1,cz+.3,.04);person(b,cx-.5,cz+2.1,.04);
 b.push(-3.9,0,-8.3,.5);
 box(b,2.4,.14,2.5,0,0,.3,STONE);box(b,2,1.15,1.5,0,.14,0,0xa97f55);
 gable(b,1.95,.85,2.45,0,1.29,0,0x5a5045,PI/2,0xa97f55);
 box(b,.28,.8,.28,.6,1.45,-.3,STONE2);door(b,-.35,.14,.75,.42,.85);win(b,.45,.55,.75,.42,.42);win(b,1,.55,0,.42,.42,PI/2);
 box(b,2,.08,.7,0,.14,1.1,WOOD);box(b,.07,1,.07,-.92,.22,1.4,WOOD2);box(b,.07,1,.07,.92,.22,1.4,WOOD2);box(b,2.1,.07,.8,0,1.22,1.1,0x5a5045);
 [0,1,2].forEach(function(q){b.add(new THREE.CylinderGeometry(.09,.09,.6,5),WOOD2,-1.25,.1+(q===2?.16:0),-.2+(q===2?.1:q*.2),PI/2,0,0);});
 b.pop();
})(ZB[4]);
avoid.push([.8,-7.9,3.5],[-3.9,-8.2,2.1]);

/* ---------- scattered props ---------- */
bench(base,3.9,8.9,-.5);bench(base,4.2,3.4,1.3);bench(base,-5.9,3.2,1.2);bench(base,9.9,-.6,-1.2);
lamp(base,-2.9,6.9);lamp(base,-4.9,5.4);lamp(base,4.4,7.3);lamp(base,4.3,1.5);lamp(base,-.1,-4.4);lamp(base,9.9,-3.4);lamp(base,5.9,-7.9);
person(base,2,9.3);person(base,2.3,9.5);person(base,4.3,.8);person(base,-5.2,5);person(base,8,-6.4);
hedge(base,-.6,5.1,.5,2.4,0);hedge(base,3.3,.1,2.2,.45,.1);
bed(base,3.2,-.55,2,.45,.1,14);bed(base,-4.6,.1,.45,1.2,-.3,8);
/* floating islets */
[[15.6,-3.4,6.5,1.4,true],[-15.5,-5,-7,1.2,false],[11,-7,-13,.9,false]].forEach(function(s){base.push(s[0],s[1],s[2],rr(0,3),s[3]);cyl(base,1.1,.95,.3,7,0,0,0,0x9fc47f);cyl(base,.95,.8,.3,7,0,-.3,0,0xa08462);base.add(new THREE.ConeGeometry(.82,1.9,7),0x8b8479,.1,-1.25,0,PI,0,0);if(s[4]){treeAt(base,-.2,.3,.1,.8,0x39734e,true);treeAt(base,.45,.3,-.3,.55,0xc98a3c,false);}else ico(base,.3,0,.2,.45,0,0x5c9661,1,.8,1);base.pop();});

/* ---------- trees, bushes ---------- */
var trees=[];
function free(x,z,m){if(!inside(x,z,m))return false;for(var k=0;k<avoid.length;k++){var dx=x-avoid[k][0],dz=z-avoid[k][1],r=avoid[k][2];if(dx*dx+dz*dz<r*r)return false;}return true;}
(function(){
 var k,x,z,q,ok,t,a,r;
 for(k=0;k<2600&&trees.length<150;k++){a=rr(0,PI*2);r=Math.sqrt(rnd())*15.5;x=Math.cos(a)*r;z=Math.sin(a)*r;if(!free(x,z,.75))continue;ok=true;for(q=0;q<trees.length;q++){t=trees[q];if((t.x-x)*(t.x-x)+(t.z-z)*(t.z-z)<1.15)ok=false;}if(!ok)continue;
  trees.push({x:x,z:z,s:rr(.85,1.4)*(z>5?.85:1),pine:rnd()<.42,c:rnd()<.13?pick(AUTUMN):pick(GREENS)});}
 for(k=0;k<70;k++){a=rr(0,PI*2);r=Math.sqrt(rnd())*15;x=Math.cos(a)*r;z=Math.sin(a)*r;if(!free(x,z,.5))continue;if(rnd()<.2)ico(base,rr(.14,.24),0,x,.08,z,pick([STONE,STONE2]),1,.7,1);else ico(base,rr(.24,.4),0,x,.2,z,pick(GREENS),1,.75,1);}
})();
var nP=0,nB=0;trees.forEach(function(t){if(t.pine)nP++;else nB++;});
var treeMat=new THREE.MeshLambertMaterial({color:0xffffff});
var gT=new THREE.CylinderGeometry(.08,.13,1,5);gT.translate(0,.5,0);gT=flat(gT);
var gC=new THREE.ConeGeometry(.62,1.35,6);gC.translate(0,.675,0);gC=flat(gC);
var gI=flat(new THREE.IcosahedronGeometry(.78,0));
var mT=new THREE.InstancedMesh(gT,treeMat,trees.length),mC=new THREE.InstancedMesh(gC,treeMat,Math.max(1,nP*2)),mI=new THREE.InstancedMesh(gI,treeMat,Math.max(1,nB*2));
(function(){
 var o=new THREE.Object3D(),col=new THREE.Color(),ci=0,ii=0,trunk=new THREE.Color(TRUNK);
 function put(m,idx,x,y,z,sx,sy,sz,ry,c){o.position.set(x,y,z);o.rotation.set(0,ry,0);o.scale.set(sx,sy,sz);o.updateMatrix();m.setMatrixAt(idx,o.matrix);m.setColorAt(idx,c);}
 trees.forEach(function(t,k){var s=t.s,ry=rr(0,6);
  put(mT,k,t.x,0,t.z,s,(t.pine?.6:1)*s,s,ry,trunk);
  col.set(t.c);
  if(t.pine){put(mC,ci++,t.x,.42*s,t.z,s,s,s,ry,col);col.offsetHSL(0,0,.03);put(mC,ci++,t.x,1.12*s,t.z,s*.72,s*.8,s*.72,ry+.5,col);}
  else{put(mI,ii++,t.x,1.42*s,t.z,s,s*.95,s,ry,col);col.offsetHSL(0,0,.035);put(mI,ii++,t.x+.38*s*Math.cos(ry),1.05*s,t.z+.38*s*Math.sin(ry),s*.62,s*.58,s*.62,ry+1,col);}
 });
 mC.count=ci;mI.count=ii;
 [mT,mC,mI].forEach(function(m){m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.castShadow=useShadow;m.receiveShadow=useShadow;m.frustumCulled=false;scene.add(m);});
})();
(function(){
 if(!flowers.length)return;
 var m=new THREE.InstancedMesh(flat(new THREE.OctahedronGeometry(.085,0)),treeMat,flowers.length),o=new THREE.Object3D(),c=new THREE.Color();
 flowers.forEach(function(f,k){o.position.set(f[0],f[1],f[2]);o.rotation.set(0,rr(0,3),0);var s=rr(.8,1.25);o.scale.set(s,s,s);o.updateMatrix();m.setMatrixAt(k,o.matrix);m.setColorAt(k,c.set(f[3]));});
 m.frustumCulled=false;scene.add(m);
})();

/* ---------- assemble ---------- */
scene.add(base.mesh(baseMat));
scene.add(water.mesh(waterMat,false,true));
var zoneGroups=[],zoneMats=[];
ZB.forEach(function(b,k){var g=new THREE.Group(),m=baseMat.clone();g.userData.zone=k;g.add(b.mesh(m));zoneMats.push(m);
 if(GB[k]){var gm=GB[k].mesh(glassMat,false,false);gm.renderOrder=2;g.add(gm);}
 if(k===1)g.add(wPond.mesh(waterMat,false,true));
 zoneGroups.push(g);scene.add(g);});

/* balloon, clouds, birds */
var balloon=new THREE.Group(),balloonBase=new V3(-9.5,10.2,-7.5);
(function(){
 var b=new Builder(.012),sg=new THREE.SphereGeometry(1.75,10,7),p=sg.attributes.position,k,y,f;
 for(k=0;k<p.count;k++){y=p.getY(k);f=y<0?1+y/1.75*.42:1;p.setXYZ(k,p.getX(k)*f,y<0?y*1.25:y,p.getZ(k)*f);}
 b.add(sg,function(x,y,z){var s=Math.floor((Math.atan2(z,x)+PI)/(PI*2)*10+.0001)%2;return s?0x286044:0xf3efe2;},0,0,0);
 cyl(b,.42,.3,.28,10,0,-2.5,0,0x244f36);
 box(b,.52,.4,.52,0,-3.6,0,WOOD);box(b,.58,.06,.58,0,-3.22,0,WOOD2);
 [[-.22,-.22],[.22,-.22],[-.22,.22],[.22,.22]].forEach(function(c){box(b,.02,.76,.02,c[0],-3.2,c[1],0x5c5348);});
 balloon.add(b.mesh(baseMat,false,false));balloon.position.copy(balloonBase);scene.add(balloon);
})();
var clouds=[];
[[13.5,5.2,-9.5,1.25],[-14,-4.2,9,1],[11,9.6,3,.8],[-3,10.2,-13,.9]].forEach(function(c){
 var b=new Builder(0),k,n=5;for(k=0;k<n;k++)ico(b,rr(.75,1.25),1,(k-(n-1)/2)*1.05+rr(-.2,.2),rr(-.12,.3)+(k===2?.35:0),rr(-.4,.4),0xffffff,1.15,.62,1);
 var m=b.mesh(baseMat,false,false);m.position.set(c[0],c[1],c[2]);m.scale.setScalar(c[3]);m.userData.b=m.position.clone();clouds.push(m);scene.add(m);});
var birds=[],birdMat=new THREE.MeshBasicMaterial({color:0x44524a,side:THREE.DoubleSide});
(function(){
 var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,-.13,0,0,.13,-.5,.16,.06,0,0,.13,0,0,-.13,.5,.16,.06],3));
 [[10.5,9.2,0],[11.6,9.9,.5],[9.6,10.4,1.1]].forEach(function(s){var m=new THREE.Mesh(g,birdMat);m.userData={r:s[0],y:s[1],p:s[2]};m.frustumCulled=false;birds.push(m);scene.add(m);});
})();

/* lights */
scene.add(new THREE.HemisphereLight(0xffffff,0xc3d2b2,1.75));
var sun=new THREE.DirectionalLight(0xfff2da,2.25);sun.position.set(-17,27,15);scene.add(sun);
if(useShadow){sun.castShadow=true;var sc=sun.shadow.camera;sc.left=-19;sc.right=19;sc.top=19;sc.bottom=-19;sc.near=4;sc.far=80;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0004;sun.shadow.normalBias=.04;renderer.shadowMap.needsUpdate=true;}

/* ---------- camera ---------- */
var ZV=[
 {a:[1.2,3.36,6.8],c:[1.8,1.5,7.6],th:.3},
 {a:[7.6,3.16,-1.8],c:[7.5,1,.8],th:.12},
 {a:[-7.69,3.88,-.57],c:[-6.9,1.4,1.6],th:.38},
 {a:[-1.2,2.96,.4],c:[-.9,1.1,-1.3],th:.3},
 {a:[1.2,6.8,-8],c:[-.5,2.5,-7.8],th:.3}
];
var W=1,H=1,fitR=52,PH0=.42,PH1=1.36;
var cur={th:.35,ph:1,r:52,x:0,y:1.6,z:0,s:0},KEYS=['th','ph','r','x','y','z','s'],tw=null,dirty=true;
function fit(){var asp=W/H,use=isSmall?.97:.6,nw=isSmall?29.5:31.5,nh=isSmall?21:23.5;fitR=Math.max(nw/(2*tanH*asp*use),nh/(2*tanH));}
function home(){return isSmall?{th:.35,ph:.84,r:fitR,x:0,y:.9,z:0,s:0}:{th:.35,ph:1.01,r:fitR,x:0,y:1.5,z:0,s:.19};}
function zoneView(k){var z=ZV[k],asp=W/H,m=Math.max(24,(W-1240)/2),s=0,use=.95;
 if(!isSmall){var l=W*.4,rt=W-m-(W<1200?310:340)-18;s=((l+rt)/2)/W-.5;use=Math.max(.2,(rt-l)/W);}
 var r=Math.max(11.5/(2*tanH*asp*use),(isSmall?11:12.5)/(2*tanH));r=Math.min(r,fitR*.8);
 return {th:z.th,ph:isSmall?.9:1.04,r:r,x:z.c[0],y:z.c[1],z:z.c[2],s:s};}
function setCur(v){for(var k=0;k<KEYS.length;k++)cur[KEYS[k]]=v[KEYS[k]];tw=null;dirty=true;}
function go(to,ms){if(reduce||ms===0){setCur(to);return;}var f={},k,d=to.th-cur.th;for(k=0;k<KEYS.length;k++)f[KEYS[k]]=cur[KEYS[k]];to.th=cur.th+Math.atan2(Math.sin(d),Math.cos(d));tw={f:f,t:to,t0:performance.now(),ms:ms||900};}
function applyCam(){var sp=Math.sin(cur.ph),cp=Math.cos(cur.ph),off=Math.round(cur.s*W);
 camera.position.set(cur.x+cur.r*sp*Math.sin(cur.th),cur.y+cur.r*cp,cur.z+cur.r*sp*Math.cos(cur.th));camera.lookAt(cur.x,cur.y,cur.z);
 if(off)camera.setViewOffset(W,H,-off,0,W,H);else if(camera.view&&camera.view.enabled)camera.clearViewOffset();
 camera.updateMatrixWorld();}

/* ---------- signs ---------- */
var signs=[],sv=new V3();
Array.prototype.forEach.call(document.querySelectorAll('.vg-sign'),function(el){var k=parseInt(el.getAttribute('data-vg-zone'),10);if(!(k>=0)||!ZV[k]||!DATA[k]){el.classList.add('vg-off');return;}signs.push({el:el,k:k,w:0,h:0,tr:'',st:'',off:false,x:0,y:0,top:0,left:0,z:0});});
function measure(){signs.forEach(function(s){s.w=s.el.offsetWidth;s.h=s.el.offsetHeight;});dirty=true;}
function placeSigns(){
 var k,q,s,o,STEM=16,list=[],px,cut=sel>=0&&!isSmall,cl=cut?(W-Math.max(24,(W-1240)/2)-(W<1200?310:340)-30)/W:2;
 for(k=0;k<signs.length;k++){s=signs[k];o=ZV[s.k].a;sv.set(o[0],o[1]+zoneGroups[s.k].position.y,o[2]).project(camera);
  var off=sv.z>1||sv.z<-1||sv.x<-1.15||sv.x>1.15||sv.y<-1.2||sv.y>1.2;px=sv.x*.5+.5;if(cut&&s.k!==sel&&(px<.42||px>cl))off=true;
  if(off!==s.off){s.off=off;s.el.classList.toggle('vg-off',off);}
  if(off)continue;
  s.x=(sv.x*.5+.5)*W;s.y=(-sv.y*.5+.5)*H;s.z=sv.z;
  s.left=Math.min(Math.max(s.x-s.w/2,8),W-s.w-8);s.top=Math.min(Math.max(s.y-STEM-s.h,8),H-s.h-8);list.push(s);}
 list.sort(function(a,b){return a.z-b.z;});
 for(k=1;k<list.length;k++){s=list[k];for(var pass=0;pass<2;pass++)for(q=0;q<k;q++){o=list[q];if(s.left<o.left+o.w+6&&s.left+s.w+6>o.left&&s.top<o.top+o.h+6&&s.top+s.h+6>o.top)s.top=Math.max(8,o.top-s.h-8);}}
 for(k=0;k<list.length;k++){s=list[k];var tr='translate('+Math.round(s.left)+'px,'+Math.round(s.top)+'px)',st=Math.round(s.y-Math.round(s.top)-s.h-1),ns=st<4||Math.abs(s.x-(s.left+s.w/2))>s.w/2-8;st=st+'px';if(ns!==s.ns){s.ns=ns;s.el.classList.toggle('vg-nostem',ns);}
  if(tr!==s.tr){s.tr=tr;s.el.style.transform=tr;s.el.style.zIndex=String(10+list.length-k);}
  if(st!==s.st){s.st=st;s.el.style.setProperty('--vg-stem',st);}}
}

/* ---------- selection ---------- */
var sel=-1,hot=-1,active=false;
var cLabel=card.querySelector('.vg-card-label'),cName=card.querySelector('.vg-card-name'),cGroup=card.querySelector('.vg-card-group'),cDesc=card.querySelector('.vg-card-desc'),cList=card.querySelector('.vg-links'),cClose=card.querySelector('.vg-card-x');
function safe(p){return typeof p==='string'&&p.charAt(0)==='/'&&p.charAt(1)!=='/'&&p.charAt(1)!=='\\'?p:'#';}
function fillCard(k){var d=DATA[k],a,li;cLabel.textContent=d.label||'';cName.textContent=d.name||'';cDesc.textContent=d.desc||'';
 cGroup.textContent='';a=document.createElement('a');a.href=safe(d.path);a.textContent=d.title||'';cGroup.appendChild(a);cGroup.appendChild(document.createTextNode(' 메뉴 '+(d.items?d.items.length:0)+'개'));
 while(cList.firstChild)cList.removeChild(cList.firstChild);
 (d.items||[]).forEach(function(it){li=document.createElement('li');a=document.createElement('a');a.href=safe(it[0]);a.textContent=it[1];li.appendChild(a);cList.appendChild(li);});}
function press(){signs.forEach(function(s){s.el.setAttribute('aria-pressed',s.k===sel?'true':'false');});}
function select(k,viaKey){if(!DATA[k]||!ZV[k])return;sel=k;active=true;press();fillCard(k);card.hidden=false;card.scrollTop=0;root.classList.add('vg-sel');go(zoneView(k));
 if(viaKey){try{card.focus({preventScroll:!isSmall});}catch(e){}}
 else if(isSmall){setTimeout(function(){var need=card.getBoundingClientRect().top+200-window.innerHeight;if(need>0)window.scrollBy({top:need,left:0,behavior:reduce?'auto':'smooth'});},60);}}
function clearSel(refocus){var p=sel;sel=-1;press();card.hidden=true;root.classList.remove('vg-sel');if(refocus&&p>=0)signs.forEach(function(s){if(s.k===p){try{s.el.focus({preventScroll:true});}catch(e){}}});}
function reset(refocus){clearSel(refocus);active=false;go(home());}
signs.forEach(function(s){
 s.el.addEventListener('click',function(e){if(sel===s.k){reset(false);return;}select(s.k,e.detail===0);});
 s.el.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse')setHot(s.k);});
 s.el.addEventListener('pointerleave',function(){setHot(-1);});
 s.el.addEventListener('focus',function(){setHot(s.k);});s.el.addEventListener('blur',function(){setHot(-1);});
});
if(resetBtn)resetBtn.addEventListener('click',function(){reset(false);});
if(cClose)cClose.addEventListener('click',function(){reset(true);});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&sel>=0&&!failed)reset(hero.contains(document.activeElement));});
document.addEventListener('pointerdown',function(e){if(!hero.contains(e.target))active=false;},true);
Array.prototype.forEach.call(document.querySelectorAll('.vg-show'),function(el){el.addEventListener('click',function(){var k=parseInt(el.getAttribute('data-vg-zone'),10);if(failed||!(k>=0))return;select(k,false);hero.scrollIntoView({block:'start',behavior:reduce?'auto':'smooth'});});});
function setHot(k){if(k===hot)return;hot=k;signs.forEach(function(s){s.el.classList.toggle('vg-hot',s.k===hot);});zoneMats.forEach(function(m,q){m.emissive.setHex(q===hot?0x18261c:0x000000);});canvas.classList.toggle('vg-point',hot>=0);dirty=true;}

/* ---------- pointer / wheel ---------- */
var ray=new THREE.Raycaster(),nd=new THREE.Vector2(),drag=null,hoverXY=null;
function hitZone(cx,cy){var r=canvas.getBoundingClientRect();if(!r.width||!r.height)return -1;nd.set((cx-r.left)/r.width*2-1,-((cy-r.top)/r.height)*2+1);ray.setFromCamera(nd,camera);var hs=ray.intersectObjects(zoneGroups,true);if(!hs.length)return -1;var o=hs[0].object;while(o&&o.userData.zone===undefined)o=o.parent;return o&&DATA[o.userData.zone]?o.userData.zone:-1;}
canvas.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse'&&e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,moved:false,touch:e.pointerType!=='mouse',t:performance.now()};if(!drag.touch){active=true;try{canvas.setPointerCapture(e.pointerId);}catch(err){}}});
canvas.addEventListener('pointermove',function(e){
 if(drag&&drag.id===e.pointerId){var dx=e.clientX-drag.x,dy=e.clientY-drag.y,ax=Math.abs(e.clientX-drag.sx),ay=Math.abs(e.clientY-drag.sy);
  if(!drag.moved&&(ax>6||(!drag.touch&&ay>6))){if(drag.touch&&ay>ax){drag=null;return;}drag.moved=true;tw=null;canvas.classList.add('vg-grab');if(drag.touch){try{canvas.setPointerCapture(e.pointerId);}catch(err){}}}
  if(drag.moved){cur.th-=dx*(drag.touch?.008:.006);if(!drag.touch)cur.ph=Math.min(PH1,Math.max(PH0,cur.ph-dy*.005));dirty=true;}
  drag.x=e.clientX;drag.y=e.clientY;return;}
 if(e.pointerType==='mouse')hoverXY=[e.clientX,e.clientY];});
function endDrag(e,tap){if(!drag||drag.id!==e.pointerId)return;var d=drag;drag=null;canvas.classList.remove('vg-grab');if(tap&&!d.moved&&performance.now()-d.t<700){var k=hitZone(e.clientX,e.clientY);if(k>=0){if(k!==sel)select(k,false);}}}
canvas.addEventListener('pointerup',function(e){endDrag(e,true);});
canvas.addEventListener('pointercancel',function(e){endDrag(e,false);});
canvas.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'&&!drag){hoverXY=null;setHot(-1);}});
canvas.addEventListener('wheel',function(e){if(!active&&sel<0)return;var f=Math.exp(e.deltaY*(e.deltaMode===1?.05:.0012)),lo=Math.min(fitR*.26,12),hi=fitR*1.12,nr=Math.min(hi,Math.max(lo,cur.r*f));if(Math.abs(nr-cur.r)<.0005)return;e.preventDefault();tw=null;cur.r=nr;dirty=true;},{passive:false});

/* ---------- size / loop ---------- */
var lastW=0,first=true,running=false,raf=0,visible=true,clockT=0,lastNow=0,lifts=[0,0,0,0,0];
function resize(){var r=stage.getBoundingClientRect(),w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));if(w===W&&h===H&&!first)return;
 var was=fitR,smallNow=mqSmall.matches;W=w;H=h;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,smallNow?1.5:2));renderer.setSize(W,H,false);camera.aspect=W/H;camera.updateProjectionMatrix();
 var mode=smallNow!==isSmall;isSmall=smallNow;fit();
 if(first||mode||Math.abs(w-lastW)>1){setCur(sel>=0?zoneView(sel):home());}else{cur.r*=fitR/was;}
 lastW=w;measure();dirty=true;}
function frame(now){raf=0;if(!running)return;var dt=Math.min(.05,(now-(lastNow||now))/1000),k,e,t;lastNow=now;
 if(tw){t=Math.min(1,(now-tw.t0)/tw.ms);e=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;for(k=0;k<KEYS.length;k++)cur[KEYS[k]]=tw.f[KEYS[k]]+(tw.t[KEYS[k]]-tw.f[KEYS[k]])*e;if(t>=1)tw=null;dirty=true;}
 if(hoverXY&&!drag){setHot(hitZone(hoverXY[0],hoverXY[1]));hoverXY=null;}
 for(k=0;k<zoneGroups.length;k++){var goal=k===hot?.13:0,v=lifts[k];if(Math.abs(goal-v)>.001){v=reduce?goal:v+(goal-v)*Math.min(1,dt*10);lifts[k]=v;zoneGroups[k].position.y=v;dirty=true;}}
 if(!reduce){clockT+=dt;t=clockT;
  balloon.position.set(balloonBase.x+Math.sin(t*.21)*.7,balloonBase.y+Math.sin(t*.55)*.4,balloonBase.z+Math.cos(t*.17)*.6);balloon.rotation.y=Math.sin(t*.12)*.5;
  for(k=0;k<clouds.length;k++){var c=clouds[k];c.position.x=c.userData.b.x+Math.sin(t*.06+k*1.7)*1.8;c.position.y=c.userData.b.y+Math.sin(t*.19+k)*.18;}
  for(k=0;k<birds.length;k++){var b=birds[k],u=b.userData,a=t*.22+u.p;b.position.set(Math.cos(a)*u.r-2,u.y+Math.sin(t*.7+u.p)*.35,Math.sin(a)*u.r-2);b.rotation.y=-a;b.scale.y=Math.sin(t*7+u.p*3)*1.5;}
  waterMat.color.copy(W1).lerp(W2,(Math.sin(t*1.1)+1)*.3);dirty=true;}
 if(dirty){dirty=false;applyCam();renderer.render(scene,camera);placeSigns();if(first){first=false;root.classList.add('vg-ready');}}
 raf=requestAnimationFrame(frame);}
function setRun(){var want=visible&&!document.hidden&&!failed;if(want&&!running){running=true;lastNow=0;dirty=true;if(!raf)raf=requestAnimationFrame(frame);}else if(!want&&running){running=false;if(raf){cancelAnimationFrame(raf);raf=0;}}}
var ro=null,io=null;
function onVis(){setRun();}
stopAll=function(){running=false;if(raf){cancelAnimationFrame(raf);raf=0;}if(ro)ro.disconnect();if(io)io.disconnect();document.removeEventListener('visibilitychange',onVis);};
canvas.addEventListener('webglcontextlost',function(e){e.preventDefault();fail(new Error('WebGL context lost'));});
resize();
if(window.ResizeObserver){ro=new ResizeObserver(function(){resize();});ro.observe(stage);}else window.addEventListener('resize',resize);
if(window.IntersectionObserver){io=new IntersectionObserver(function(es){visible=es[es.length-1].isIntersecting;setRun();},{rootMargin:'80px'});io.observe(hero);}
document.addEventListener('visibilitychange',onVis);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure,function(){});
setRun();
}
})();
`;

const ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3v10M3.5 8.5 8 13l4.5-4.5"/></svg>';
const CLOSE = '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 4l10 10M14 4 4 14"/></svg>';

export function villageMain(groups) {
  const zones = zoneData(groups);
  const signs = zones.map((z, i) => `<button type="button" class="vg-sign" data-vg-zone="${i}" aria-pressed="false"><b>${esc(z.name)}</b><span>${esc(z.title)} · ${z.items.length}</span></button>`).join('');
  const links = z => z.items.map(it => `<li><a href="${href(it[0])}">${esc(it[1])}</a></li>`).join('');
  const cards = zones.map((z, i) => `<article class="vg-zone"><p class="vg-zone-label">${esc(z.label)}</p><h3 class="vg-zone-name">${esc(z.name)}</h3><p class="vg-zone-group"><a href="${href(z.path)}">${esc(z.title)}</a> 메뉴 ${z.items.length}개</p><p class="vg-zone-desc">${esc(z.desc)}</p><ul class="vg-links">${links(z)}</ul><button type="button" class="vg-show" data-vg-zone="${i}">지도에서 보기</button></article>`).join('');
  const json = JSON.stringify(zones).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return `<main class="village-page" id="main"><style>${CSS}</style>
<section class="vg-hero" id="vg-hero" aria-labelledby="vg-title">
<div class="vg-copy"><div class="vg-wrap"><div class="vg-copy-in">
<p class="vg-eyebrow">ESG GARDEN VILLAGE</p>
<h1 class="vg-h1" id="vg-title">정원마을을 거닐며<br>포럼을 만나 보세요.</h1>
<p class="vg-lead">대한민국 ESG정원정책포럼의 소개와 사업, 협력, 소식, 회원 안내를 정원마을의 다섯 구역에 담았습니다.</p>
<p class="vg-lead"><strong>건물이나 간판을 누르면 그 구역의 메뉴가 열립니다.</strong></p>
<a class="vg-btn" href="#vg-list">메뉴 목록 바로 보기${ARROW}</a>
</div></div></div>
<div class="vg-veil" aria-hidden="true"></div>
<div class="vg-stage" id="vg-stage">
<canvas class="vg-canvas" id="vg-canvas" aria-hidden="true"></canvas>
<div class="vg-signs" id="vg-signs" role="group" aria-label="정원마을 구역 간판">${signs}</div>
<div class="vg-tools"><button type="button" class="vg-pill" id="vg-reset">전체 보기</button><span class="vg-hint">끌어서 돌려 보기 · 구역을 누르면 확대됩니다</span></div>
</div>
<p class="vg-note" id="vg-note" role="status" hidden>이 기기에서는 3D 지도를 표시할 수 없어 목록으로 안내합니다.</p>
<noscript><p class="vg-note">3D 지도는 자바스크립트가 켜져 있을 때 표시됩니다. 아래 목록에서 모든 메뉴로 이동할 수 있습니다.</p></noscript>
<aside class="vg-card" id="vg-card" tabindex="-1" aria-labelledby="vg-card-name" hidden>
<button type="button" class="vg-card-x" aria-label="구역 안내 닫기">${CLOSE}</button>
<p class="vg-card-label"></p><h2 class="vg-card-name" id="vg-card-name"></h2><p class="vg-card-group"></p><p class="vg-card-desc"></p><ul class="vg-links"></ul>
</aside>
</section>
<section class="vg-list" id="vg-list" aria-labelledby="vg-list-title"><div class="vg-wrap">
<h2 class="vg-list-h" id="vg-list-title">정원마을 구역 안내</h2>
<p class="vg-list-lead">다섯 구역에 담긴 메뉴를 목록으로도 볼 수 있습니다.</p>
<div class="vg-grid">${cards}</div>
</div></section>
<script type="application/json" id="vg-data">${json}</script>
<script type="importmap">{"imports":{"three":"/vendor/three-0.169.0.module.min.js"}}</script>
<script type="module">${CLIENT}</script>
</main>`;
}
