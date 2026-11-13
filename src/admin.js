// ESG정원정책포럼 관리자 화면 (로그인 + 대시보드)
// - 모든 데이터는 같은 출처의 REST API(/api/admin/*)에서 불러온다.
// - 비밀번호·토큰 등 인증 정보는 이 파일에 들어 있지 않다.
// - 사용: import { adminPage } from './admin.js'; new Response(adminPage({ nonce }), { headers: { 'content-type': 'text/html; charset=utf-8' } })
//   nonce는 선택값(CSP script-src/style-src 'nonce-...'을 쓸 때만 전달).

const CATEGORIES = [
  ['notice', '공지사항'],
  ['archive', '자료실'],
  ['news', '뉴스·소식'],
  ['event', '행사'],
  ['forumgallery', '포럼 갤러리'],
  ['mediaroom', '미디어룸'],
  ['finance', '재정 공개'],
];

function escHtml(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const CAT_OPTIONS = CATEGORIES.map(([v, l]) => '<option value="' + escHtml(v) + '">' + escHtml(l) + '</option>').join('');

const CSS = `
:root{--g950:#0b2e22;--g900:#0f3d2e;--g800:#155239;--g700:#1d6b4f;--g600:#23805d;--g500:#2f9e6f;--g200:#cfe9db;--g100:#e8f5ee;--g50:#f3faf6;
--bg:#f4f7f5;--card:#fff;--line:#e2e9e5;--line2:#eef3f0;--text:#17261f;--sub:#5b6b63;--muted:#87958e;--red:#c0392b;--red-bg:#fdecea;--amber:#a86a00;--amber-bg:#fff4dc;--blue:#2457a6;--blue-bg:#e8effb;
--r:14px;--r-sm:10px;--shadow:0 1px 2px rgba(15,61,46,.05),0 6px 24px rgba(15,61,46,.06)}
*{box-sizing:border-box}
[hidden]{display:none!important}
html,body{margin:0;padding:0}
body{font-family:Pretendard,"Pretendard Variable","Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased;word-break:keep-all}
a{color:var(--g700)}
button,input,select,textarea{font:inherit;color:inherit}
h1,h2,h3,h4{margin:0;letter-spacing:-.02em}
.muted{color:var(--sub)}.sm{font-size:13px}
code{font-family:ui-monospace,Consolas,"D2Coding",monospace;font-size:13px;background:var(--g50);border:1px solid var(--line);border-radius:6px;padding:2px 7px;color:var(--g800)}
/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:40px;padding:0 16px;border-radius:10px;border:1px solid var(--line);background:#fff;color:var(--text);font-weight:600;font-size:14px;cursor:pointer;text-decoration:none;white-space:nowrap;transition:background .15s,border-color .15s,box-shadow .15s}
.btn:hover{border-color:var(--g200);background:var(--g50)}
.btn:focus-visible,.item:focus-visible,.stat:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid rgba(47,158,111,.35);outline-offset:1px}
.btn.primary{background:var(--g700);border-color:var(--g700);color:#fff}
.btn.primary:hover{background:var(--g800);border-color:var(--g800)}
.btn.danger{color:var(--red);border-color:#f1c9c4;background:#fff}
.btn.danger:hover{background:var(--red-bg)}
.btn.ghost{background:transparent}
.btn.sm{min-height:32px;padding:0 11px;font-size:13px;border-radius:8px}
.btn.block{width:100%}
.btn[disabled]{opacity:.55;cursor:progress}
/* alerts */
.alert{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:100;width:min(680px,calc(100% - 24px));display:flex;gap:12px;align-items:flex-start;padding:13px 14px 13px 18px;border-radius:12px;background:var(--red-bg);color:#8a2219;border:1px solid #f3c7c1;box-shadow:var(--shadow);font-weight:600}
.alert span{flex:1;white-space:pre-line}
.alert-x{border:0;background:transparent;font-size:20px;line-height:1;cursor:pointer;color:inherit;padding:0 4px}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:100;background:var(--g900);color:#fff;padding:12px 20px;border-radius:999px;box-shadow:var(--shadow);font-weight:600;font-size:14px;max-width:calc(100% - 24px)}
/* boot */
.boot{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:var(--sub)}
.spinner{width:34px;height:34px;border-radius:50%;border:3px solid var(--g100);border-top-color:var(--g600);animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
/* login */
.login{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(1200px 600px at 10% -10%,#d9efe3 0,transparent 60%),radial-gradient(900px 500px at 110% 110%,#dcefe4 0,transparent 55%),var(--bg)}
.login-card{width:100%;max-width:400px;background:#fff;border:1px solid var(--line);border-radius:20px;box-shadow:0 20px 60px rgba(15,61,46,.12);padding:36px 32px 28px;display:flex;flex-direction:column;gap:12px}
.brand-mark{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,var(--g600),var(--g900));color:#fff;font-weight:800;font-size:15px;display:flex;align-items:center;justify-content:center;letter-spacing:.02em}
.login-card h1{font-size:22px;line-height:1.35;margin-top:6px}
.login-card h1 span{display:block;font-size:15px;color:var(--g700);font-weight:700;margin-top:2px}
.login-card label{font-weight:700;font-size:14px;margin-top:6px}
.login-card .link{text-align:center;font-size:13px;color:var(--sub);text-decoration:none;margin-top:4px}
.form-msg{margin:0;padding:10px 12px;border-radius:10px;background:var(--red-bg);color:#8a2219;font-size:14px;font-weight:600}
.form-msg.info{background:var(--g100);color:var(--g800)}
/* app shell */
.app{min-height:100vh;display:grid;grid-template-columns:240px 1fr;grid-template-rows:auto 1fr;grid-template-areas:"top top" "nav main"}
.topbar{grid-area:top;position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 24px;background:rgba(255,255,255,.92);backdrop-filter:saturate(1.4) blur(10px);border-bottom:1px solid var(--line)}
.brand{display:flex;align-items:center;gap:12px;min-width:0}
.brand .brand-mark{width:38px;height:38px;border-radius:11px;font-size:12px;flex:none}
.brand strong{display:block;font-size:16px;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.brand small{display:block;color:var(--sub);font-size:12px}
.top-actions{display:flex;gap:8px;flex:none}
.sidenav{grid-area:nav;padding:20px 14px;border-right:1px solid var(--line);background:#fbfdfc;display:flex;flex-direction:column;gap:4px;position:sticky;top:63px;height:calc(100vh - 63px);overflow:auto}
.nav-btn{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:0;background:transparent;padding:11px 14px;border-radius:10px;font-weight:600;color:var(--sub);cursor:pointer;font-size:15px}
.nav-btn:hover{background:var(--g50);color:var(--g800)}
.nav-btn.active{background:var(--g100);color:var(--g900)}
.nav-ico{width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.45;flex:none}
.nav-btn.active .nav-ico{opacity:1;background:var(--g600)}
.nbadge{margin-left:auto;min-width:22px;height:22px;padding:0 7px;border-radius:999px;background:var(--g600);color:#fff;font-size:12px;display:inline-flex;align-items:center;justify-content:center}
.content{grid-area:main;padding:28px 32px 60px;min-width:0;max-width:1400px;width:100%}
.view{display:flex;flex-direction:column;gap:18px}
.vhead{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap}
.vhead h2{font-size:24px}
.vhead p{margin:4px 0 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--shadow);padding:20px;min-width:0}
.card h3{font-size:17px}
.card h4{font-size:14px;color:var(--sub);margin:4px 0 8px}
.card-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.card-h h3{margin-right:auto}
/* stats */
.stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
.stat{display:flex;flex-direction:column;gap:6px;text-align:left;background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:18px 18px 16px;box-shadow:var(--shadow);cursor:pointer;transition:transform .15s,border-color .15s}
.stat:hover{transform:translateY(-2px);border-color:var(--g200)}
.stat-label{font-size:13px;color:var(--sub);font-weight:600}
.stat strong{font-size:30px;font-weight:800;letter-spacing:-.03em;color:var(--g900);line-height:1.1}
.stat.hl{background:linear-gradient(140deg,var(--g700),var(--g900));border-color:var(--g800)}
.stat.hl .stat-label{color:#cfe9db}.stat.hl strong{color:#fff}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.quick{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
.note{font-size:13px;color:var(--sub);margin:8px 0 0}
/* lists */
.split{display:grid;grid-template-columns:minmax(280px,380px) minmax(0,1fr);gap:18px;align-items:start}
.listcard{display:flex;flex-direction:column;gap:10px;position:sticky;top:84px}
.filters{display:flex;flex-wrap:wrap;gap:8px}
.filters select,.filters input{flex:1 1 120px;min-width:0}
.count{margin:0;font-size:13px;color:var(--muted)}
.list{display:flex;flex-direction:column;gap:6px}
.list.scroll{max-height:calc(100vh - 290px);min-height:160px;overflow:auto;padding-right:2px}
.item{display:flex;flex-direction:column;gap:6px;width:100%;text-align:left;border:1px solid var(--line2);background:#fff;border-radius:var(--r-sm);padding:12px 14px;cursor:pointer;transition:border-color .15s,background .15s}
.item:hover{border-color:var(--g200);background:var(--g50)}
.item.sel{border-color:var(--g500);background:var(--g50);box-shadow:inset 3px 0 0 var(--g600)}
.item-top{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.item-date{margin-left:auto;font-size:12px;color:var(--muted)}
.item-title{font-weight:700;font-size:14.5px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.item-sub{font-size:13px;color:var(--sub);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.chip{display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:999px;background:var(--g100);color:var(--g800);font-size:12px;font-weight:700}
.badge{display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:999px;font-size:12px;font-weight:700;background:#eef1ef;color:var(--sub)}
.badge.ok{background:#e3f4ea;color:#17784f}
.badge.draft{background:#eef1ef;color:#66736c}
.badge.warn{background:var(--amber-bg);color:var(--amber)}
.badge.new{background:var(--red-bg);color:var(--red)}
.badge.reviewing{background:var(--blue-bg);color:var(--blue)}
.badge.done{background:#e3f4ea;color:#17784f}
.empty{color:var(--muted);text-align:center;padding:36px 12px;margin:0;font-size:14px}
/* forms */
.field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;min-width:0}
.field label,.label-row>label:first-child{font-weight:700;font-size:14px}
.field em{color:var(--red);font-style:normal}
.label-row{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.row2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
input[type=text],input[type=password],input[type=search],input[type=date],input:not([type]),select,textarea{width:100%;min-height:42px;border:1px solid #d5dfd9;border-radius:10px;background:#fff;padding:9px 12px;font-size:15px;transition:border-color .15s}
input:focus,select:focus,textarea:focus{border-color:var(--g500)}
textarea{min-height:240px;resize:vertical;line-height:1.65}
textarea.code{font-family:ui-monospace,Consolas,"D2Coding",monospace;font-size:13.5px}
input[type=file]{font-size:14px;max-width:100%}
.switch,.check{display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:14px;cursor:pointer;flex-wrap:wrap}
.switch input,.check input{width:18px;height:18px;accent-color:var(--g600);margin:0}
.switch{background:var(--g50);border:1px solid var(--line);padding:5px 12px;border-radius:999px;color:var(--g800)}
.hint{font-size:13px;color:var(--muted);margin:0}
.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;padding-top:16px;border-top:1px solid var(--line2)}
.actions .danger{margin-left:auto}
.mini-link{font-size:13px;font-weight:600}
.mini-thumb{max-width:160px;max-height:100px;border-radius:8px;border:1px solid var(--line);object-fit:cover;background:var(--g50)}
.preview{margin-top:16px;display:flex;flex-direction:column;gap:8px}
.preview iframe{width:100%;height:480px;border:1px solid var(--line);border-radius:12px;background:#fff}
.warn-box{border:1px solid #f0dcae;background:var(--amber-bg);color:#6e4a00;border-radius:12px;padding:12px 16px;font-size:14px}
.warn-box strong{display:block;margin-bottom:2px}
.warn-box p{margin:0}
.pii-note{border:1px solid var(--g200);background:var(--g50);color:var(--g800);border-radius:12px;padding:11px 16px;font-size:14px}
/* inquiry detail */
.dl{display:grid;grid-template-columns:110px minmax(0,1fr);gap:10px 16px;margin:0 0 16px}
.dl dt{color:var(--sub);font-size:13px;font-weight:700;padding-top:2px}
.dl dd{margin:0;overflow-wrap:anywhere}
.msg{white-space:pre-wrap;overflow-wrap:anywhere;background:var(--g50);border:1px solid var(--line2);border-radius:12px;padding:14px 16px;line-height:1.7;margin-bottom:16px}
.status-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.status-row select{width:auto;min-width:160px}
/* files */
.upl{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:14px 0 8px}
.files{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin-top:12px}
.fcard{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff;display:flex;flex-direction:column}
.fthumb{height:130px;background:var(--g50);display:flex;align-items:center;justify-content:center;border-bottom:1px solid var(--line2)}
.fthumb img{width:100%;height:100%;object-fit:cover}
.fext{font-weight:800;color:var(--g700);font-size:18px;letter-spacing:.04em;background:#fff;border:1px solid var(--g200);border-radius:10px;padding:10px 14px}
.fbody{padding:10px 12px 12px;display:flex;flex-direction:column;gap:4px;flex:1}
.fname{font-weight:700;font-size:14px;overflow-wrap:anywhere}
.fmeta{font-size:12px;color:var(--muted)}
.fbtns{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.thumbs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-bottom:6px}
.thumb{margin:0;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;display:flex;flex-direction:column}
.thumb img{width:100%;height:96px;object-fit:cover;background:var(--g50)}
.thumb figcaption{font-size:11px;color:var(--muted);padding:6px 8px 2px;overflow-wrap:anywhere}
.thumb .btn{margin:4px 8px 8px}
/* responsive */
@media (max-width:1100px){.stats{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:900px){
.app{grid-template-columns:1fr;grid-template-areas:"top" "nav" "main"}
.topbar{padding:10px 14px}
.sidenav{position:sticky;top:59px;z-index:15;height:auto;flex-direction:row;overflow-x:auto;padding:8px 10px;border-right:0;border-bottom:1px solid var(--line);background:rgba(251,253,252,.96);gap:4px;scrollbar-width:none}
.sidenav::-webkit-scrollbar{display:none}
.nav-btn{width:auto;flex:none;padding:8px 13px;font-size:14px}
.nav-ico{display:none}
.content{padding:18px 14px 50px}
.split,.grid2{grid-template-columns:1fr}
.listcard{position:static}
.list.scroll{max-height:420px}
.stats{grid-template-columns:repeat(2,minmax(0,1fr))}
.brand small{display:none}
}
@media (max-width:560px){
.row2{grid-template-columns:1fr}
.top-actions .btn{padding:0 11px}
.top-home{display:none!important}
.vhead h2{font-size:21px}
.card{padding:16px}
.stat strong{font-size:26px}
.dl{grid-template-columns:1fr;gap:2px}
.dl dd{margin-bottom:8px}
.actions .danger{margin-left:0}
.preview iframe{height:380px}
.login-card{padding:28px 22px 22px}
}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
/* Premium light administration: shared controls and responsive shell */
:root{--bg:#f7f7f2;--card:#fff;--line:#e5e7df;--line2:#eff0eb;--text:#252d27;--sub:#626c63;--muted:#768076;--g950:#153b2c;--g900:#194833;--g700:#296347;--g100:#ecf3eb;--g50:#f6f8f2;--r:20px;--r-sm:12px;--shadow:0 3px 18px rgba(35,53,38,.025)}
body{font-size:16px;line-height:1.65}.btn{min-height:44px;font-size:16px;border-radius:12px}.btn.sm{min-height:36px;font-size:14px}.card h3{font-size:18px}.card h4{font-size:16px}.field label,.label-row>label:first-child{font-size:16px}input[type=text],input[type=password],input[type=search],input[type=date],input:not([type]),select,textarea{font-size:16px;min-height:46px}.item-title{font-size:16px}.item-sub,.note,.pii-note,.warn-box{font-size:15px}.hint,.sm,.count{font-size:14px}.item-date{font-size:13px}.card{padding:24px}.item{padding:15px 16px}.actions{gap:10px}.login{background:radial-gradient(ellipse at 15% 0,#e7eddf,transparent 65%),var(--bg)}.login-card{max-width:450px;border-radius:24px;padding:38px}.login-card h1{font-size:26px}.login-logo{width:190px;height:auto;max-height:70px;object-fit:contain;object-position:left}.login-card label{font-size:16px}.login-card .link{font-size:14px}
.app{grid-template-columns:252px minmax(0,1fr);grid-template-rows:88px 1fr}.topbar{height:88px;padding:16px 32px;background:rgba(255,255,255,.97);backdrop-filter:blur(12px)}.brand{width:196px;flex:none}.brand img{width:190px;max-height:62px;object-fit:contain;object-position:left}.topbar-center{margin-right:auto;border-left:1px solid var(--line);padding-left:26px;color:var(--sub);font-size:14px}.topbar-center strong{display:block;color:var(--text);font-size:16px}.updated-time{font-size:13px;color:var(--sub);white-space:nowrap}.top-actions{align-items:center;gap:10px}.sidenav{top:88px;height:calc(100vh - 88px);padding:28px 18px;background:#fff;gap:7px}.nav-caption{padding:0 15px 15px;color:var(--muted);font-size:12px;font-weight:700;letter-spacing:.16em}.nav-btn{min-height:50px;padding:12px 16px;font-size:16px;font-weight:600;border-radius:12px}.nav-btn.active{background:var(--g100);box-shadow:inset 3px 0 0 var(--g700)}.nav-ico{width:7px;height:7px}.nav-footer{margin-top:auto;padding:28px 15px 6px;font-size:13px;color:var(--muted)}.content{max-width:1680px;padding:30px 36px 70px}.shell-breadcrumb{color:var(--muted);font-size:14px;margin:0 0 18px}.shell-breadcrumb span{color:var(--g900);margin-left:10px}.vhead h2{font-size:30px;letter-spacing:-.04em}.vhead p{font-size:16px}.view{gap:22px}.split{grid-template-columns:minmax(300px,390px) minmax(0,1fr)}.listcard{top:108px}.stat{padding:22px}.stat-label{font-size:15px}.stat strong{font-size:34px}
.dashboard-intro{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;flex-wrap:wrap}.eyebrow{font-size:12px;font-weight:700;color:var(--g700);letter-spacing:.16em;margin:0 0 5px}.dash-controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.dash-controls select{width:auto;min-width:110px}.dash-controls .switch{font-size:13px;min-height:44px;background:#fff}.live-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#79a378;margin-right:5px}.dashboard-status{font-size:14px;color:var(--sub);margin:0;min-height:22px}.analytics-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.metric{padding:24px;display:flex;flex-direction:column;min-height:170px;position:relative;overflow:hidden}.metric-label{font-size:16px;color:var(--sub);font-weight:600}.metric strong{font-size:42px;font-weight:650;line-height:1.15;letter-spacing:-.045em;color:var(--g900);margin:15px 0 10px;font-variant-numeric:tabular-nums}.metric small{font-size:13px;color:var(--sub)}.metric.featured{background:var(--g900);border-color:var(--g900)}.metric.featured strong,.metric.featured .metric-label{color:#fff}.metric.featured small{color:#d0dfd0}.metric.featured:after{content:'';width:120px;height:120px;border:26px solid #ffffff08;position:absolute;right:-35px;bottom:-40px;border-radius:50%;pointer-events:none}.dash-main-grid{display:grid;grid-template-columns:minmax(0,1.9fr) minmax(280px,1fr);gap:20px}.dash-equal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.card-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;flex-wrap:wrap}.card-header p{margin:3px 0 0;color:var(--sub);font-size:13px}.chart-legend{display:flex;gap:16px;font-size:13px;color:var(--sub)}.chart-legend i{display:inline-block;width:18px;height:3px;vertical-align:middle;margin-right:6px;background:var(--g700)}.chart-legend .sessions{background:#9cae76}.chart-wrap{min-height:265px}.linechart{display:block;width:100%;height:auto;overflow:visible}.linechart text{font:12px Pretendard,'Malgun Gothic',sans-serif;fill:#758073}.chart-point{outline:none}.chart-point:focus{stroke:#182d21;stroke-width:3}.chart-summary{font-size:14px;color:var(--sub);margin:4px 0 12px}.chart-summary strong{font-size:18px;color:var(--g900);font-weight:650}.chart-data{font-size:13px;color:var(--sub);margin-top:8px}.chart-data summary{cursor:pointer}.chart-data table{border-collapse:collapse;width:100%;font-size:13px;margin-top:10px}.chart-data th,.chart-data td{padding:6px 9px;border-bottom:1px solid var(--line2);text-align:right}.chart-data th:first-child,.chart-data td:first-child{text-align:left}.chart-data-scroll{max-height:230px;overflow:auto}.data-empty{border:1px dashed var(--line);border-radius:12px;padding:26px 16px;text-align:center;color:var(--sub);font-size:14px;margin:10px 0}.rank-list{display:flex;flex-direction:column;gap:18px}.rank-row{min-width:0}.rank-caption{display:flex;justify-content:space-between;gap:14px;font-size:14px;margin-bottom:7px}.rank-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.rank-name small{display:block;font-size:12px;color:var(--muted);overflow:hidden;text-overflow:ellipsis}.rank-caption strong{font-variant-numeric:tabular-nums;color:var(--g900);white-space:nowrap}.rank-track{height:7px;border-radius:4px;background:#f0f2ea;overflow:hidden}.rank-fill{height:100%;border-radius:4px;background:#77977a}.rank-row:first-child .rank-fill{background:var(--g700)}.device-layout{display:flex;gap:28px;align-items:center;justify-content:center;min-height:210px}.donut{width:170px;height:170px;flex:none;position:relative;border-radius:50%;display:grid;place-items:center}.donut:before{content:'';position:absolute;inset:20px;background:#fff;border-radius:50%}.donut-center{position:relative;text-align:center;color:var(--g900);font-size:27px;font-weight:650;line-height:1.4}.donut-center small{display:block;font-size:12px;color:var(--sub);font-weight:400}.device-key{display:flex;flex-direction:column;gap:14px;min-width:130px;font-size:14px}.device-key-row{display:flex;justify-content:space-between;gap:20px}.device-key-row i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:7px}.access-table-wrap{overflow:auto}.access-table{width:100%;border-collapse:collapse;font-size:14px;white-space:nowrap}.access-table th{text-align:left;color:var(--sub);font-size:12px;font-weight:600;padding:0 14px 12px;border-bottom:1px solid var(--line)}.access-table td{padding:14px;border-bottom:1px solid var(--line2);max-width:270px;text-overflow:ellipsis;overflow:hidden}.access-table th:first-child,.access-table td:first-child{padding-left:0}.access-table small{display:block;color:var(--muted);font-size:12px;overflow:hidden;text-overflow:ellipsis}.session-label{font-family:ui-monospace,monospace;color:var(--sub);font-size:12px}.funnel{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0 22px}.funnel button{border:1px solid var(--line);background:var(--g50);border-radius:12px;padding:16px;text-align:left;cursor:pointer}.funnel button:nth-child(2){background:#f4f4ec}.funnel button:nth-child(3){background:#f5f6f3}.funnel span{display:block;color:var(--sub);font-size:14px}.funnel strong{display:block;font-size:28px;color:var(--g900);font-weight:650;margin-top:6px}.content-summary{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}.content-summary .stat{box-shadow:none;padding:18px;gap:10px}.content-summary .stat strong{font-size:28px}.content-summary .stat-label{font-size:14px}.content-summary small{font-size:12px;color:var(--sub)}.methodology{background:#eef2e8;border:1px solid #e3e9dc;border-radius:16px;padding:18px 22px;font-size:13px;color:var(--sub);line-height:1.85}.methodology strong{color:var(--g900)}.methodology p{margin:3px 0}.private-label{font-size:12px;color:var(--g700);background:var(--g100);border-radius:6px;padding:3px 8px}.quick{gap:10px}.recent-inq-note{font-size:13px;color:var(--sub);margin:0 0 12px}
@media(min-width:1600px){.content{padding-left:44px;padding-right:44px}.metric{min-height:185px}}
@media(max-width:1200px){.app{grid-template-columns:224px minmax(0,1fr)}.content{padding:26px 24px 60px}.topbar{padding:16px 24px}.metric{padding:20px}.metric strong{font-size:36px}.dash-main-grid{grid-template-columns:minmax(0,1.6fr) minmax(240px,1fr)}.topbar-center{display:none}.content-summary{grid-template-columns:repeat(3,minmax(0,1fr))}.updated-time{display:none}.device-layout{gap:18px}.donut{width:145px;height:145px}}
@media(max-width:1000px){.dash-main-grid,.dash-equal-grid{grid-template-columns:1fr}.analytics-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.split{grid-template-columns:1fr}.listcard{position:static}.device-layout{justify-content:flex-start}.topbar .brand{width:auto}}
@media(max-width:900px){.app{grid-template-columns:1fr;grid-template-rows:78px auto 1fr;grid-template-areas:'top' 'nav' 'main'}.topbar{height:78px;padding:12px 16px}.brand img{width:170px;max-height:55px}.sidenav{top:78px;height:auto;flex-direction:row;padding:9px 12px;background:#fff;gap:5px;border-right:0;border-bottom:1px solid var(--line)}.nav-btn{width:auto;flex:none;min-height:42px;padding:9px 15px;font-size:15px}.nav-caption,.nav-footer{display:none}.nav-btn.active{box-shadow:inset 0 -2px 0 var(--g700)}.content{padding:22px 18px 50px}.shell-breadcrumb{margin-bottom:15px}.card{padding:22px}.vhead h2{font-size:27px}.list.scroll{max-height:420px}}
@media(max-width:560px){.topbar{gap:8px}.brand img{width:150px}.top-actions{gap:5px}.top-actions .btn{min-height:38px;font-size:13px;padding:0 10px}.top-home{display:none!important}.content{padding:20px 12px 44px}.view{gap:16px}.card{padding:18px;border-radius:16px}.dashboard-intro{align-items:flex-start}.dash-controls{gap:7px;width:100%}.dash-controls .btn,.dash-controls select{font-size:14px;min-height:42px}.dash-controls .switch{font-size:12px;padding:5px 8px}.dash-controls .csv-btn{display:none}.analytics-kpis{gap:10px}.metric{padding:18px 16px;min-height:158px}.metric-label{font-size:14px}.metric strong{font-size:34px;margin:12px 0 8px}.metric small{font-size:12px}.card-header{margin-bottom:14px}.chart-wrap{min-height:190px}.linechart text{font-size:13px}.content-summary{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.content-summary .stat{padding:15px}.funnel{gap:7px}.funnel button{padding:13px 10px}.funnel span{font-size:12px}.funnel strong{font-size:25px}.methodology{padding:16px}.device-layout{justify-content:center}.vhead h2{font-size:26px}.login-card{padding:30px 24px}.row2{grid-template-columns:1fr}.dl{grid-template-columns:1fr}.actions .danger{margin-left:0}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important;animation:none!important}}

`;

const BODY = `
<div id="alert" class="alert" role="alert" hidden><span id="alertMsg"></span><button type="button" id="alertClose" class="alert-x" aria-label="알림 닫기">&times;</button></div>
<div id="toast" class="toast" role="status" aria-live="polite" hidden></div>

<div id="boot" class="boot"><div class="spinner" aria-hidden="true"></div><p>관리자 화면을 불러오는 중입니다…</p></div>

<main id="login" class="login" hidden>
  <form id="loginForm" class="login-card" method="post" action="#" novalidate>
    <img class="login-logo" src="/assets/8d2ffcf55fb09.png" alt="ESG정원정책포럼">
    <h1>ESG정원정책포럼<span>관리자 로그인</span></h1>
    <p class="muted sm" style="margin:0">홈페이지 관리를 위해 관리자 비밀번호를 입력해 주세요.</p>
    <label for="loginPw">비밀번호</label>
    <input id="loginPw" name="password" type="password" autocomplete="current-password" required autocapitalize="off" spellcheck="false">
    <p id="loginMsg" class="form-msg" role="alert" hidden></p>
    <button id="loginBtn" class="btn primary block" type="submit">로그인</button>
    <a class="link" href="/">&larr; 홈페이지로 돌아가기</a>
  </form>
</main>

<div id="app" class="app" hidden>
  <header class="topbar">
    <a class="brand" href="/" target="_blank" rel="noopener" aria-label="ESG정원정책포럼 홈페이지"><img src="/assets/8d2ffcf55fb09.png" alt="ESG정원정책포럼"></a><div class="topbar-center"><strong>홈페이지 관리</strong>ESG GARDEN POLICY FORUM</div>
    <div class="top-actions"><time id="headerUpdated" class="updated-time">업데이트 대기 · KST</time>
      <a class="btn ghost top-home" href="/" target="_blank" rel="noopener">홈페이지 보기</a>
      <button id="logoutBtn" class="btn" type="button">로그아웃</button>
    </div>
  </header>

  <nav class="sidenav" aria-label="관리 메뉴"><div class="nav-caption">WORKSPACE</div>
    <button type="button" class="nav-btn" data-view="dashboard"><span class="nav-ico"></span>대시보드</button>
    <button type="button" class="nav-btn" data-view="posts"><span class="nav-ico"></span>게시물</button>
    <button type="button" class="nav-btn" data-view="pages"><span class="nav-ico"></span>페이지</button>
    <button type="button" class="nav-btn" data-view="inquiries"><span class="nav-ico"></span>문의<span id="navBadge" class="nbadge" hidden></span></button>
    <button type="button" class="nav-btn" data-view="files"><span class="nav-ico"></span>파일</button>
    <button type="button" class="nav-btn" data-view="settings"><span class="nav-ico"></span>설정·백업</button>
    <div class="nav-footer">지속가능한 정원의 가치<br>ESG정원정책포럼</div>
  </nav>

  <main class="content"><div class="shell-breadcrumb" aria-label="현재 위치">관리자 홈 <span aria-hidden="true">/</span><span id="currentSection">대시보드</span></div>
    <!-- 대시보드 -->
    <section id="view-dashboard" class="view" aria-labelledby="h-dash">
      <div class="dashboard-intro"><div class="vhead"><div><p class="eyebrow">OVERVIEW</p><h2 id="h-dash">대시보드</h2><p class="muted">방문 흐름과 운영 현황, 한곳에서 살펴보세요.</p></div></div><div class="dash-controls"><label class="sr-only" for="analyticsDays">분석 기간</label><select id="analyticsDays"><option value="7">최근 7일</option><option value="30" selected>최근 30일</option><option value="60">최근 60일</option></select><button id="analyticsRefresh" class="btn" type="button" data-refresh="dashboard">새로고침</button><label class="switch"><input id="analyticsAuto" type="checkbox"> 60초 자동 갱신</label><button id="analyticsCsv" class="btn csv-btn" type="button" disabled>CSV 저장</button></div></div>
      <p id="analyticsStatus" class="dashboard-status" role="status" aria-live="polite">실제 수집 데이터를 불러옵니다.</p>
      <div class="analytics-kpis">
        <div class="card metric featured"><span class="metric-label">오늘 페이지 조회</span><strong id="an-todayViews">0</strong><small id="an-compare">집계 대기</small></div>
        <div class="card metric"><span class="metric-label">오늘 방문 세션</span><strong id="an-todaySessions">0</strong><small>익명 탭 세션 · 고유 인원 아님</small></div>
        <div class="card metric"><span class="metric-label"><span class="live-dot" aria-hidden="true"></span>최근 5분 활동 세션</span><strong id="an-activeNow">0</strong><small>최근 5분 내 활동 신호 기준</small></div>
        <div class="card metric"><span class="metric-label">선택 기간 접수 문의</span><strong id="an-periodInquiries">0</strong><small id="an-periodLabel">최근 30일</small></div>
      </div>
      <div class="dash-main-grid">
        <article class="card"><div class="card-header"><div><h3>일별 방문 흐름</h3><p id="an-range">집계 기간 확인 중</p></div><div class="chart-legend"><span><i></i>페이지 조회</span><span><i class="sessions"></i>방문 세션</span></div></div><p id="an-summary" class="chart-summary"></p><div id="dailyChart" class="chart-wrap"></div></article>
        <article class="card"><div class="card-header"><div><h3>오늘 시간대별 조회</h3><p>00시부터 23시까지 · 한국시간</p></div></div><div id="hourlyChart" class="chart-wrap"></div></article>
      </div>
      <div class="dash-main-grid">
        <article class="card"><div class="card-header"><div><h3>많이 찾는 페이지</h3><p>선택 기간의 페이지 조회 순위</p></div><span class="muted sm">상위 8개</span></div><div id="topPages" class="rank-list"></div></article>
        <article class="card"><div class="card-header"><div><h3>접속 기기</h3><p>선택 기간 · 페이지 조회 비중</p></div></div><div id="deviceChart"></div></article>
      </div>
      <div class="dash-main-grid">
        <article class="card"><div class="card-header"><div><h3>최근 접속</h3><p>최대 20건 · 익명 세션으로 표시합니다.</p></div><span class="muted sm">KST</span></div><div id="recentAccess" class="access-table-wrap"></div></article>
        <article class="card"><div class="card-header"><div><h3>방문 유입 경로</h3><p>도메인만 표시 · 선택 기간</p></div></div><div id="referrerList" class="rank-list"></div></article>
      </div>
      <div class="dash-equal-grid">
        <article class="card"><div class="card-header"><h3>문의 처리 현황</h3><span class="private-label">관리자 전용</span></div><p id="inquirySummary" class="muted sm"></p><div class="funnel"><button type="button" data-go="inquiries" data-status="new"><span>신규</span><strong id="funnel-new">0</strong></button><button type="button" data-go="inquiries" data-status="reviewing"><span>검토 중</span><strong id="funnel-reviewing">0</strong></button><button type="button" data-go="inquiries" data-status="done"><span>처리 완료</span><strong id="funnel-done">0</strong></button></div><h4>문의 유형별 접수</h4><div id="inquiryTypes" class="rank-list"></div></article>
        <article class="card"><div class="card-header"><h3>최근 문의</h3><button class="btn sm ghost" type="button" data-go="inquiries">전체 보기</button></div><p class="recent-inq-note">최근 5건 · 개인정보는 업무 목적으로만 열람해 주세요.</p><div id="recentInq" class="list"><p class="empty">불러오는 중입니다.</p></div></article>
      </div>
      <article class="card"><div class="card-header"><h3>콘텐츠 운영 현황</h3><span id="contentUpdated" class="muted sm"></span></div><div class="content-summary"><button type="button" class="stat" data-go="posts"><span class="stat-label">전체 게시물</span><strong id="st-posts">0</strong><small>공개 <span id="an-published">0</span> · 초안 <span id="an-drafts">0</span></small></button><button type="button" class="stat" data-go="pages"><span class="stat-label">고정 페이지</span><strong id="st-pages">0</strong><small>소개·안내 콘텐츠</small></button><button type="button" class="stat" data-go="inquiries"><span class="stat-label">전체 문의</span><strong id="st-inquiries">0</strong><small>누적 접수 기준</small></button><button type="button" class="stat" data-go="inquiries" data-status="new"><span class="stat-label">새 문의</span><strong id="st-new">0</strong><small>처리를 기다리는 문의</small></button><button type="button" class="stat" data-go="files"><span class="stat-label">업로드 파일</span><strong id="st-files">0</strong><small id="an-fileBytes">0 B</small></button></div><div class="quick"><button class="btn primary" type="button" data-action="new-post">새 게시물 작성</button><button class="btn" type="button" data-go="files">파일 업로드</button><button class="btn" type="button" data-go="pages">페이지 수정</button></div><p class="note">새 게시물은 기본으로 비공개 초안으로 저장됩니다. 내용을 확인한 뒤 공개 여부를 선택해 주세요.</p></article>
      <aside class="methodology"><strong>집계 기준 안내</strong><p id="collectionInfo">수집 시작 시점 확인 중 · Asia/Seoul (KST)</p><p>방문 세션은 익명 탭 세션 기준, 고유 인원 아님. 같은 브라우저 탭의 일별 세션을 집계하며, 활동 세션은 최근 5분 기준입니다.</p><p>관리자 접속은 제외합니다. 수집 적용 이후부터 집계하며, 과거 방문 데이터는 소급 생성하지 않습니다. 수집 전 자료는 0이 아닌 미수집으로 구분합니다. 방문 유입은 도메인만 표시하고 DNT·GPC 설정을 존중합니다.</p></aside>
    </section>

    <!-- 게시물 -->
    <section id="view-posts" class="view" aria-labelledby="h-posts" hidden>
      <div class="vhead"><div><h2 id="h-posts">게시물 관리</h2><p class="muted">공지사항·자료실·뉴스 등 게시판 글을 작성하고 공개 여부를 정합니다.</p></div><button class="btn primary" type="button" data-action="new-post">+ 새 게시물</button></div>
      <div class="split">
        <div class="card listcard">
          <div class="filters">
            <select id="pfCat" aria-label="분류로 거르기"><option value="">전체 분류</option>${CAT_OPTIONS}</select>
            <select id="pfStatus" aria-label="공개 상태로 거르기"><option value="">전체 상태</option><option value="pub">공개</option><option value="draft">비공개</option></select>
            <input id="pfQ" type="search" placeholder="제목·본문 검색" aria-label="게시물 검색">
          </div>
          <p id="postCount" class="count"></p>
          <div id="postList" class="list scroll"><p class="empty">불러오는 중…</p></div>
        </div>
        <form id="postForm" class="card editor" novalidate>
          <div class="card-h"><h3 id="peHeading">새 게시물</h3><span id="peId" class="muted sm"></span><span id="peDirty" class="badge warn" hidden>저장 안 됨</span></div>
          <div class="row2">
            <div class="field"><label for="peCat">분류 <em>*</em></label><select id="peCat" required><option value="">분류 선택</option>${CAT_OPTIONS}</select></div>
            <div class="field"><label for="peDate">게시일 <em>*</em></label><input id="peDate" type="date" required></div>
          </div>
          <div class="field"><label for="peTitle">제목 <em>*</em></label><input id="peTitle" type="text" maxlength="200" required autocomplete="off"></div>
          <div class="field">
            <div class="label-row"><label for="peBody">본문 <em>*</em></label><label class="switch"><input id="peHtml" type="checkbox"> HTML 편집</label></div>
            <textarea id="peBody" rows="14" required></textarea>
            <p id="peModeHint" class="hint"></p>
          </div>
          <div class="row2">
            <div class="field"><label for="peAtt">첨부파일 주소</label><input id="peAtt" type="text" list="fileUrls" inputmode="url" autocomplete="off" placeholder="/files/... 또는 https://..."><a id="peAttOpen" class="mini-link" target="_blank" rel="noopener noreferrer" hidden>첨부파일 열어 보기</a></div>
            <div class="field"><label for="peImg">대표 이미지 주소</label><input id="peImg" type="text" list="fileUrls" inputmode="url" autocomplete="off" placeholder="/files/... 또는 https://..."><img id="peImgThumb" class="mini-thumb" alt="대표 이미지 미리보기" hidden></div>
          </div>
          <p class="hint">'파일' 메뉴에서 올린 파일의 주소를 넣을 수 있습니다. 입력란을 누르면 올린 파일 주소가 제안됩니다.</p>
          <div style="margin-top:14px"><label class="check"><input id="pePub" type="checkbox"> 홈페이지에 공개 <span class="muted sm">(체크하지 않으면 비공개 초안으로 저장)</span></label></div>
          <div class="actions">
            <button id="peSave" class="btn primary" type="submit">저장</button>
            <button id="pePrevBtn" class="btn" type="button">미리보기</button>
            <button id="peDel" class="btn danger" type="button" hidden>삭제</button>
          </div>
          <div id="pePrevWrap" class="preview" hidden>
            <p class="hint">저장 전 입력 내용으로 만든 미리보기입니다. 실제 홈페이지에서는 서버가 안전하지 않은 코드를 정리한 뒤 보여 줍니다.</p>
            <iframe id="pePrev" sandbox="" title="게시물 본문 미리보기" referrerpolicy="no-referrer"></iframe>
          </div>
        </form>
      </div>
      <datalist id="fileUrls"></datalist>
    </section>

    <!-- 페이지 -->
    <section id="view-pages" class="view" aria-labelledby="h-pages" hidden>
      <div class="vhead"><div><h2 id="h-pages">페이지 관리</h2><p class="muted">포럼 소개·안내 등 고정 페이지의 제목과 내용을 수정합니다.</p></div><button class="btn" type="button" data-refresh="pages">새로고침</button></div>
      <div class="split">
        <div class="card listcard">
          <div class="filters"><input id="pgQ" type="search" placeholder="페이지 제목·주소 검색" aria-label="페이지 검색"></div>
          <div id="pageList" class="list scroll"><p class="empty">불러오는 중…</p></div>
        </div>
        <div class="card editor">
          <p id="pgEmpty" class="empty">왼쪽 목록에서 수정할 페이지를 선택해 주세요.</p>
          <form id="pgForm" novalidate hidden>
            <div class="card-h"><h3>페이지 수정</h3><code id="pgPath"></code><span id="pgDirty" class="badge warn" hidden>저장 안 됨</span></div>
            <div class="field"><label for="pgTitle">페이지 제목 <em>*</em></label><input id="pgTitle" type="text" maxlength="200" required autocomplete="off"></div>
            <div class="field"><label for="pgHtml">페이지 내용 (HTML)</label><textarea id="pgHtml" class="code" rows="20" spellcheck="false"></textarea>
              <p class="hint">저장하면 서버가 스크립트 등 위험한 코드를 자동으로 제거합니다. 이미지는 '파일' 메뉴에서 올린 뒤 주소를 넣어 주세요.</p></div>
            <div id="pgImgsWrap" hidden><h4>이 페이지의 이미지</h4><div id="pgImgs" class="thumbs"></div></div>
            <div class="actions">
              <button id="pgSave" class="btn primary" type="submit">저장</button>
              <button id="pgPrevBtn" class="btn" type="button">미리보기</button>
              <a id="pgOpen" class="btn ghost" href="/" target="_blank" rel="noopener">공개 페이지 열기</a>
            </div>
            <div id="pgPrevWrap" class="preview" hidden>
              <p class="hint">저장 전 내용 미리보기입니다(사이트 공통 디자인은 적용되지 않습니다).</p>
              <iframe id="pgPrev" sandbox="" title="페이지 미리보기" referrerpolicy="no-referrer"></iframe>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- 문의 -->
    <section id="view-inquiries" class="view" aria-labelledby="h-inq" hidden>
      <div class="vhead"><div><h2 id="h-inq">문의 관리</h2><p class="muted">홈페이지로 접수된 문의를 확인하고 처리 상태를 관리합니다.</p></div><button class="btn" type="button" data-refresh="inquiries">새로고침</button></div>
      <div class="pii-note">문의에는 이름·이메일 등 개인정보가 들어 있습니다. 업무 목적으로만 열람하고 외부에 공유하지 마세요. 처리가 끝나 보관할 필요가 없는 문의는 삭제해 주세요.</div>
      <div class="split">
        <div class="card listcard">
          <div class="filters">
            <select id="iqStatus" aria-label="처리 상태로 거르기"><option value="">전체 상태</option><option value="new">신규</option><option value="reviewing">검토 중</option><option value="done">처리 완료</option></select>
            <input id="iqQ" type="search" placeholder="이름·기관·제목 검색" aria-label="문의 검색">
          </div>
          <p id="inqCount" class="count"></p>
          <div id="inqList" class="list scroll"><p class="empty">불러오는 중…</p></div>
        </div>
        <div id="inqDetail" class="card"><p class="empty">왼쪽 목록에서 문의를 선택해 주세요.</p></div>
      </div>
    </section>

    <!-- 파일 -->
    <section id="view-files" class="view" aria-labelledby="h-files" hidden>
      <div class="vhead"><div><h2 id="h-files">파일 관리</h2><p class="muted">게시물·페이지에 쓸 이미지와 첨부파일을 올리고 주소를 복사합니다.</p></div><button class="btn" type="button" data-refresh="files">새로고침</button></div>
      <form id="upForm" class="card" novalidate>
        <div class="warn-box"><strong>업로드한 파일은 공개됩니다</strong><p>파일 주소만 알면 누구나 열어 볼 수 있습니다. 참가자 명단, 신청서, 연락처, 신분증 사본 등 개인정보가 담긴 파일은 절대 올리지 마세요. 파일 하나당 최대 8MB까지 올릴 수 있습니다.</p></div>
        <div class="upl">
          <input id="upFile" type="file" multiple aria-label="올릴 파일 선택">
          <label class="check"><input id="upAgree" type="checkbox"> 개인정보가 없는 공개용 파일임을 확인했습니다</label>
          <button id="upBtn" class="btn primary" type="submit">업로드</button>
        </div>
        <p id="upStatus" class="hint" aria-live="polite"></p>
      </form>
      <div class="card">
        <div class="filters"><input id="fiQ" type="search" placeholder="파일 이름 검색" aria-label="파일 검색"></div>
        <p id="fileCount" class="count" style="margin-top:10px"></p>
        <div id="fileList" class="files"></div>
      </div>
    </section>

    <!-- 설정 -->
    <section id="view-settings" class="view" aria-labelledby="h-set" hidden>
      <div class="vhead"><div><h2 id="h-set">설정·백업</h2><p class="muted">데이터 백업과 관리자 비밀번호를 관리합니다.</p></div></div>
      <div class="grid2">
        <div class="card">
          <h3>데이터 백업 내려받기</h3>
          <p class="muted sm">게시물·페이지·문의·파일 목록을 JSON 파일 하나로 내려받습니다.</p>
          <div class="warn-box"><strong>개인정보 주의</strong><p>백업 파일에는 문의자의 이름·이메일·기관 등 개인정보가 포함됩니다. 암호가 걸린 안전한 저장소에만 보관하고, 메일·메신저로 보내거나 공유 폴더에 두지 마세요.</p></div>
          <div class="actions" style="border-top:0;padding-top:0"><button id="expBtn" class="btn primary" type="button">백업 파일 내려받기</button></div>
        </div>
        <form id="pwForm" class="card" novalidate>
          <h3 style="margin-bottom:14px">관리자 비밀번호 변경</h3>
          <div class="field"><label for="pwCur">현재 비밀번호</label><input id="pwCur" type="password" autocomplete="current-password" required></div>
          <div class="field"><label for="pwNew">새 비밀번호 (12자 이상)</label><input id="pwNew" type="password" autocomplete="new-password" minlength="12" required></div>
          <div class="field"><label for="pwNew2">새 비밀번호 확인</label><input id="pwNew2" type="password" autocomplete="new-password" minlength="12" required></div>
          <p class="hint">다른 사이트와 다른, 추측하기 어려운 문장형 비밀번호를 권장합니다.</p>
          <div class="actions"><button id="pwBtn" class="btn primary" type="submit">비밀번호 변경</button></div>
        </form>
      </div>
    </section>
  </main>
</div>
`;

// 브라우저에서 실행되는 코드. String.raw 이므로 백슬래시가 그대로 전달된다.
// (주의: 이 안에서는 백틱과 달러-중괄호를 쓰지 않는다. 닫는 script 태그 문자열도 쓰지 않는다.)
const CLIENT = String.raw`
(function(){
'use strict';
var CATS=[['notice','공지사항'],['archive','자료실'],['news','뉴스·소식'],['event','행사'],['forumgallery','포럼 갤러리'],['mediaroom','미디어룸'],['finance','재정 공개']];
var CAT={};CATS.forEach(function(c){CAT[c[0]]=c[1];});
var ST={'new':'신규',reviewing:'검토 중',done:'처리 완료'};
var VIEWS=['dashboard','posts','pages','inquiries','files','settings'];
var MAX_FILE=8*1024*1024;
var S={view:'dashboard',posts:[],pages:[],inq:[],files:[],postId:null,pagePath:null,inqId:null,dirty:false,pageDirty:false,filesLoaded:false};

function $(id){return document.getElementById(id);}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':c==='"'?'&quot;':'&#39;';});}
function arr(x){return Array.isArray(x)?x:[];}
function safeUrl(u){u=String(u==null?'':u).trim();if(/^https?:\/\/[^\s]+$/i.test(u))return u;if(/^\/(?!\/)[^\s]*$/.test(u))return u;return '';}
function absUrl(u){try{return new URL(u,location.origin).href;}catch(e){return u;}}
function dateOnly(s){var m=String(s==null?'':s).match(/^(\d{4}-\d{2}-\d{2})/);return m?m[1]:'';}
function fmtDate(s){if(!s)return '-';var t=String(s);if(/^\d{4}-\d{2}-\d{2}$/.test(t))return t;var d=new Date(t.replace(' ','T')+(/(?:Z|[+-]\d{2}:?\d{2})$/.test(t)?'':'Z'));if(Number.isNaN(d.getTime()))return t;return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d);}
function today(){var d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10);}
function fmtSize(n){n=Number(n)||0;if(n<1024)return n+' B';if(n<1048576)return (n/1024).toFixed(1)+' KB';return (n/1048576).toFixed(1)+' MB';}
function num(n){var x=Number(n);return isFinite(x)?x.toLocaleString('ko-KR'):'-';}
function isPub(v){return v===true||v===1||v==='1'||v==='true';}
function same(a,b){return a!=null&&b!=null&&String(a)===String(b);}
function byDateDesc(a,b){var x=String(a.created_at||''),y=String(b.created_at||'');if(x!==y)return x<y?1:-1;return (Number(b.id)||0)-(Number(a.id)||0);}

/* ---------- 알림 ---------- */
var toastTimer=null;
function showError(msg){$('alertMsg').textContent=String(msg||'알 수 없는 오류가 발생했습니다.');$('alert').hidden=false;}
function hideAlert(){$('alert').hidden=true;}
function toast(msg){var t=$('toast');t.textContent=msg;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.hidden=true;},2600);}
function handle(e){if(e&&e.handled)return;showError(e&&e.message?e.message:'알 수 없는 오류가 발생했습니다.');}

/* ---------- API ---------- */
function statusMsg(st){
  if(st===400)return '입력 내용을 확인해 주세요 (400).';
  if(st===403)return '권한이 없습니다. 다시 로그인해 주세요 (403).';
  if(st===404)return '대상을 찾을 수 없습니다 (404).';
  if(st===413)return '파일 또는 내용이 너무 큽니다 (413).';
  if(st===429)return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요 (429).';
  if(st>=500)return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요 ('+st+').';
  return '요청을 처리하지 못했습니다 ('+st+').';
}
async function api(method,url,body,opts){
  opts=opts||{};
  var o={method:method,credentials:'same-origin',cache:'no-store',headers:{'Accept':'application/json','X-Requested-With':'fetch'}};
  if(body!==undefined){o.headers['Content-Type']='application/json';o.body=JSON.stringify(body);}
  var res;
  try{res=await fetch(url,o);}catch(e){throw new Error('서버에 연결하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.');}
  if(res.status===401&&!opts.no401){
    toLogin('로그인이 필요합니다. 로그인 시간이 지났을 수 있습니다.','err');
    var e1=new Error('로그인이 필요합니다.');e1.handled=true;e1.status=401;throw e1;
  }
  var text='';try{text=await res.text();}catch(e){}
  if(opts.rawText&&res.ok)return text;
  var data=null;try{data=text?JSON.parse(text):{};}catch(e){data=null;}
  if(!res.ok||!data||data.ok===false){
    var m=data&&(data.error||data.message);
    if(m&&typeof m==='object')m=m.message||'';
    if(!m)m=res.ok?'서버 응답을 읽지 못했습니다.':statusMsg(res.status);
    var e2=new Error(String(m));e2.status=res.status;throw e2;
  }
  return data;
}
async function busy(btn,fn){
  if(btn){if(btn.disabled)return;btn.disabled=true;btn.setAttribute('aria-busy','true');}
  try{return await fn();}catch(e){handle(e);}
  finally{if(btn){btn.disabled=false;btn.removeAttribute('aria-busy');}}
}

/* ---------- 로그인 ---------- */
function toLogin(msg,kind){
  clearData();
  $('boot').hidden=true;$('app').hidden=true;$('login').hidden=false;
  var m=$('loginMsg');m.textContent=msg||'';m.hidden=!msg;m.className='form-msg'+(kind==='info'?' info':'');
  var p=$('loginPw');p.value='';setTimeout(function(){try{p.focus();}catch(e){}},30);
}
function toApp(){
  $('boot').hidden=true;$('login').hidden=true;$('app').hidden=false;hideAlert();
  var h=(location.hash||'').replace('#','');
  go(VIEWS.indexOf(h)>=0?h:'dashboard');
  if(S.view!=='dashboard')refreshStats();
}
function clearData(){
  resetAnalytics();
  S.posts=[];S.pages=[];S.inq=[];S.files=[];S.postId=null;S.pagePath=null;S.inqId=null;S.dirty=false;S.pageDirty=false;S.filesLoaded=false;
  ['postList','pageList','inqList','fileList','recentInq'].forEach(function(id){var el=$(id);if(el)el.innerHTML='';});
  var d=$('inqDetail');if(d)d.innerHTML='<p class="empty">왼쪽 목록에서 문의를 선택해 주세요.</p>';
  var dl=$('fileUrls');if(dl)dl.innerHTML='';
  if($('postForm'))fillPost(null);
  if($('pgForm')){$('pgForm').hidden=true;$('pgEmpty').hidden=false;$('pgHtml').value='';$('pgTitle').value='';}
  ['pwCur','pwNew','pwNew2'].forEach(function(id){var el=$(id);if(el)el.value='';});
}
async function boot(){
  try{
    var d=await api('GET','/api/admin/session',undefined,{no401:true});
    if(d.authenticated===true)toApp();else toLogin('');
  }catch(e){toLogin('');handle(e);}
}
$('loginForm').addEventListener('submit',function(ev){
  ev.preventDefault();
  var pw=$('loginPw').value;
  var m=$('loginMsg');
  if(!pw){m.textContent='비밀번호를 입력해 주세요.';m.className='form-msg';m.hidden=false;$('loginPw').focus();return;}
  busy($('loginBtn'),async function(){
    try{await api('POST','/api/admin/login',{password:pw},{no401:true});}
    catch(e){
      if(e.status===401){m.textContent='비밀번호가 올바르지 않습니다.';m.className='form-msg';m.hidden=false;$('loginPw').select();return;}
      m.textContent=e.message;m.className='form-msg';m.hidden=false;return;
    }
    $('loginPw').value='';m.hidden=true;toApp();
  });
});
$('logoutBtn').addEventListener('click',function(){
  if((S.dirty||S.pageDirty)&&!confirm('저장하지 않은 변경 사항이 있습니다. 그래도 로그아웃할까요?'))return;
  busy($('logoutBtn'),async function(){
    try{await api('POST','/api/admin/logout',{},{no401:true});}catch(e){}
    S.dirty=false;S.pageDirty=false;
    toLogin('로그아웃되었습니다.','info');
  });
});
$('alertClose').addEventListener('click',hideAlert);

/* ---------- 화면 이동 ---------- */
function go(v){
  if(VIEWS.indexOf(v)<0)v='dashboard';
  if(v!=='dashboard'){stopAnalyticsTimer();analyticsEpoch++;analyticsPending=false;}
  S.view=v;
  $('currentSection').textContent=({dashboard:'대시보드',posts:'게시물',pages:'페이지',inquiries:'문의',files:'파일',settings:'설정·백업'})[v];
  VIEWS.forEach(function(x){$('view-'+x).hidden=(x!==v);});
  document.querySelectorAll('[data-view]').forEach(function(b){var on=b.getAttribute('data-view')===v;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  try{history.replaceState(null,'','#'+v);}catch(e){}
  load(v);
  window.scrollTo(0,0);
}
function load(v){
  if(v==='dashboard')return loadDashboard();
  if(v==='posts'){loadPosts();if(!S.filesLoaded)loadFiles(true);return;}
  if(v==='pages')return loadPages();
  if(v==='inquiries')return loadInquiries();
  if(v==='files')return loadFiles(false);
}
document.addEventListener('click',function(ev){
  var t=ev.target.closest('[data-view],[data-go],[data-refresh],[data-action],[data-copy]');
  if(!t)return;
  if(t.hasAttribute('data-view')){go(t.getAttribute('data-view'));return;}
  if(t.hasAttribute('data-go')){
    var st=t.getAttribute('data-status');
    if(st&&$('iqStatus'))$('iqStatus').value=st;
    go(t.getAttribute('data-go'));return;
  }
  if(t.hasAttribute('data-refresh')){var rv=t.getAttribute('data-refresh');load(rv);if(rv!=='dashboard')refreshStats();return;}
  if(t.hasAttribute('data-copy')){copyText(absUrl(t.getAttribute('data-copy')));return;}
  if(t.getAttribute('data-action')==='new-post'){
    if(S.dirty&&!confirm('저장하지 않은 변경 사항이 있습니다. 새 게시물을 작성할까요?'))return;
    fillPost(null);if(S.view!=='posts')go('posts');else renderPostList();
    setTimeout(function(){$('peTitle').focus();},50);
  }
});
window.addEventListener('beforeunload',function(e){if(S.dirty||S.pageDirty){e.preventDefault();e.returnValue='';}});
async function copyText(s){
  try{await navigator.clipboard.writeText(s);toast('주소를 복사했습니다.');}
  catch(e){
    var ta=document.createElement('textarea');ta.value=s;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
    var ok=false;try{ok=document.execCommand('copy');}catch(e2){}
    ta.remove();
    if(ok)toast('주소를 복사했습니다.');else showError('자동 복사에 실패했습니다. 아래 주소를 직접 복사해 주세요.\n'+s);
  }
}


/* ---------- 대시보드 ---------- */
var analyticsData=null,analyticsEpoch=0,analyticsTimer=null,analyticsPending=false,analyticsRecent=[];
function count(v){var n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(1e12,n)):0;}
function pathLabel(v){try{var u=new URL(String(v||'/'),location.origin);return u.pathname.slice(0,240)||'/';}catch(e){return '/';}}
function domainLabel(v){var s=String(v||'');if(!s||s==='직접 방문')return '직접 방문';try{var u=new URL(/^https?:\/\//i.test(s)?s:'https://'+s);return /^[a-z0-9.\-\u00a1-\uffff]+$/i.test(u.hostname)?u.hostname.slice(0,100):'기타';}catch(e){return '기타';}}
function deviceLabel(v){return {desktop:'데스크톱',mobile:'모바일',tablet:'태블릿'}[v]||'기타';}
function sessionLabel(v){return /^익명-[A-Z0-9]{6}$/i.test(String(v||''))?String(v):'익명 세션';}
function emptyAnalytics(msg){return '<p class="data-empty">'+esc(msg||'아직 수집된 데이터가 없습니다.')+'</p>';}
function stopAnalyticsTimer(){if(analyticsTimer){clearTimeout(analyticsTimer);analyticsTimer=null;}}
function scheduleAnalytics(){stopAnalyticsTimer();if(!$('app').hidden&&S.view==='dashboard'&&$('analyticsAuto').checked&&!document.hidden){analyticsTimer=setTimeout(function(){analyticsTimer=null;loadDashboard();},60000);}}
function resetAnalytics(){analyticsEpoch++;stopAnalyticsTimer();analyticsPending=false;analyticsData=null;analyticsRecent=[];$('analyticsAuto').checked=false;$('analyticsCsv').disabled=true;$('analyticsRefresh').disabled=false;$('analyticsRefresh').removeAttribute('aria-busy');['dailyChart','hourlyChart','topPages','deviceChart','referrerList','recentAccess','inquiryTypes','an-summary'].forEach(function(id){$(id).innerHTML='';});['an-todayViews','an-todaySessions','an-activeNow','an-periodInquiries','an-published','an-drafts','funnel-new','funnel-reviewing','funnel-done','st-posts','st-pages','st-inquiries','st-new','st-files'].forEach(function(id){$(id).textContent='0';});$('inquirySummary').textContent='';$('collectionInfo').textContent='집계 대기 · Asia/Seoul (KST)';$('analyticsStatus').textContent='실제 수집 데이터를 불러옵니다.';$('headerUpdated').textContent='업데이트 대기 · KST';$('headerUpdated').removeAttribute('datetime');$('an-compare').textContent='집계 대기';$('an-range').textContent='집계 기간 확인 중';$('an-periodLabel').textContent='선택 기간 '+$('analyticsDays').value+'일';$('an-fileBytes').textContent='0 B';$('contentUpdated').textContent='';$('navBadge').textContent='';$('navBadge').hidden=true;}
function markUpdated(){var now=new Date();$('headerUpdated').textContent='갱신 '+new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now)+' KST';$('headerUpdated').dateTime=now.toISOString();}
function setNavCount(v){var b=$('navBadge'),n=count(v);b.textContent=n>99?'99+':String(n);b.hidden=!(n>0);}
async function refreshStats(){
  try{var d=await api('GET','/api/admin/stats');if($('app').hidden)return;
    $('st-posts').textContent=num(d.posts);$('st-pages').textContent=num(d.pages);$('st-inquiries').textContent=num(d.inquiries);$('st-new').textContent=num(d.newInquiries);$('st-files').textContent=num(d.files);setNavCount(d.newInquiries);
  }catch(e){handle(e);}
}
async function loadDashboard(){
  var days=Number($('analyticsDays').value);if([7,30,60].indexOf(days)<0)days=30;
  var token=++analyticsEpoch;stopAnalyticsTimer();analyticsPending=true;$('analyticsRefresh').disabled=true;$('analyticsRefresh').setAttribute('aria-busy','true');$('analyticsStatus').textContent='방문·콘텐츠·문의 집계를 불러오는 중입니다.';
  try{var d=await api('GET','/api/admin/analytics?days='+days);if(token!==analyticsEpoch||$('app').hidden)return;analyticsData=d;analyticsRecent=arr(d.recentInquiries).slice(0,5);renderAnalytics(d);renderRecentInq();markUpdated();$('analyticsCsv').disabled=false;$('analyticsStatus').textContent='실제 수집 데이터 · '+days+'일 기준 · 마지막 갱신 '+fmtDate(new Date().toISOString())+' KST';}
  catch(e){if(token===analyticsEpoch&&!$('app').hidden){resetAnalytics();$('recentInq').innerHTML=emptyAnalytics('최근 문의를 불러오지 못했습니다.');$('analyticsStatus').textContent='집계를 불러오지 못했습니다. 이전 데이터는 지웠으며 자동 갱신을 중지했습니다. 새로고침해 주세요.';['dailyChart','hourlyChart','topPages','deviceChart','referrerList','recentAccess','inquiryTypes'].forEach(function(id){$(id).innerHTML=emptyAnalytics('데이터를 불러오지 못했습니다. 새로고침해 주세요.');});handle(e);}}
  finally{if(token===analyticsEpoch){analyticsPending=false;$('analyticsRefresh').disabled=false;$('analyticsRefresh').removeAttribute('aria-busy');scheduleAnalytics();}}
}
function renderRecentInq(){var list=analyticsRecent.slice().sort(byDateDesc).slice(0,5);$('recentInq').innerHTML=list.length?list.map(inqItem).join(''):'<p class="empty">접수된 문의가 없습니다.</p>';}
function dataDetails(caption,heads,rows){return '<details class="chart-data"><summary>'+esc(caption)+' 수치 표로 보기</summary><div class="chart-data-scroll"><table><caption class="sr-only">'+esc(caption)+'</caption><thead><tr>'+heads.map(function(h){return '<th scope="col">'+esc(h)+'</th>';}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+r.map(function(v){return '<td>'+esc(v)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div></details>';}
function renderDaily(rows){
  var source=arr(rows).filter(function(r){return /^\d{4}-\d{2}-\d{2}$/.test(String(r.date));}).slice(0,60),missing=source.some(function(r){return r.available===false;}),list=source.filter(function(r){return r.available!==false;});
  if(!list.length){$('dailyChart').innerHTML=emptyAnalytics('수집 전 자료 없음. 수집 시작 이후 방문 흐름이 여기에 표시됩니다.')+dataDetails('일별 방문',['날짜','조회','세션','문의'],source.map(function(r){return [r.date,r.available===false?'미수집':num(count(r.views)),r.available===false?'미수집':num(count(r.sessions)),num(count(r.inquiries))];}));return;}
  var W=760,H=260,L=50,R=20,T=22,B=38,pw=W-L-R,ph=H-T-B,max=Math.max(1,...list.map(function(r){return Math.max(count(r.views),count(r.sessions));}));
  var top=Math.max(4,Math.ceil(max/4)*4),x=function(i){return L+(list.length===1?pw/2:i*pw/(list.length-1));},y=function(v){return T+ph-count(v)/top*ph;};
  var g='<svg class="linechart" viewBox="0 0 '+W+' '+H+'" role="img" aria-labelledby="dailySvgTitle dailySvgDesc"><title id="dailySvgTitle">일별 페이지 조회와 방문 세션</title><desc id="dailySvgDesc">각 점에 마우스를 올리거나 탭 키로 선택하면 날짜별 수치를 확인할 수 있습니다. 아래 수치 표에서도 확인할 수 있습니다.</desc>';
  for(var t=0;t<=4;t++){var yy=T+ph*t/4;g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+yy+'" y2="'+yy+'" stroke="#e8ece3"/><text x="'+(L-10)+'" y="'+(yy+4)+'" text-anchor="end">'+esc(num(top*(4-t)/4))+'</text>';}
  var points=list.map(function(r,i){return x(i)+','+y(r.views);}).join(' ');g+='<polygon points="'+x(0)+','+(T+ph)+' '+points+' '+x(list.length-1)+','+(T+ph)+'" fill="#edf3e8"/>';
  g+='<polyline points="'+points+'" fill="none" stroke="#296347" stroke-width="3" stroke-linejoin="round"/><polyline points="'+list.map(function(r,i){return x(i)+','+y(r.sessions);}).join(' ')+'" fill="none" stroke="#9cae76" stroke-width="2.5" stroke-linejoin="round"/>';
  var step=Math.max(1,Math.ceil((list.length-1)/5));list.forEach(function(r,i){var label=r.date.slice(5).replace('-','/'),tip=r.date+' · 조회 '+num(count(r.views))+' · 세션 '+num(count(r.sessions))+' · 문의 '+num(count(r.inquiries));if(i%step===0||i===list.length-1)g+='<text x="'+x(i)+'" y="'+(H-10)+'" text-anchor="middle">'+esc(label)+'</text>';g+='<circle class="chart-point" tabindex="0" role="img" aria-label="'+esc(tip)+'" cx="'+x(i)+'" cy="'+y(r.views)+'" r="4" fill="#296347" stroke="#fff" stroke-width="1.5"><title>'+esc(tip)+'</title></circle>';});
  g+='</svg>';if(missing)g+='<p class="note">수집 전 자료 없음. 그래프는 수집 시작 이후 날짜만 표시합니다.</p>';if(!list.some(function(r){return count(r.views)>0||count(r.sessions)>0;}))g+=emptyAnalytics('수집 시작 이후 선택 기간에 기록된 방문이 없습니다.');g+=dataDetails('일별 방문',['날짜','조회','세션','문의'],source.map(function(r){return [r.date,r.available===false?'미수집':num(count(r.views)),r.available===false?'미수집':num(count(r.sessions)),num(count(r.inquiries))];}));$('dailyChart').innerHTML=g;
}
function renderHourly(rows){
  var vals=Array(24).fill(0),available=Array(24).fill(true);arr(rows).forEach(function(r){var h=Number(r.hour);if(Number.isInteger(h)&&h>=0&&h<24){available[h]=r.available!==false;vals[h]=available[h]?count(r.views):0;}});
  var W=380,H=260,L=38,R=8,T=22,B=38,pw=W-L-R,ph=H-T-B,top=Math.max(4,Math.ceil(Math.max(...vals)/4)*4),bw=pw/24;
  var g='<svg class="linechart" viewBox="0 0 '+W+' '+H+'" role="img" aria-labelledby="hourlySvgTitle"><title id="hourlySvgTitle">한국시간 오늘 시간대별 페이지 조회</title>';
  for(var j=0;j<=4;j++){var yy=T+ph*j/4;g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+yy+'" y2="'+yy+'" stroke="#e8ece3"/><text x="'+(L-7)+'" y="'+(yy+4)+'" text-anchor="end">'+esc(num(top*(4-j)/4))+'</text>';}
  vals.forEach(function(v,h){var bh=v/top*ph,x=L+h*bw+2,y=T+ph-bh,tip=h+'시 · '+(available[h]?num(v)+'회':'미수집');g+='<rect class="chart-point" tabindex="0" role="img" aria-label="'+esc(tip)+'" x="'+x+'" y="'+(v?y:T+ph-1)+'" width="'+Math.max(2,bw-4)+'" height="'+Math.max(1,bh)+'" rx="2" fill="'+(!available[h]?'#d9ddd5':v?'#77977a':'#e9ede4')+'"><title>'+esc(tip)+'</title></rect>';if(h%6===0||h===23)g+='<text x="'+(x+bw/2-2)+'" y="'+(H-10)+'" text-anchor="middle">'+h+'시</text>';});
  g+='</svg>';if(available.some(function(a){return !a;}))g+='<p class="note">수집 전 자료 없음. 수집 시작 이전 시간은 미수집입니다.</p>';if(!vals.some(function(v){return v>0;}))g+=emptyAnalytics('오늘 수집된 방문이 없습니다.');g+=dataDetails('시간대별 조회',['시간','조회'],vals.map(function(v,h){return [h+'시',available[h]?num(v):'미수집'];}));$('hourlyChart').innerHTML=g;
}
function ranked(id,rows,label,sub,limit){var list=arr(rows).slice().sort(function(a,b){return count(b.views)-count(a.views);}).slice(0,limit||8),max=Math.max(1,...list.map(function(r){return count(r.views);}));if(!list.length){$(id).innerHTML=emptyAnalytics();return;}$(id).innerHTML=list.map(function(r,i){var name=label(r),secondary=sub?sub(r):'';return '<div class="rank-row"><div class="rank-caption"><span class="rank-name" title="'+esc(name+(secondary?' · '+secondary:''))+'">'+(i+1)+'. '+esc(name)+(secondary?'<small>'+esc(secondary)+'</small>':'')+'</span><strong>'+esc(num(count(r.views)))+'회</strong></div><div class="rank-track"><div class="rank-fill" style="width:'+Math.max(0,Math.min(100,count(r.views)/max*100))+'%"></div></div></div>';}).join('');}
function renderDevices(rows){
  var keys=['desktop','mobile','tablet'],colors=['#296347','#9cae76','#d9dfcc'],vals=keys.map(function(k){return arr(rows).filter(function(r){return r.device===k;}).reduce(function(n,r){return n+count(r.views);},0);}),total=vals.reduce(function(a,b){return a+b;},0),cursor=0,parts=[];
  vals.forEach(function(v,i){var start=cursor;cursor+=total?v/total*100:0;parts.push(colors[i]+' '+start+'% '+cursor+'%');});
  var style=total?'conic-gradient('+parts.join(',')+')':'#edf0e8',summary=keys.map(function(k,i){return deviceLabel(k)+' '+num(vals[i])+'회';}).join(', ');
  $('deviceChart').innerHTML='<div class="device-layout"><div class="donut" role="img" aria-label="'+esc(summary)+'" style="background:'+style+'"><div class="donut-center">'+esc(num(total))+'<small>페이지 조회</small></div></div><div class="device-key">'+keys.map(function(k,i){return '<div class="device-key-row"><span><i style="background:'+colors[i]+'"></i>'+deviceLabel(k)+'</span><strong>'+esc(total?(vals[i]/total*100).toFixed(1):'0')+'%</strong></div>';}).join('')+'</div></div>'+(total?'':emptyAnalytics('기기별 수집 데이터가 없습니다.'));
}
function renderAccess(rows){var list=arr(rows).slice(0,20);if(!list.length){$('recentAccess').innerHTML=emptyAnalytics('수집된 최근 접속 기록이 없습니다.');return;}var h='<table class="access-table"><caption class="sr-only">최근 익명 접속, 한국시간 기준</caption><thead><tr><th scope="col">접속 시각</th><th scope="col">페이지</th><th scope="col">기기</th><th scope="col">유입</th><th scope="col">익명 세션</th></tr></thead><tbody>';list.forEach(function(r){var p=pathLabel(r.path);h+='<tr><td>'+esc(fmtDate(r.at))+'</td><td title="'+esc(p)+'">'+esc(r.title||p)+'<small>'+esc(p)+'</small></td><td>'+esc(deviceLabel(r.device))+'</td><td>'+esc(domainLabel(r.referrer))+'</td><td class="session-label">'+esc(sessionLabel(r.sessionLabel))+'</td></tr>';});$('recentAccess').innerHTML=h+'</tbody></table>';}
function renderAnalytics(d){
  var o=d.overview||{},c=d.content||{},iq=d.inquiries||{},r=d.range||{};
  ['todayViews','todaySessions','activeNow'].forEach(function(k){$('an-'+k).textContent=num(count(o[k]));});$('an-periodInquiries').textContent=num(count(iq.period));$('an-periodLabel').textContent='선택 기간 '+([7,30,60].indexOf(Number(r.days))>=0?Number(r.days):Number($('analyticsDays').value))+'일 누적';
  var diff=count(o.todayViews)-count(o.yesterdayViews);$('an-compare').textContent=o.yesterdayAvailable===false?'전일 비교 자료 없음':'어제 '+num(count(o.yesterdayViews))+'회 대비 '+(diff>0?'+':'')+num(diff)+'회';
  $('an-range').textContent=String(r.start||'')+' ~ '+String(r.end||'')+' · KST';$('an-summary').innerHTML='기간 조회 <strong>'+esc(num(count(o.periodViews)))+'</strong> · 방문 세션 <strong>'+esc(num(count(o.periodSessions)))+'</strong> · 일평균 조회 <strong>'+esc(num(Math.round(count(o.avgDailyViews)*10)/10))+'</strong>';
  $('st-posts').textContent=num(count(c.posts));$('st-pages').textContent=num(count(c.pages));$('st-files').textContent=num(count(c.files));$('st-inquiries').textContent=num(count(iq.total));$('st-new').textContent=num(count(iq.new));$('an-published').textContent=num(count(c.published));$('an-drafts').textContent=num(count(c.drafts));$('an-fileBytes').textContent=fmtSize(count(c.fileBytes));$('contentUpdated').textContent=c.latestPublishedAt?'최근 공개 '+fmtDate(c.latestPublishedAt)+' KST':'아직 공개된 게시물이 없습니다.';
  ['new','reviewing','done'].forEach(function(k){$('funnel-'+k).textContent=num(count(iq[k]));});$('inquirySummary').textContent='전체 '+num(count(iq.total))+'건 · 선택 기간 접수 '+num(count(iq.period))+'건';setNavCount(iq.new);
  var types=arr(iq.byType).map(function(t){return {label:t.type||'기타',views:count(t.count)};});ranked('inquiryTypes',types,function(t){return String(t.label);},null,8);
  renderDaily(d.daily);renderHourly(d.hourly);ranked('topPages',d.topPages,function(p){return String(p.title||pathLabel(p.path));},function(p){return pathLabel(p.path);},8);renderDevices(d.devices);ranked('referrerList',d.referrers,function(t){return domainLabel(t.host);},null,8);renderAccess(d.recent);
  $('collectionInfo').textContent=(d.collectedSince?'수집 시작 '+fmtDate(d.collectedSince)+' KST':'수집 시작 정보가 아직 없습니다.')+' · 시간대 Asia/Seoul (KST) · 적용 이후 실데이터만 표시';
}
$('analyticsDays').addEventListener('change',function(){loadDashboard();});
$('analyticsAuto').addEventListener('change',scheduleAnalytics);
document.addEventListener('visibilitychange',function(){if(document.hidden)stopAnalyticsTimer();else scheduleAnalytics();});
$('analyticsCsv').addEventListener('click',function(){if(!analyticsData)return;var d=analyticsData,rows=[['날짜 (KST)','페이지 조회','방문 세션','문의']].concat(arr(d.daily).map(function(r){return [String(r.date||''),r.available===false?'미수집':count(r.views),r.available===false?'미수집':count(r.sessions),count(r.inquiries)];}));var csv='\ufeff'+rows.map(function(row){return row.map(function(v){var s=String(v);if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}).join(',');}).join('\r\n'),u=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'})),a=document.createElement('a');a.href=u;a.download='esg-forum-analytics-'+String(d.range&&d.range.end||today()).replace(/[^0-9-]/g,'')+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},4000);toast('선택 기간의 일별 집계 CSV를 저장했습니다.');});
$('recentInq').addEventListener('click',function(ev){var b=ev.target.closest('[data-inq]');if(!b)return;S.inqId=b.getAttribute('data-inq');$('iqStatus').value='';go('inquiries');});

/* ---------- 게시물 ---------- */
async function loadPosts(){
  try{var d=await api('GET','/api/admin/posts');S.posts=arr(d.items);renderPostList();}
  catch(e){if(!S.posts.length)$('postList').innerHTML='<p class="empty">게시물을 불러오지 못했습니다.</p>';handle(e);}
}
function findPost(id){for(var i=0;i<S.posts.length;i++)if(same(S.posts[i].id,id))return S.posts[i];return null;}
function renderPostList(){
  var cat=$('pfCat').value,st=$('pfStatus').value,q=$('pfQ').value.trim().toLowerCase();
  var list=S.posts.filter(function(p){
    if(cat&&p.category!==cat)return false;
    if(st==='pub'&&!isPub(p.published))return false;
    if(st==='draft'&&isPub(p.published))return false;
    if(q&&(String(p.title||'')+' '+String(p.body||'')).toLowerCase().indexOf(q)<0)return false;
    return true;
  }).sort(byDateDesc);
  $('postCount').textContent=list.length+'건 표시 / 전체 '+S.posts.length+'건';
  if(!list.length){$('postList').innerHTML='<p class="empty">'+(S.posts.length?'조건에 맞는 게시물이 없습니다.':'아직 게시물이 없습니다. 새 게시물을 작성해 보세요.')+'</p>';return;}
  $('postList').innerHTML=list.map(function(p){
    var sel=same(p.id,S.postId);
    return '<button type="button" class="item'+(sel?' sel':'')+'" data-post="'+esc(p.id)+'"'+(sel?' aria-current="true"':'')+'>'+
      '<span class="item-top"><span class="chip">'+esc(CAT[p.category]||p.category||'미분류')+'</span>'+
      (isPub(p.published)?'<span class="badge ok">공개</span>':'<span class="badge draft">비공개</span>')+
      '<span class="item-date">'+esc(dateOnly(p.created_at)||'-')+'</span></span>'+
      '<span class="item-title">'+esc(p.title||'(제목 없음)')+'</span></button>';
  }).join('');
}
['pfCat','pfStatus'].forEach(function(id){$(id).addEventListener('change',renderPostList);});
$('pfQ').addEventListener('input',renderPostList);
$('postList').addEventListener('click',function(ev){
  var b=ev.target.closest('[data-post]');if(!b)return;
  var id=b.getAttribute('data-post');
  if(same(id,S.postId))return;
  if(S.dirty&&!confirm('저장하지 않은 변경 사항이 있습니다. 다른 게시물을 열까요?'))return;
  var p=findPost(id);if(!p){showError('게시물을 찾을 수 없습니다. 새로고침해 주세요.');return;}
  fillPost(p);renderPostList();
  if(window.innerWidth<900)$('postForm').scrollIntoView({behavior:'smooth',block:'start'});
});
function hasTags(s){return /<\/?[a-z][^>]*>/i.test(String(s||''));}
function fillPost(p){
  S.postId=p&&p.id!=null?p.id:null;
  $('peHeading').textContent=p?'게시물 수정':'새 게시물';
  $('peId').textContent=p&&p.id!=null?('번호 '+p.id):'';
  var cat=p?String(p.category||''):'notice';
  $('peCat').value=CAT[cat]?cat:'';
  $('peTitle').value=p?String(p.title||''):'';
  $('peDate').value=(p&&dateOnly(p.created_at))||today();
  $('pePub').checked=p?isPub(p.published):false;
  var body=p?String(p.body||''):'';
  $('peBody').value=body;
  $('peHtml').checked=p?hasTags(body):false;
  $('peAtt').value=p?String(p.attachment_url||''):'';
  $('peImg').value=p?String(p.image_url||''):'';
  $('peDel').hidden=!(p&&p.id!=null);
  $('pePrevWrap').hidden=true;$('pePrev').removeAttribute('srcdoc');
  updateModeHint();updateUrlHelpers();setDirty(false);
}
function setDirty(v){S.dirty=!!v;$('peDirty').hidden=!S.dirty;}
function updateModeHint(){
  $('peModeHint').textContent=$('peHtml').checked
    ?'HTML 편집 중입니다. <p>, <strong>, <a>, <img> 같은 태그를 쓸 수 있고, 저장할 때 서버가 위험한 코드를 제거합니다.'
    :'일반 글 모드입니다. 입력한 글자 그대로 저장되며, 빈 줄로 문단이 나뉩니다.';
}
function updateUrlHelpers(){
  var a=safeUrl($('peAtt').value),i=safeUrl($('peImg').value);
  var ao=$('peAttOpen');if(a){ao.href=a;ao.hidden=false;}else{ao.removeAttribute('href');ao.hidden=true;}
  var it=$('peImgThumb');if(i){if(it.getAttribute('src')!==i)it.src=i;it.hidden=false;}else{it.removeAttribute('src');it.hidden=true;}
}
$('peImgThumb').addEventListener('error',function(){this.hidden=true;});
$('postForm').addEventListener('input',function(ev){setDirty(true);if(ev.target.id==='peAtt'||ev.target.id==='peImg')updateUrlHelpers();});
$('postForm').addEventListener('change',function(ev){if(ev.target.id!=='peHtml')setDirty(true);});
function textToHtml(t){
  t=String(t||'').replace(/\r\n?/g,'\n').trim();
  if(!t)return '';
  return t.split(/\n{2,}/).map(function(p){return '<p>'+esc(p).replace(/\n/g,'<br>')+'</p>';}).join('\n');
}
function htmlToText(h){
  var s=String(h||'').replace(/<br\s*\/?>/gi,'\n').replace(/<li[^>]*>/gi,'\n- ').replace(/<\/(p|div|h[1-6]|li|tr|blockquote|section|article|ul|ol|table|figure)>/gi,'\n\n');
  var doc=new DOMParser().parseFromString('<!DOCTYPE html><html><body>'+s+'</body></html>','text/html');
  doc.querySelectorAll('script,style,template,noscript').forEach(function(n){n.remove();});
  var t=doc.body?doc.body.textContent||'':'';
  return t.replace(/\u00a0/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
$('peHtml').addEventListener('change',function(){
  var cb=this,ta=$('peBody');
  if(cb.checked){if(ta.value.trim()&&!hasTags(ta.value))ta.value=textToHtml(ta.value);}
  else if(hasTags(ta.value)){
    if(!confirm('일반 글 모드로 바꾸면 HTML 태그와 서식(굵게, 링크, 이미지 등)이 사라지고 글자만 남습니다. 계속할까요?')){cb.checked=true;return;}
    ta.value=htmlToText(ta.value);
  }
  updateModeHint();setDirty(true);
  if(!$('pePrevWrap').hidden)renderPostPreview();
});
function previewDoc(html){
  return '<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><base href="'+esc(location.origin)+'/"><style>body{font-family:Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;color:#17261f;line-height:1.75;padding:20px 22px;margin:0;word-break:keep-all;overflow-wrap:anywhere}img,video{max-width:100%;height:auto}table{border-collapse:collapse;max-width:100%}td,th{border:1px solid #dfe6e2;padding:6px 10px}a{color:#1d6b4f}h1,h2,h3{line-height:1.35}</style></head><body>'+html+'</body></html>';
}
function renderPostPreview(){
  var v=$('peBody').value;
  var html=$('peHtml').checked?v:textToHtml(v);
  var title='<h2>'+esc($('peTitle').value||'(제목 없음)')+'</h2>';
  var img=safeUrl($('peImg').value);
  $('pePrev').srcdoc=previewDoc(title+(img?'<p><img src="'+esc(img)+'" alt=""></p>':'')+(html||'<p style="color:#87958e">본문이 비어 있습니다.</p>'));
}
$('pePrevBtn').addEventListener('click',function(){
  var w=$('pePrevWrap');
  if(w.hidden){renderPostPreview();w.hidden=false;this.textContent='미리보기 닫기';}
  else{w.hidden=true;this.textContent='미리보기';}
});
$('postForm').addEventListener('submit',function(ev){ev.preventDefault();savePost();});
document.addEventListener('keydown',function(ev){
  if((ev.ctrlKey||ev.metaKey)&&(ev.key==='s'||ev.key==='S')){
    if(S.view==='posts'&&!$('app').hidden){ev.preventDefault();savePost();}
    else if(S.view==='pages'&&!$('pgForm').hidden){ev.preventDefault();savePage();}
  }
});
function savePost(){
  hideAlert();
  var cat=$('peCat').value,title=$('peTitle').value.trim(),date=$('peDate').value,body=$('peBody').value;
  var att=$('peAtt').value.trim(),img=$('peImg').value.trim();
  if(!CAT[cat]){showError('분류를 선택해 주세요.');$('peCat').focus();return;}
  if(!title){showError('제목을 입력해 주세요.');$('peTitle').focus();return;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){showError('게시일을 선택해 주세요.');$('peDate').focus();return;}
  if(!body.trim()){showError('본문을 입력해 주세요.');$('peBody').focus();return;}
  if(att&&!safeUrl(att)){showError('첨부파일 주소는 https:// 또는 / 로 시작해야 합니다.');$('peAtt').focus();return;}
  if(img&&!safeUrl(img)){showError('대표 이미지 주소는 https:// 또는 / 로 시작해야 합니다.');$('peImg').focus();return;}
  var fmt=$('peHtml').checked?'html':'text';
  var payload={category:cat,title:title,body:body,created_at:date,attachment_url:att,image_url:img,published:$('pePub').checked,format:fmt,content_type:fmt};
  if(S.postId!=null)payload.id=S.postId;
  return busy($('peSave'),async function(){
    var d=await api('POST','/api/admin/posts',payload);
    var isNew=S.postId==null;
    if(d.id!=null)S.postId=d.id;
    $('peHeading').textContent='게시물 수정';
    $('peId').textContent=S.postId!=null?('번호 '+S.postId):'';
    $('peDel').hidden=S.postId==null;
    setDirty(false);
    toast(isNew?(payload.published?'게시물을 공개로 등록했습니다.':'비공개 초안으로 저장했습니다.'):'변경 사항을 저장했습니다.');
    await loadPosts();refreshStats();
  });
}
$('peDel').addEventListener('click',function(){
  if(S.postId==null)return;
  var p=findPost(S.postId);
  var name=p&&p.title?('"'+p.title+'" '):'';
  if(!confirm(name+'게시물을 삭제할까요?\n삭제하면 되돌릴 수 없습니다.'))return;
  var id=S.postId;
  busy($('peDel'),async function(){
    await api('DELETE','/api/admin/posts/'+encodeURIComponent(id));
    fillPost(null);toast('게시물을 삭제했습니다.');
    await loadPosts();refreshStats();
  });
});

/* ---------- 페이지 ---------- */
async function loadPages(){
  try{var d=await api('GET','/api/admin/pages');S.pages=arr(d.items);renderPageList();}
  catch(e){if(!S.pages.length)$('pageList').innerHTML='<p class="empty">페이지를 불러오지 못했습니다.</p>';handle(e);}
}
function findPage(path){for(var i=0;i<S.pages.length;i++)if(same(S.pages[i].path,path))return S.pages[i];return null;}
function renderPageList(){
  var q=$('pgQ').value.trim().toLowerCase();
  var list=S.pages.filter(function(p){return !q||(String(p.title||'')+' '+String(p.path||'')).toLowerCase().indexOf(q)>=0;});
  if(!list.length){$('pageList').innerHTML='<p class="empty">'+(S.pages.length?'검색 결과가 없습니다.':'수정할 수 있는 페이지가 없습니다.')+'</p>';return;}
  $('pageList').innerHTML=list.map(function(p){
    var sel=same(p.path,S.pagePath);
    return '<button type="button" class="item'+(sel?' sel':'')+'" data-page="'+esc(p.path)+'"><span class="item-title">'+esc(p.title||'(제목 없음)')+'</span><span class="item-sub">'+esc(p.path)+'</span></button>';
  }).join('');
}
$('pgQ').addEventListener('input',renderPageList);
$('pageList').addEventListener('click',function(ev){
  var b=ev.target.closest('[data-page]');if(!b)return;
  var path=b.getAttribute('data-page');
  if(same(path,S.pagePath))return;
  if(S.pageDirty&&!confirm('저장하지 않은 변경 사항이 있습니다. 다른 페이지를 열까요?'))return;
  var p=findPage(path);if(!p){showError('페이지를 찾을 수 없습니다. 새로고침해 주세요.');return;}
  fillPage(p);renderPageList();
  if(window.innerWidth<900)$('pgForm').scrollIntoView({behavior:'smooth',block:'start'});
});
function fillPage(p){
  S.pagePath=p.path;
  $('pgEmpty').hidden=true;$('pgForm').hidden=false;
  $('pgPath').textContent=String(p.path||'');
  $('pgTitle').value=String(p.title||'');
  $('pgHtml').value=String(p.html||'');
  var u=safeUrl(p.path);var o=$('pgOpen');if(u){o.href=u;o.hidden=false;}else{o.hidden=true;}
  var imgs=arr(p.images).map(function(im){
    var raw=typeof im==='string'?im:(im&&(im.url||im.src))||'';
    var su=safeUrl(raw);if(!su)return '';
    var alt=im&&typeof im==='object'&&im.alt?im.alt:'';
    return '<figure class="thumb"><img src="'+esc(su)+'" alt="'+esc(alt)+'" loading="lazy"><figcaption>'+esc(raw)+'</figcaption><button type="button" class="btn sm" data-copy="'+esc(su)+'">주소 복사</button></figure>';
  }).filter(Boolean);
  $('pgImgs').innerHTML=imgs.join('');$('pgImgsWrap').hidden=!imgs.length;
  $('pgPrevWrap').hidden=true;$('pgPrevBtn').textContent='미리보기';$('pgPrev').removeAttribute('srcdoc');
  setPageDirty(false);
}
function setPageDirty(v){S.pageDirty=!!v;$('pgDirty').hidden=!S.pageDirty;}
$('pgForm').addEventListener('input',function(){setPageDirty(true);});
$('pgPrevBtn').addEventListener('click',function(){
  var w=$('pgPrevWrap');
  if(w.hidden){$('pgPrev').srcdoc=previewDoc($('pgHtml').value);w.hidden=false;this.textContent='미리보기 닫기';}
  else{w.hidden=true;this.textContent='미리보기';}
});
$('pgForm').addEventListener('submit',function(ev){ev.preventDefault();savePage();});
function savePage(){
  hideAlert();
  if(S.pagePath==null)return;
  var title=$('pgTitle').value.trim();
  if(!title){showError('페이지 제목을 입력해 주세요.');$('pgTitle').focus();return;}
  var path=S.pagePath,html=$('pgHtml').value;
  return busy($('pgSave'),async function(){
    await api('POST','/api/admin/pages',{path:path,title:title,html:html});
    setPageDirty(false);toast('페이지를 저장했습니다.');
    await loadPages();
    var p=findPage(path);
    if(p&&!$('pgPrevWrap').hidden)$('pgPrev').srcdoc=previewDoc($('pgHtml').value);
    if(p&&p.images){var keep=$('pgHtml').value;fillPage(p);$('pgHtml').value=keep;$('pgTitle').value=title;}
    refreshStats();
  });
}

/* ---------- 문의 ---------- */
async function loadInquiries(){
  try{var d=await api('GET','/api/admin/inquiries');S.inq=arr(d.items);renderInqList();renderInqDetail();}
  catch(e){if(!S.inq.length)$('inqList').innerHTML='<p class="empty">문의를 불러오지 못했습니다.</p>';handle(e);}
}
function findInq(id){for(var i=0;i<S.inq.length;i++)if(same(S.inq[i].id,id))return S.inq[i];return null;}
function stBadge(s){var k=ST[s]?s:'new';return '<span class="badge '+k+'">'+esc(ST[k])+'</span>';}
function inqItem(p){
  var sel=same(p.id,S.inqId)&&S.view==='inquiries';
  var who=[p.name,p.organization].filter(Boolean).join(' · ');
  return '<button type="button" class="item'+(sel?' sel':'')+'" data-inq="'+esc(p.id)+'">'+
    '<span class="item-top">'+stBadge(p.status)+(p.type?'<span class="chip">'+esc(p.type)+'</span>':'')+'<span class="item-date">'+esc(fmtDate(p.created_at))+'</span></span>'+
    '<span class="item-title">'+esc(p.subject||'(제목 없음)')+'</span>'+
    '<span class="item-sub">'+esc(who||'-')+'</span></button>';
}
function renderInqList(){
  var st=$('iqStatus').value,q=$('iqQ').value.trim().toLowerCase();
  var list=S.inq.filter(function(p){
    if(st&&(ST[p.status]?p.status:'new')!==st)return false;
    if(q&&[p.name,p.organization,p.subject,p.email,p.type].join(' ').toLowerCase().indexOf(q)<0)return false;
    return true;
  }).sort(byDateDesc);
  $('inqCount').textContent=list.length+'건 표시 / 전체 '+S.inq.length+'건';
  $('inqList').innerHTML=list.length?list.map(inqItem).join(''):'<p class="empty">'+(S.inq.length?'조건에 맞는 문의가 없습니다.':'접수된 문의가 없습니다.')+'</p>';
}
$('iqStatus').addEventListener('change',renderInqList);
$('iqQ').addEventListener('input',renderInqList);
$('inqList').addEventListener('click',function(ev){
  var b=ev.target.closest('[data-inq]');if(!b)return;
  S.inqId=b.getAttribute('data-inq');renderInqList();renderInqDetail();
  if(window.innerWidth<900)$('inqDetail').scrollIntoView({behavior:'smooth',block:'start'});
});
function renderInqDetail(){
  var box=$('inqDetail');
  var p=S.inqId!=null?findInq(S.inqId):null;
  if(!p){box.innerHTML='<p class="empty">왼쪽 목록에서 문의를 선택해 주세요.</p>';return;}
  var email=String(p.email||'');
  var emailHtml=/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email)?'<a href="mailto:'+esc(encodeURIComponent(email).replace(/%40/g,'@'))+'">'+esc(email)+'</a>':esc(email||'-');
  var cur=ST[p.status]?p.status:'new';
  box.innerHTML='<div class="card-h"><h3>'+esc(p.subject||'(제목 없음)')+'</h3>'+stBadge(cur)+'</div>'+
    '<dl class="dl">'+
    '<dt>문의 유형</dt><dd>'+esc(p.type||'-')+'</dd>'+
    '<dt>이름</dt><dd>'+esc(p.name||'-')+'</dd>'+
    '<dt>이메일</dt><dd>'+emailHtml+'</dd>'+
    '<dt>소속 기관</dt><dd>'+esc(p.organization||'-')+'</dd>'+
    '<dt>접수일</dt><dd>'+esc(fmtDate(p.created_at))+'</dd>'+
    '</dl>'+
    '<h4>문의 내용</h4><div class="msg">'+esc(p.message||'(내용 없음)')+'</div>'+
    '<div class="status-row"><label for="iqSet" class="sm" style="font-weight:700">처리 상태</label>'+
    '<select id="iqSet">'+['new','reviewing','done'].map(function(k){return '<option value="'+k+'"'+(k===cur?' selected':'')+'>'+esc(ST[k])+'</option>';}).join('')+'</select>'+
    '<button type="button" class="btn primary sm" id="iqSave">상태 저장</button></div>'+
    '<div class="actions"><button type="button" class="btn danger" id="iqDel">영구 삭제</button></div>';
}
$('inqDetail').addEventListener('click',function(ev){
  var t=ev.target;
  if(t.id==='iqSave'){
    var p=findInq(S.inqId);if(!p)return;
    var v=$('iqSet').value;if(!ST[v])return;
    var id=p.id;
    busy(t,async function(){
      await api('PATCH','/api/admin/inquiries/'+encodeURIComponent(id),{status:v});
      var q=findInq(id);if(q)q.status=v;
      toast('처리 상태를 "'+ST[v]+'"(으)로 바꿨습니다.');
      renderInqList();renderInqDetail();refreshStats();
    });
  }else if(t.id==='iqDel'){
    var p2=findInq(S.inqId);if(!p2)return;
    if(!confirm('이 문의를 영구 삭제할까요?\n문의자: '+(p2.name||'-')+'\n삭제한 문의는 복구할 수 없습니다.'))return;
    var id2=p2.id;
    busy(t,async function(){
      await api('DELETE','/api/admin/inquiries/'+encodeURIComponent(id2));
      S.inq=S.inq.filter(function(x){return !same(x.id,id2);});S.inqId=null;
      toast('문의를 삭제했습니다.');
      renderInqList();renderInqDetail();refreshStats();
    });
  }
});

/* ---------- 파일 ---------- */
async function loadFiles(silent){
  try{var d=await api('GET','/api/admin/files');S.files=arr(d.items);S.filesLoaded=true;renderFiles();renderDatalist();}
  catch(e){if(!silent){if(!S.files.length)$('fileList').innerHTML='<p class="empty">파일 목록을 불러오지 못했습니다.</p>';handle(e);}else if(e&&e.handled){}}
}
function isImg(f){return /^image\//i.test(String(f.mime||''))||/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(String(f.name||''));}
function extOf(n){var m=String(n||'').match(/\.([a-z0-9]{1,6})$/i);return m?m[1].toUpperCase():'FILE';}
function renderDatalist(){
  $('fileUrls').innerHTML=S.files.map(function(f){var u=safeUrl(f.url);return u?'<option value="'+esc(u)+'">'+esc(f.name||'')+'</option>':'';}).join('');
}
function renderFiles(){
  var q=$('fiQ').value.trim().toLowerCase();
  var list=S.files.filter(function(f){return !q||String(f.name||'').toLowerCase().indexOf(q)>=0;}).sort(byDateDesc);
  $('fileCount').textContent=list.length+'개 표시 / 전체 '+S.files.length+'개';
  if(!list.length){$('fileList').innerHTML='<p class="empty" style="grid-column:1/-1">'+(S.files.length?'검색 결과가 없습니다.':'아직 올린 파일이 없습니다.')+'</p>';return;}
  $('fileList').innerHTML=list.map(function(f){
    var u=safeUrl(f.url),img=isImg(f)&&u;
    return '<div class="fcard"><div class="fthumb">'+(img?'<img src="'+esc(u)+'" alt="" loading="lazy">':'<span class="fext">'+esc(extOf(f.name))+'</span>')+'</div>'+
      '<div class="fbody"><span class="fname">'+esc(f.name||'(이름 없음)')+'</span>'+
      '<span class="fmeta">'+esc(fmtSize(f.size))+' · '+esc(fmtDate(f.created_at))+'</span>'+
      '<div class="fbtns">'+
      (u?'<button type="button" class="btn sm" data-copy="'+esc(u)+'">주소 복사</button>'+
        '<button type="button" class="btn sm" data-ins="att" data-url="'+esc(u)+'">첨부파일로 넣기</button>'+
        (img?'<button type="button" class="btn sm" data-ins="img" data-url="'+esc(u)+'">대표 이미지로 넣기</button>':'')+
        '<a class="btn sm ghost" href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">열기</a>':'')+
      '<button type="button" class="btn sm danger" data-delfile="'+esc(f.id)+'">삭제</button>'+
      '</div></div></div>';
  }).join('');
}
$('fiQ').addEventListener('input',renderFiles);
$('fileList').addEventListener('click',function(ev){
  var ins=ev.target.closest('[data-ins]');
  if(ins){
    var u=safeUrl(ins.getAttribute('data-url'));if(!u)return;
    var field=ins.getAttribute('data-ins')==='img'?'peImg':'peAtt';
    $(field).value=u;setDirty(true);updateUrlHelpers();
    go('posts');
    toast(field==='peImg'?'대표 이미지 주소를 편집 중인 게시물에 넣었습니다.':'첨부파일 주소를 편집 중인 게시물에 넣었습니다.');
    setTimeout(function(){$(field).focus();},60);
    return;
  }
  var del=ev.target.closest('[data-delfile]');
  if(del){
    var id=del.getAttribute('data-delfile');
    var f=null;for(var i=0;i<S.files.length;i++)if(same(S.files[i].id,id))f=S.files[i];
    if(!confirm('파일 "'+(f&&f.name?f.name:id)+'"을(를) 삭제할까요?\n이 파일을 쓰는 게시물·페이지의 링크와 이미지가 깨집니다. 되돌릴 수 없습니다.'))return;
    busy(del,async function(){
      await api('DELETE','/api/admin/files/'+encodeURIComponent(id));
      toast('파일을 삭제했습니다.');
      await loadFiles(false);refreshStats();
    });
  }
});
function readB64(file){
  return new Promise(function(resolve,reject){
    var r=new FileReader();
    r.onload=function(){var s=String(r.result||'');var i=s.indexOf(',');resolve(i>=0?s.slice(i+1):s);};
    r.onerror=function(){reject(new Error('"'+file.name+'" 파일을 읽지 못했습니다.'));};
    r.readAsDataURL(file);
  });
}
$('upForm').addEventListener('submit',function(ev){
  ev.preventDefault();hideAlert();
  var files=Array.prototype.slice.call($('upFile').files||[]);
  if(!files.length){showError('올릴 파일을 선택해 주세요.');return;}
  if(!$('upAgree').checked){showError('개인정보가 없는 공개용 파일인지 확인한 뒤 체크해 주세요.');$('upAgree').focus();return;}
  var big=files.filter(function(f){return f.size>MAX_FILE;});
  if(big.length){showError('8MB를 넘는 파일은 올릴 수 없습니다:\n'+big.map(function(f){return f.name+' ('+fmtSize(f.size)+')';}).join('\n'));return;}
  var empty=files.filter(function(f){return !f.size;});
  if(empty.length){showError('빈 파일은 올릴 수 없습니다: '+empty.map(function(f){return f.name;}).join(', '));return;}
  busy($('upBtn'),async function(){
    var ok=0,fails=[];
    for(var i=0;i<files.length;i++){
      var f=files[i];
      $('upStatus').textContent='올리는 중 ('+(i+1)+'/'+files.length+'): '+f.name;
      try{
        var data=await readB64(f);
        await api('POST','/api/admin/files',{name:f.name,mime:f.type||'application/octet-stream',data:data});
        ok++;
      }catch(e){if(e&&e.handled)throw e;fails.push(f.name+': '+(e&&e.message?e.message:'실패'));}
    }
    $('upStatus').textContent=ok+'개 업로드 완료'+(fails.length?', '+fails.length+'개 실패':'');
    if(fails.length)showError('일부 파일을 올리지 못했습니다.\n'+fails.join('\n'));
    if(ok){toast(ok+'개 파일을 올렸습니다.');$('upFile').value='';$('upAgree').checked=false;}
    await loadFiles(false);refreshStats();
  });
});

/* ---------- 설정 ---------- */
$('expBtn').addEventListener('click',function(){
  if(!confirm('백업 파일에는 문의자 이름·이메일 등 개인정보가 들어 있습니다.\n안전한 곳에만 보관하고 공유하지 마세요. 내려받을까요?'))return;
  busy($('expBtn'),async function(){
    var text=await api('GET','/api/admin/export',undefined,{rawText:true});
    var href=null,data=null;
    try{data=JSON.parse(text);}catch(e){throw new Error('백업 응답이 올바른 JSON 형식이 아닙니다.');}
    if(data&&data.ok===false)throw new Error(String(data.error||data.message||'백업을 만들지 못했습니다.'));
    if(data&&typeof data.url==='string'&&Object.keys(data).length<=3&&safeUrl(data.url))href=safeUrl(data.url);
    var a=document.createElement('a');
    var blobUrl=null;
    if(href){a.href=href;}
    else{blobUrl=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.href=blobUrl;}
    a.download='esg-forum-backup-'+today()+'.json';a.rel='noopener';
    document.body.appendChild(a);a.click();a.remove();
    if(blobUrl)setTimeout(function(){URL.revokeObjectURL(blobUrl);},4000);
    toast('백업 파일을 내려받았습니다. 안전하게 보관해 주세요.');
  });
});
$('pwForm').addEventListener('submit',function(ev){
  ev.preventDefault();hideAlert();
  var cur=$('pwCur').value,nw=$('pwNew').value,nw2=$('pwNew2').value;
  if(!cur){showError('현재 비밀번호를 입력해 주세요.');$('pwCur').focus();return;}
  if(nw.length<12){showError('새 비밀번호는 12자 이상이어야 합니다.');$('pwNew').focus();return;}
  if(nw!==nw2){showError('새 비밀번호와 확인 값이 다릅니다.');$('pwNew2').focus();return;}
  if(nw===cur){showError('새 비밀번호가 현재 비밀번호와 같습니다.');$('pwNew').focus();return;}
  busy($('pwBtn'),async function(){
    try{await api('POST','/api/admin/password',{currentPassword:cur,newPassword:nw},{no401:true});}
    catch(e){
      if(e.status===401){
        var s=null;try{s=await api('GET','/api/admin/session',undefined,{no401:true});}catch(e2){}
        if(s&&s.authenticated===true){showError('현재 비밀번호가 올바르지 않습니다.');$('pwCur').select();return;}
        toLogin('로그인이 필요합니다. 다시 로그인해 주세요.','err');return;
      }
      throw e;
    }
    $('pwCur').value='';$('pwNew').value='';$('pwNew2').value='';
    toast('비밀번호를 변경했습니다.');
  });
});

boot();
})();
`;

function nonceAttr(nonce) {
  const n = String(nonce || '');
  return /^[A-Za-z0-9+/=_-]{8,200}$/.test(n) ? ' nonce="' + n + '"' : '';
}

/**
 * 관리자 화면 전체 HTML을 돌려준다.
 * @param {{nonce?: string}} [opts] CSP nonce(선택)
 * @returns {string}
 */
export function adminPage(opts = {}) {
  const na = nonceAttr(opts && opts.nonce);
  return '<!DOCTYPE html>\n<html lang="ko">\n<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
    '<meta name="robots" content="noindex, nofollow, noarchive">\n' +
    '<meta name="referrer" content="same-origin">\n' +
    '<meta name="theme-color" content="#0f3d2e">\n' +
    '<meta name="format-detection" content="telephone=no">\n' +
    '<title>관리자 | ESG정원정책포럼</title>\n' +
    '<style' + na + '>' + CSS + '</style>\n' +
    '</head>\n<body>\n' + BODY + '\n<script' + na + '>' + CLIENT + '</script>\n</body>\n</html>';
}

export default adminPage;
