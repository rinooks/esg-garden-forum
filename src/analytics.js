import {canonicalPath,activePageWhere} from './navigation.js';
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const dayKST=ms=>new Date(ms+9*3600000).toISOString().slice(0,10);
const shift=(day,n)=>new Date(Date.parse(day+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
const n=v=>Number(v)||0;
const bad=(msg,status=400)=>{throw Object.assign(new Error(msg),{status});};
async function hash(value,key){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);return [...new Uint8Array(await crypto.subtle.sign('HMAC',k,new TextEncoder().encode(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
function sourceHost(value,origin){if(!value||value==='직접 방문')return '직접 방문';try{const u=new URL('https://'+String(value));const h=u.hostname.toLowerCase();return h===new URL(origin).hostname||!/^([a-z0-9-]+\.)*[a-z0-9-]+$/.test(h)||h.length>100?'직접 방문':h;}catch{return '직접 방문';}}
async function smallBody(req){if(Number(req.headers.get('Content-Length')||0)>4000)bad('요청 용량이 너무 큽니다.',413);const reader=req.body?.getReader();if(!reader)bad('올바른 요청이 아닙니다.');const chunks=[];let size=0;while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>4000){await reader.cancel();bad('요청 용량이 너무 큽니다.',413);}chunks.push(part.value);}const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.byteLength;}return new TextDecoder().decode(bytes);}
export async function recordAnalytics(req,env){
 if(req.headers.get('DNT')==='1'||req.headers.get('Sec-GPC')==='1'||/(?:bot\b|spider|crawler|curl\/|wget\/|headlesschrome|preview)/i.test(req.headers.get('User-Agent')||'')||req.cf?.botManagement?.verifiedBot)return {ok:true,excluded:true};
 const raw=await smallBody(req);let b;try{b=JSON.parse(raw);}catch{bad('올바른 요청이 아닙니다.');}
 if(!UUID.test(String(b.session||''))||!['view','heartbeat'].includes(b.type))bad('올바른 접속 요청이 아닙니다.');
 const now=Math.floor(Date.now()/1000),day=dayKST(now*1000),sid=(await hash(day+':'+b.session,env.SESSION_KEY)).slice(0,32);
 if(b.type==='heartbeat'){const previous=shift(day,-1),previousSid=(await hash(previous+':'+b.session,env.SESSION_KEY)).slice(0,32);await env.DB.prepare('UPDATE analytics_sessions SET last_seen=? WHERE ((day=? AND sid=?) OR (day=? AND sid=? AND NOT EXISTS(SELECT 1 FROM analytics_sessions WHERE day=? AND sid=?))) AND last_seen<?').bind(now,day,sid,previous,previousSid,day,sid,now-30).run();return {ok:true};}
 if(!UUID.test(String(b.id||'')))bad('올바른 접속 요청이 아닙니다.');
 let path=String(b.path||'').replace(/\/$/,'')||'/';if(!/^\/[a-z0-9/_-]*$/i.test(path)||path.length>180)bad('페이지 주소를 확인해 주세요.');path=canonicalPath(path);
 let exists=path==='/'||path==='/contact'||path==='/village';if(!exists){if(path.startsWith('/posts/'))exists=!!await env.DB.prepare('SELECT id FROM posts WHERE id=? AND published=1').bind(path.split('/').pop()).first();else exists=!!await env.DB.prepare('SELECT path FROM pages WHERE path=?').bind(path).first();}if(!exists)bad('집계 대상 페이지가 아닙니다.',404);
 const device=['desktop','tablet','mobile'].includes(b.device)?b.device:'desktop',referrer=sourceHost(b.referrer,req.url),id=await hash(day+':'+sid+':'+b.id,env.SESSION_KEY);
 await env.DB.prepare('INSERT OR IGNORE INTO analytics_events(id,day,sid,at,path,device,referrer) VALUES(?,?,?,?,?,?,?)').bind(id,day,sid,now,path,device,referrer).run();
 return {ok:true};
}
export async function analyticsDashboard(env,requestedDays){
 const days=[7,30,60].includes(Number(requestedDays))?Number(requestedDays):30,now=Date.now(),today=dayKST(now),start=shift(today,1-days),yesterday=shift(today,-1);
 const queries=[
 ['SELECT value FROM settings WHERE key=?',['analytics_started_at']],
 ['SELECT day,views,sessions FROM analytics_daily WHERE day>=? AND day<=? ORDER BY day',[start,today]],
 ['SELECT views,sessions FROM analytics_daily WHERE day=?',[yesterday]],
 ['SELECT count(*) AS n FROM analytics_sessions WHERE last_seen>=?',[Math.floor(now/1000)-300]],
 ['SELECT hour,views FROM analytics_hourly WHERE day=? ORDER BY hour',[today]],
 ['SELECT path,sum(views) AS views FROM analytics_page_daily WHERE day>=? AND day<=? GROUP BY path ORDER BY views DESC LIMIT 10',[start,today]],
 ['SELECT device,sum(views) AS views,sum(sessions) AS sessions FROM analytics_devices_daily WHERE day>=? AND day<=? GROUP BY device ORDER BY sessions DESC',[start,today]],
 ['SELECT host,sum(views) AS views,sum(sessions) AS sessions FROM analytics_referrers_daily WHERE day>=? AND day<=? GROUP BY host ORDER BY sessions DESC LIMIT 8',[start,today]],
 ['SELECT at,path,device,referrer,substr(sid,1,6) AS label FROM analytics_events ORDER BY at DESC LIMIT 20',[]],
 ['SELECT path,title FROM pages WHERE '+activePageWhere,[]],
 ['SELECT id,title FROM posts',[]],
 ["SELECT (SELECT count(*) FROM posts) AS posts,(SELECT count(*) FROM posts WHERE published=1) AS published,(SELECT count(*) FROM posts WHERE published=0) AS drafts,(SELECT count(*) FROM pages WHERE "+activePageWhere+") AS pages,(SELECT count(*) FROM files) AS files,(SELECT coalesce(sum(size),0) FROM files) AS fileBytes,(SELECT max(created_at) FROM posts WHERE published=1) AS latestPublishedAt",[]],
 ['SELECT status,count(*) AS count FROM inquiries GROUP BY status',[]],
 ["SELECT type,count(*) AS count FROM inquiries WHERE created_at>=datetime(?,'-9 hours') GROUP BY type ORDER BY count DESC",[start]],
 ["SELECT strftime('%Y-%m-%d',created_at,'+9 hours') AS date,count(*) AS count FROM inquiries WHERE created_at>=datetime(?,'-9 hours') GROUP BY date ORDER BY date",[start]],
 ['SELECT id,type,name,email,organization,subject,message,status,created_at FROM inquiries ORDER BY created_at DESC LIMIT 5',[]]
 ];
 const rows=await env.DB.batch(queries.map(([sql,args])=>env.DB.prepare(sql).bind(...args)));const r=rows.map(x=>x.results||[]),dailyBy=new Map(r[1].map(x=>[x.day,x])),inqBy=new Map(r[14].map(x=>[x.date,n(x.count)]));
 const firstDay=r[0][0]?.value?dayKST(Date.parse(r[0][0].value)):today;
 const daily=Array.from({length:days},(_,i)=>{let date=shift(start,i),x=dailyBy.get(date)||{},available=date>=firstDay;return {date,available,views:available?n(x.views):null,sessions:available?n(x.sessions):null,inquiries:inqBy.get(date)||0};});
 const titleMap=new Map([['/','홈'],['/contact','문의하기'],['/village','정원마을 지도'],...r[9].map(p=>[p.path,p.title]),...r[10].map(p=>['/posts/'+p.id,p.title])]);const td=dailyBy.get(today)||{},periodViews=daily.reduce((s,d)=>s+d.views,0),periodSessions=daily.reduce((s,d)=>s+d.sessions,0),byStatus={new:0,reviewing:0,done:0};for(let x of r[12])if(x.status in byStatus)byStatus[x.status]=n(x.count);const periodInquiries=r[14].reduce((s,x)=>s+n(x.count),0);
 const started=r[0][0]?.value||null;let observed=days;if(started){let first=dayKST(Date.parse(started));if(first>start)observed=Math.max(1,Math.floor((Date.parse(today)-Date.parse(first))/86400000)+1);}
 return {ok:true,collectedSince:started,timezone:'Asia/Seoul',range:{days,start,end:today},overview:{todayViews:n(td.views),todaySessions:n(td.sessions),activeNow:n(r[3][0]?.n),yesterdayAvailable:yesterday>=firstDay,yesterdayViews:yesterday>=firstDay?n(r[2][0]?.views):null,periodViews,periodSessions,avgDailyViews:Math.round(periodViews/observed*10)/10},daily,hourly:Array.from({length:24},(_,hour)=>{let available=today>firstDay||!started||hour>=new Date(Date.parse(started)+9*3600000).getUTCHours();return {hour,available,views:available?n(r[4].find(x=>n(x.hour)===hour)?.views):null};}),topPages:r[5].map(x=>({path:x.path,title:titleMap.get(x.path)||x.path,views:n(x.views)})),devices:r[6].map(x=>({device:x.device,views:n(x.views),sessions:n(x.sessions)})),referrers:r[7].map(x=>({host:x.host,views:n(x.views),sessions:n(x.sessions)})),recent:r[8].map(x=>({at:new Date(n(x.at)*1000).toISOString(),path:x.path,title:titleMap.get(x.path)||x.path,device:x.device,referrer:x.referrer,sessionLabel:'익명-'+String(x.label).toUpperCase()})),content:r[11][0]||{},inquiries:{total:Object.values(byStatus).reduce((s,v)=>s+v,0),...byStatus,period:periodInquiries,byType:r[13].map(x=>({type:x.type,count:n(x.count)}))},recentInquiries:r[15],methodology:{session:'동일 브라우저 탭 기준의 일별 익명 세션이며 고유 인원이 아닙니다.',active:'최근 5분 안에 활동 신호가 확인된 익명 세션',adminExcluded:true,history:'적용 이후부터 집계',retention:'접속 상세 14일·5000건, 익명 세션 7일, 일별 집계 60일 기준으로 매일 정리',referrer:'직접 방문에는 출처를 확인할 수 없는 접속이 포함됩니다.'}};
}
export async function cleanupAnalytics(env){
 const cutoff=shift(dayKST(Date.now()),-60);await env.DB.batch([
 env.DB.prepare('DELETE FROM analytics_events WHERE at<unixepoch()-14*86400'),
 env.DB.prepare('DELETE FROM analytics_events WHERE id IN (SELECT id FROM analytics_events ORDER BY at DESC LIMIT -1 OFFSET 5000)'),
 env.DB.prepare('DELETE FROM analytics_sessions WHERE last_seen<unixepoch()-7*86400'),
 ...['analytics_daily','analytics_page_daily','analytics_hourly','analytics_devices_daily','analytics_referrers_daily'].map(t=>env.DB.prepare('DELETE FROM '+t+' WHERE day<?').bind(cutoff))
 ]);
}
export const analyticsClientScript=String.raw`
(function(){
 if(navigator.globalPrivacyControl||navigator.doNotTrack==='1'||window.doNotTrack==='1')return;
 if(!window.crypto||!crypto.randomUUID)return;
 var session,source;try{session=sessionStorage.getItem('esg_stats_tab');if(!session){session=crypto.randomUUID();sessionStorage.setItem('esg_stats_tab',session);}source=sessionStorage.getItem('esg_stats_source');if(source===null){try{var ref=new URL(document.referrer);source=ref.hostname===location.hostname?'직접 방문':ref.hostname;}catch(e){source='직접 방문';}sessionStorage.setItem('esg_stats_source',source);}}catch(e){return;}
 var ua=navigator.userAgent||'',device=/ipad|tablet/i.test(ua)||/android/i.test(ua)&&!/mobile/i.test(ua)?'tablet':/mobile|iphone|ipod/i.test(ua)?'mobile':'desktop';
 var approved=false,started=false,timer=0,lastActivity=Date.now();
 ['pointerdown','keydown','scroll'].forEach(function(type){document.addEventListener(type,function(){lastActivity=Date.now();},{passive:true});});
 function send(type){if(!approved||document.visibilityState!=='visible'||type==='heartbeat'&&Date.now()-lastActivity>60000)return;var data={type:type,session:session,path:location.pathname,device:device,referrer:source};if(type==='view')data.id=crypto.randomUUID();fetch('/api/analytics',{method:'POST',credentials:'same-origin',cache:'no-store',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).catch(function(){});}
 function start(){if(!approved||started||document.visibilityState!=='visible')return;started=true;send('view');timer=setInterval(function(){send('heartbeat');},60000);}
 fetch('/api/admin/session',{credentials:'same-origin',cache:'no-store'}).then(function(r){return r.ok?r.json():null;}).then(function(s){if(!s||s.authenticated)return;approved=true;start();}).catch(function(){});
 document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){lastActivity=Date.now();if(!started)start();else send('heartbeat');}});
 window.addEventListener('pageshow',function(e){if(e.persisted&&approved){lastActivity=Date.now();send('view');if(!timer)timer=setInterval(function(){send('heartbeat');},60000);}});
 window.addEventListener('pagehide',function(){clearInterval(timer);timer=0;});
})();
`;
export const analyticsPrivacyHTML='<section class="content-block"><h2>접속 통계 안내</h2><p>홈페이지 개선을 위해 페이지 주소, 접속 시각, 기기 유형, 유입 사이트 도메인과 브라우저 탭 단위 익명 세션을 집계합니다. 전체 IP 주소, 실명, 정확한 위치, 전체 브라우저 정보, 검색어·주소의 추가 매개변수는 접속 통계에 저장하지 않습니다.</p><p>광고 추적 쿠키와 외부 분석 서비스는 사용하지 않습니다. 같은 탭을 구분하는 임의 값은 sessionStorage에 보관하며, 서버에는 일별로 바뀌는 익명 값만 저장합니다. 고유 인원 수가 아니라 방문 세션의 추정치입니다. 로그인한 관리자와 일부 자동화 접속은 제외하고, 브라우저의 DNT·GPC 신호를 존중합니다.</p><p>접속 상세는 14일·5000건, 익명 세션은 7일, 일별 집계는 60일을 기준으로 매일 정리합니다. 정리 시점까지 최대 하루의 여유가 있을 수 있습니다. 관리자에게만 통계를 제공하며 개인정보 관련 문의는 <a href="/contact">홈페이지 문의 창구</a>로 보내실 수 있습니다.</p></section>';
