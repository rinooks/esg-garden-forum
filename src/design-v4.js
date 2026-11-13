export const designV4Styles = `
/* V4: reading-first refinement. Append after the original/layout/home styles.
   Header ownership is intentionally left to header-v4.js. Original copy,
   image order, anchor destinations and desktop column proportions stay intact. */
body{font-size:18px;line-height:1.85}
main{--v4-body:18px;--v4-line:#dce4da;--v4-muted:#566358;--v4-green:#286044}
.interior-banner{background:#f0f3ed;border-bottom:1px solid #dfe6dc;min-height:0}
.interior-banner>.wrap{padding-top:20px;padding-bottom:28px}
.breadcrumb{padding-top:0;margin-bottom:12px;font-size:14px;line-height:1.6;color:#5c6c5d;gap:10px}
.page-heading{padding:0}
.page-heading h1{font-family:var(--sans);font-size:36px;line-height:1.35;font-weight:700;letter-spacing:-.045em;margin:6px 0 0}
.interior-layout{grid-template-columns:210px minmax(0,1fr);gap:48px;padding-block:42px 88px}
.interior-content{min-width:0}
.sidebar{top:116px}
.sidebar-title{display:block!important;font-family:var(--sans);font-size:22px;font-weight:700;line-height:1.5;padding-bottom:20px;border-bottom:1px solid #acbcaa;color:#243e2d}
.sidebar nav a{position:relative;min-height:52px;padding:13px 14px;font-size:16px;line-height:1.6;border-bottom:1px solid #e0e6dc;border-radius:0;color:#566352}
.sidebar nav a.active{padding:13px 14px;background:#edf2e9;color:#244f36;font-weight:700;border-left:3px solid #39734e}
.sidebar nav a:hover{background:#f0f4ec;color:#244f36}
.sidebar nav a svg{width:16px;height:16px;flex-shrink:0}
.source-article,.original-layout,.post-body{font-size:var(--v4-body,18px);line-height:1.85;color:#303f35;letter-spacing:-.015em}
.original-layout{--v4-body:18px}
.original-layout .original-row{gap:28px;margin-bottom:30px}
.original-layout .original-col{min-width:0}
.original-layout .original-col>.original-row:has(>.original-col:only-child){margin-bottom:28px}
.source-article:has(.original-layout){padding:0;background:transparent;border:0}
.source-article>.original-layout{margin-bottom:0}
.source-article .original-text p,.original-layout .original-text li{font-size:var(--v4-body)!important;line-height:1.9!important}
.original-layout .original-text p{margin-bottom:20px}
.original-layout .original-text p:last-child{margin-bottom:0}
.original-layout .original-text li{margin-block:6px!important}
/* Only legacy small inline type is normalized. Large headings remain headings. */
.original-layout .original-text :is(div,span,p,li,td,th)[style*="font-size:12px"],
.original-layout .original-text :is(div,span,p,li,td,th)[style*="font-size:13px"],
.original-layout .original-text :is(div,span,p,li,td,th)[style*="font-size:14px"],
.original-layout .original-text :is(div,span,p,li,td,th)[style*="font-size:15px"],
.original-layout .original-text :is(div,span,p,li,td,th)[style*="font-size:16px"],
.original-layout .original-text :is(div,span,p,li,td,th)[style*="font-size:17px"]{font-size:var(--v4-body)!important;line-height:1.85!important}
.original-layout .original-text :is(div,p,span)[style*="font-size:20px"]{font-size:22px!important;line-height:1.65!important}
.original-layout .original-text :is(div,p,span)[style*="font-size:22px"]{font-size:25px!important;line-height:1.5!important;color:#214c35!important;letter-spacing:-.035em}
.original-layout .original-text [style*="border-bottom:2px solid"]{border-bottom:1px solid #b5c8b2!important;padding-bottom:16px!important}
.original-layout .original-text a{color:#286044;text-underline-offset:4px;overflow-wrap:anywhere}
.original-layout .original-image{border-radius:6px;background:transparent;box-shadow:none}
.original-layout .original-image>img{width:100%;height:auto!important;object-fit:contain}
.original-layout .original-anchor-row{height:0!important;min-height:0!important;margin:0!important;gap:0!important}
.original-layout .original-anchor-row *{height:0!important;margin:0!important;padding:0!important}
.original-layout .original-divider{margin:28px 0;border-top-color:#dce4d8}
.original-layout :is(span,div,section)[id]{scroll-margin-top:125px}
/* Greetings retain their portrait/text composition without framing the copy. */
:is(.original-ceo,.original-greeting) .original-text{color:#334338}
:is(.original-ceo,.original-greeting) .original-image{border:0;background:transparent}
.original-vision .original-image{padding:10px;border:1px solid #e0e6db;background:#fff;border-radius:8px}
.original-vision .original-image img,.original-oraganization .original-image img{width:100%;height:auto!important;max-height:none;object-fit:contain}
.original-oraganization .original-image{padding:18px;background:#fff;border:1px solid #e0e6db;border-radius:8px;overflow:visible}
/* Profile cards: authentic images only; all six text-only entries remain visible. */
.original-members .original-people-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-bottom:24px;align-items:stretch}
.original-members .original-people-row>.original-col{display:block;flex:initial!important;width:auto;margin:0;min-width:0;border:0;border-bottom:1px solid #dce4d8;border-radius:0;overflow:visible;background:transparent;padding:0 0 24px}
.original-members .original-people-row .original-text>div>div{display:flex;flex-direction:column;align-items:flex-start;width:100%!important;height:auto!important;min-height:0;padding:18px 0 0!important;background:transparent!important;box-shadow:none!important;border:0!important;border-radius:0!important}
.original-members .original-people-row .original-text>div>div>div:first-child:has(img){display:flex;align-items:flex-end;justify-content:flex-start;width:100%;min-height:126px;margin:0 0 18px!important;padding:0!important;text-align:left!important;background:transparent}
.original-members .original-people-row .original-text img{display:block;width:112px!important;height:126px!important;max-width:100%;margin:0;object-fit:contain;object-position:left bottom;border-radius:3px}
.original-members .original-people-row .original-text [style*="margin-top:-33px"],
.original-members .original-people-row .original-text [style*="margin-top: -33px"]{margin-top:0!important;width:100%;text-align:left}
.original-members .original-people-row .original-text [style*="margin-top:-33px"]>div:first-child,
.original-members .original-people-row .original-text [style*="margin-top: -33px"]>div:first-child{font-size:20px!important;line-height:1.5!important;font-weight:700!important;color:#243f2d!important;margin:0 0 8px!important}
.original-members .original-people-row .original-text [style*="margin-top:-33px"]>div:last-child,
.original-members .original-people-row .original-text [style*="margin-top: -33px"]>div:last-child{font-size:16px!important;line-height:1.8!important;font-weight:400;color:#59665a!important}
.original-members .original-people-row .original-text>div>div:not(:has(img)){padding-top:20px!important;min-height:0}
.original-members .original-text a[href^="#original-"]{width:50%!important;min-height:52px;display:flex!important;align-items:center;justify-content:center;padding:14px 12px!important;border:0!important;border-bottom:2px solid #2b6445!important;border-radius:0!important;background:#eef3e9!important;color:#254f37!important;font-size:17px!important;line-height:1.5!important;text-decoration:none;box-shadow:none}
.original-members .original-text a[href="#original-officers"]{background:transparent!important;color:#526350!important;border-bottom-color:#cbd8c5!important}
/* Legacy text-block cards are refined by actual source signatures, not all divs. */
:is(.original-business,.original-mainbusiness,.original-local,.original-cooperate,.original-participants,.original-policy,.original-membership,.original-memberndonation,.original-build) .original-text>div>div[style*="border:1px solid"]{padding:30px 32px!important;border:1px solid #dce5d7!important;border-radius:10px!important;background:#f6f8f1!important;box-shadow:none!important;color:#304034!important}
:is(.original-business,.original-mainbusiness,.original-membership,.original-memberndonation) .original-text div:has(>div[style*="display:flex"]>div[style*="min-width:36px"]){padding:26px 28px!important;margin-bottom:18px!important;border:1px solid #dfe6da!important;border-radius:10px!important;background:#fff!important;box-shadow:none!important}
:is(.original-business,.original-mainbusiness,.original-membership,.original-memberndonation) .original-text div[style*="display:flex"]:has(>div[style*="min-width:36px"]){display:flex!important;gap:20px!important;align-items:flex-start!important;background:transparent!important}
:is(.original-business,.original-mainbusiness,.original-membership,.original-memberndonation) .original-text div[style*="min-width:36px"]{min-width:34px!important;width:auto!important;height:auto!important;flex:0 0 34px;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;color:#387348!important;font-size:22px!important;line-height:1.5!important}
:is(.original-business,.original-mainbusiness,.original-membership,.original-memberndonation) .original-text div[style*="flex:1 1"]{min-width:0}
:is(.original-business,.original-mainbusiness,.original-membership,.original-memberndonation) .original-text div[style*="flex:1 1"]>div[style*="font-weight:700"]{font-size:20px!important;line-height:1.6!important;color:#263f2f!important;margin-bottom:10px!important}
:is(.original-membership,.original-memberndonation) .original-text div[style*="border-left:4px"]{padding:24px 28px!important;border-left:3px solid #54815a!important;border-radius:6px!important;background:#eff4e9!important;line-height:1.9}
.original-history .original-text div[style*="border-left:2px"]{position:relative;padding:0 0 26px 28px!important;margin:0!important;border-color:#d3dfcc!important}
.original-history .original-text div[style*="width:12px"]{position:absolute;left:-6px;top:10px;width:10px!important;height:10px!important;min-height:0;border-radius:50%!important;background:#467851!important;font-size:0!important;line-height:0!important}
.original-history .original-text div[style*="font-size:18px"]{font-size:22px!important;line-height:1.5!important;font-weight:700;color:#2d6444!important;margin-bottom:9px!important}
.source-article table{font-size:16px;line-height:1.8;border-color:#dce4d8;background:#fff}
.source-article :is(td,th){padding:15px 18px;border-color:#dce4d8}
.source-article th{background:#f1f5ec;color:#284b34;font-weight:650}
.original-media-grid{gap:28px}
.original-media-grid img{object-fit:contain;background:#f0f2eb;border-radius:6px}
.original-media-grid figcaption{font-size:16px;line-height:1.8;padding-top:14px;color:#526350}
/* Forms, actions and boards use stable touch targets and readable metadata. */
main .btn,main .text-link{font-size:16px;line-height:1.6}
main .btn{min-height:52px;border-radius:6px;padding:14px 23px;transform:none;white-space:normal;text-align:left}
main .btn:hover{transform:none}
main :is(a,button,input,select,textarea):focus-visible,.site-footer a:focus-visible{outline:3px solid #76954f;outline-offset:4px}
.interior-cta{padding:30px 32px;background:#edf3e6;border:1px solid #d7e2cf;border-radius:8px;gap:28px;margin-top:40px}
.interior-cta h2{font-size:24px;line-height:1.6;font-weight:650}
.interior-cta .eyebrow{font-size:12px;line-height:1.6;color:#557048}
.interior-cta .btn{font-size:16px;min-height:52px}
.board-toolbar{margin-bottom:24px;padding-bottom:22px;border-color:#c7d3bf}
.board-toolbar>p{font-size:16px;line-height:1.8}
.board-toolbar input{font-size:16px;min-height:46px}
.original-post-list{border-top:2px solid #305a3c}
.original-post-head,.original-post-row{grid-template-columns:42px 100px minmax(0,1fr) 108px;gap:18px;padding:20px 14px;border-bottom-color:#dfe6da}
.original-post-head{font-size:14px;background:#f0f4e9;color:#53624c}
.original-post-row .post-list-title{font-size:18px;font-weight:550;line-height:1.75;overflow-wrap:anywhere}
.original-post-row:hover{background:#f0f5eb}
.post-list-category{font-size:14px;line-height:1.6;color:#45683c}
.post-list-date{font-size:15px;color:#63705e;white-space:nowrap}
.post-list-number{font-size:14px;color:#6b7766}
.post-detail{padding:30px 32px;border-top-color:#305a3c;border-radius:0 0 8px 8px}
.post-meta{font-size:15px;line-height:1.7;gap:16px;flex-wrap:wrap}
.post-body p,.post-body li{font-size:var(--v4-body,18px)!important;line-height:1.9!important}
.post-body :is(p,span,div)[style*="font-size:14px"],.post-body :is(p,span,div)[style*="font-size:16px"]{font-size:var(--v4-body,18px)!important}
.news-card{box-shadow:none;border-color:#dce4d8;border-radius:8px}
.news-card-content,.board-section .news-card-content{padding:26px}
.news-card h3,.board-section .news-card h3{font-size:23px;line-height:1.55}
.news-card p{font-size:17px;line-height:1.85}
.news-meta{font-size:14px;line-height:1.7}
.inquiry-form{padding:32px;border:1px solid #dce4d8;border-radius:10px;background:#fff}
.field label{font-size:16px;line-height:1.6;margin-bottom:10px}
.field :is(input,select,textarea){font-size:16px;line-height:1.7;min-height:50px;padding:13px 15px;border-radius:5px;border-color:#bccbb7}
.field textarea{line-height:1.85;min-height:180px}
.consent-box{font-size:15px;line-height:1.85}
.consent-box h3{font-size:18px}
.consent-label{font-size:15px;line-height:1.85}
.form-bottom p,.form-result{font-size:14px;line-height:1.8}
.contact-lead p{font-size:18px;line-height:1.85}
/* Home sequence and photographs are unchanged. */
.original-home .original-home-purpose{padding:80px 0 60px}
.original-home .original-home-statement{font-family:var(--sans);font-size:32px;font-weight:650;line-height:1.65;letter-spacing:-.04em}
.original-home .original-home-pillars{margin-top:44px}
.original-home .original-home-pillar{padding-inline:30px}
.original-home .original-home-pillar-heading{gap:18px;margin-bottom:22px}
.original-home .original-home-pillar h3{font-size:24px;line-height:1.5;font-weight:700}
.original-home .original-home-letter{font-size:54px;font-weight:500;color:#3c6944}
.original-home .original-home-pillar h4{font-size:20px;line-height:1.7;margin-bottom:14px}
.original-home .original-home-pillar p{font-size:17px;line-height:1.9;color:#53634f}
.original-home .original-home-founding-figure img{width:100%;height:auto;aspect-ratio:auto;object-fit:contain;border-radius:6px}
.original-home .original-home-founding-figure figcaption{font-size:14px;line-height:1.7;color:#5c6a56}
.original-home .original-home-strategy{padding:74px 0 82px}
.original-home .original-home-cards{gap:26px;margin-top:42px}
.original-home .original-home-card{background:#fff;border:1px solid #dfe6d8;border-radius:8px;box-shadow:none;display:flex;flex-direction:column}
.original-home .original-home-card-image{background:#edf0e7;aspect-ratio:16/10;overflow:hidden;flex:none}
.original-home .original-home-card-image img{display:block;aspect-ratio:auto;object-fit:cover;object-position:center;width:100%;height:100%}
.original-home .original-home-card-copy{padding:26px 25px 30px;flex:1}
.original-home .original-home-card-label{font-size:14px;line-height:1.6;color:#4c7041;letter-spacing:.015em}
.original-home .original-home-card h3{font-size:24px;line-height:1.55;min-height:75px;font-weight:650;margin-bottom:15px}
.original-home .original-home-card-copy>p:last-child{font-size:17px;line-height:1.9;color:#53634f}
.original-home .original-home-why{padding:76px 0 68px;background:#1f4633}
.original-home .original-home-why-grid{gap:60px}
.original-home .original-home-why-heading h2{font-size:38px;line-height:1.5}
.original-home .original-home-why-heading>p{font-size:24px;line-height:1.8;color:#f0f3e8}
.original-home .original-home-why-body p{font-size:17px;line-height:1.9;color:#e1e9dc}
.original-home .original-home-vision figcaption{font-size:14px;line-height:1.8;color:#d1dec9}
.original-home .original-home-contact{padding:70px 0 76px}
.original-home .original-home-contact-label{font-size:16px;letter-spacing:.03em}
.original-home .original-home-contact h2{font-size:36px;line-height:1.6}
.original-home .original-home-contact-content>p:not(.original-home-contact-label){font-size:18px;line-height:1.85;max-width:740px;margin-inline:auto}
.original-home .original-home-contact-button{font-size:16px;min-height:54px;min-width:184px;padding:14px 24px;border-radius:6px;gap:36px;margin-top:28px}
/* Footer only: never change header logo sizing here. */
.site-footer{padding:52px 0 30px;background:#eef1e9}
.site-footer .brand-original img{width:210px;max-width:100%;height:auto;max-height:none;object-fit:contain}
.site-footer .footer-top{padding-bottom:30px;align-items:center;gap:28px;border-bottom-color:#d1dbcb}
.site-footer .footer-links{font-size:15px;line-height:1.8;gap:26px;flex-wrap:wrap}
.site-footer .footer-bottom{font-size:14px;line-height:1.9;padding-top:25px;color:#53624f;gap:32px}
.site-footer .footer-bottom p{margin:5px 0}
.site-footer .footer-bottom address{font-size:14px;line-height:1.9;overflow-wrap:anywhere}
.site-footer .footer-right{font-size:14px;line-height:1.8;gap:18px}
.site-footer :is(.copyright,small){font-size:12px;line-height:1.8}
@media(max-width:1100px){
.interior-layout{grid-template-columns:185px minmax(0,1fr);gap:30px}
.original-members .original-people-row{gap:18px}
.original-home .original-home-pillar{padding-inline:23px}
.original-home .original-home-card-copy{padding:23px 21px 26px}
.original-home .original-home-card h3{font-size:22px;min-height:70px}
}
@media(max-width:900px){
.interior-layout{display:block;padding-top:28px;padding-bottom:68px}
.sidebar{position:static;margin-bottom:30px}
.sidebar-title{font-size:19px;padding-bottom:12px;margin-bottom:8px;border-bottom:0}
.sidebar nav{display:flex;gap:4px;overflow-x:auto;padding:0 0 8px;border-bottom:1px solid #d9e2d3;scrollbar-width:thin}
.sidebar nav a,.sidebar nav a.active{flex:none;min-height:48px;white-space:nowrap;font-size:16px;line-height:1.6;padding:12px 16px;border:0;border-bottom:3px solid transparent;border-radius:0;background:transparent;color:#53634e}
.sidebar nav a.active{border-bottom-color:#39734e;color:#244f36;background:#edf2e9}
.sidebar nav a svg{display:none}
.original-layout .original-row{gap:22px}
.original-members .original-people-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.original-home .original-home-why-grid{gap:34px}
.original-home .original-home-pillar-heading{gap:12px}
.original-home .original-home-pillar h3{font-size:22px}
.original-home .original-home-card h3{font-size:21px}
.original-home .original-home-card-copy{padding:22px 19px 26px}
}
@media(max-width:760px){
.original-home .original-home-statement{font-size:27px;line-height:1.65}
.original-home .original-home-purpose{padding:52px 0 40px}
.original-home .original-home-pillars{grid-template-columns:1fr;margin-top:30px}
.original-home .original-home-pillar,.original-home .original-home-pillar:first-child,.original-home .original-home-pillar:last-child{padding:25px 0;border-left:0;border-top:1px solid #d9e2d2}
.original-home .original-home-pillar:last-child{padding-bottom:0}
.original-home .original-home-pillar h3{font-size:24px}
.original-home .original-home-pillar h4{font-size:19px}
.original-home .original-home-pillar p{font-size:17px}
.original-home .original-home-founding .original-home-wrap{width:calc(100% - 40px)}
.original-home .original-home-founding-figure figcaption{padding-inline:0}
.original-home .original-home-strategy{padding:48px 0 56px}
.original-home .original-home-cards{grid-template-columns:1fr;gap:24px;margin-top:30px}
.original-home .original-home-card h3{font-size:24px;min-height:0}
.original-home .original-home-card-image img{aspect-ratio:auto;object-fit:cover;object-position:center;height:100%}
.original-home .original-home-card-copy{padding:24px}
.original-home .original-home-why{padding:50px 0}
.original-home .original-home-why-grid{grid-template-columns:1fr;gap:25px}
.original-home .original-home-why-heading h2{font-size:32px}
.original-home .original-home-why-heading>p{font-size:22px}
.original-home .original-home-contact h2{font-size:30px}
}
@media(max-width:640px){
body{font-size:16px;line-height:1.85}
main,.original-layout{--v4-body:16px}
.interior-banner>.wrap{padding-top:18px;padding-bottom:23px}
.breadcrumb{font-size:13px;line-height:1.6;gap:8px;margin-bottom:10px}
.page-heading{padding:0}
.page-heading h1{font-size:30px;line-height:1.4;margin:4px 0 0;letter-spacing:-.04em}
.interior-layout{padding-block:24px 56px}
.sidebar{margin-bottom:26px}
.sidebar-title{font-size:18px;display:block!important}
.sidebar nav a,.sidebar nav a.active{font-size:15px;padding:11px 13px;min-height:46px}
.original-layout .original-row{display:block;margin-bottom:25px}
.original-layout .original-col{width:100%;margin-bottom:24px}
.original-layout .original-col:last-child{margin-bottom:0}
.original-layout .original-col>.original-row:has(>.original-col:only-child){margin-bottom:24px}
.original-layout .original-text p{margin-bottom:18px;line-height:1.9!important}
.original-layout .original-text :is(div,p,span)[style*="font-size:20px"]{font-size:20px!important}
.original-layout .original-text :is(div,p,span)[style*="font-size:22px"]{font-size:23px!important}
.original-ceo>.original-row>.original-col:first-child,.original-home.original-layout>.original-row>.original-col:first-child{position:static;max-width:200px;margin:0 auto 28px}
.original-greeting .original-image{max-width:190px;margin:0 auto 26px}
.original-vision .original-image{padding:6px;margin:0 auto 22px;max-width:100%}
.original-oraganization .original-image{padding:8px;overflow:visible}
.original-members .original-people-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px 18px;margin-bottom:20px}
.original-members .original-people-row>.original-col{width:auto;padding-bottom:20px;margin:0}
.original-members .original-people-row .original-text>div>div{padding:12px 0 0!important;min-height:0}
.original-members .original-people-row .original-text>div>div>div:first-child:has(img){min-height:116px;margin-bottom:15px!important;text-align:left!important}
.original-members .original-people-row .original-text img{width:104px!important;height:116px!important;object-fit:contain}
.original-members .original-people-row .original-text [style*="margin-top:-33px"]>div:first-child,
.original-members .original-people-row .original-text [style*="margin-top: -33px"]>div:first-child{font-size:19px!important}
.original-members .original-people-row .original-text [style*="margin-top:-33px"]>div:last-child,
.original-members .original-people-row .original-text [style*="margin-top: -33px"]>div:last-child{font-size:16px!important;line-height:1.8!important}
.original-members .original-text a[href^="#original-"]{font-size:16px!important;padding:13px 10px!important;min-height:50px}
:is(.original-business,.original-mainbusiness,.original-local,.original-cooperate,.original-participants,.original-policy,.original-membership,.original-memberndonation,.original-build) .original-text>div>div[style*="border:1px solid"]{padding:22px 20px!important}
:is(.original-business,.original-mainbusiness,.original-membership,.original-memberndonation) .original-text div:has(>div[style*="display:flex"]>div[style*="min-width:36px"]){padding:22px 18px!important;margin-bottom:16px!important;border-radius:8px!important}
:is(.original-business,.original-mainbusiness,.original-membership,.original-memberndonation) .original-text div[style*="display:flex"]:has(>div[style*="min-width:36px"]){gap:13px!important}
:is(.original-business,.original-mainbusiness,.original-membership,.original-memberndonation) .original-text div[style*="min-width:36px"]{font-size:20px!important;min-width:28px!important;flex-basis:28px}
:is(.original-business,.original-mainbusiness,.original-membership,.original-memberndonation) .original-text div[style*="flex:1 1"]>div[style*="font-weight:700"]{font-size:18px!important}
:is(.original-membership,.original-memberndonation) .original-text div[style*="border-left:4px"]{padding:20px!important}
.original-history .original-text div[style*="font-size:18px"]{font-size:21px!important}
.source-article table{display:block;overflow-x:auto;font-size:16px;word-break:normal}
.source-article :is(td,th){padding:12px;min-width:85px}
.original-media-grid{grid-template-columns:1fr;gap:24px}
.original-media-grid figcaption{font-size:15px}
.interior-cta{display:flex;flex-direction:column;align-items:flex-start;padding:24px 22px;gap:22px;margin-top:30px}
.interior-cta h2{font-size:22px;margin:8px 0 0}
.interior-cta .btn{font-size:16px;min-height:52px;margin:0}
.board-toolbar{gap:12px;flex-wrap:wrap;padding-bottom:18px;margin-bottom:20px}
.board-toolbar>p{font-size:15px;padding-top:0}
.board-toolbar form{min-width:0;max-width:100%}
.original-post-head{display:none}
.original-post-row{grid-template-columns:1fr 96px;gap:9px 12px;padding:20px 2px}
.original-post-row .post-list-title{font-size:17px;line-height:1.75;grid-column:1/-1;grid-row:1}
.post-list-number{display:none}
.post-list-category{grid-column:1;grid-row:2;font-size:14px}
.post-list-date{grid-column:2;grid-row:2;font-size:14px;text-align:right}
.post-detail{padding:24px 18px}
.post-meta{font-size:14px;padding-bottom:20px;margin-bottom:24px}
.post-body{font-size:16px;line-height:1.9}
.news-card-content,.board-section .news-card-content{padding:24px}
.news-card h3,.board-section .news-card h3{font-size:22px}
.news-card p{font-size:16px}
.inquiry-form{padding:24px 18px}
.field label{font-size:16px}
.field :is(input,select,textarea){font-size:16px;padding:13px;min-height:50px}
.consent-label{font-size:15px;line-height:1.85}
.form-bottom p{font-size:14px}
.form-bottom .btn{font-size:16px;min-height:52px}
.contact-lead p{font-size:16px;line-height:1.9}
.original-home .original-home-hero h1{font-size:clamp(36px,8.3vw,48px);line-height:1.6}
.original-home .original-home-statement{font-size:26px;line-height:1.65}
.original-home .original-home-why-body p{font-size:17px;line-height:1.9}
.original-home .original-home-vision blockquote{font-size:25px;line-height:1.75}
.original-home .original-home-vision figcaption{font-size:14px;line-height:1.8}
.original-home .original-home-contact{padding:52px 0 58px}
.original-home .original-home-contact-label{font-size:15px}
.original-home .original-home-contact h2{font-size:30px;line-height:1.6}
.original-home .original-home-contact-content>p:not(.original-home-contact-label){font-size:17px;line-height:1.9;margin-top:17px}
.original-home .original-home-contact-button{font-size:16px;min-height:54px}
.site-footer{padding:38px 0 26px}
.site-footer .brand-original img{width:190px}
.site-footer .footer-top{display:block;padding-bottom:25px}
.site-footer .footer-links{font-size:14px;line-height:1.8;gap:16px 24px;margin-top:24px}
.site-footer .footer-bottom{display:block;font-size:14px;line-height:1.9;padding-top:22px}
.site-footer .footer-bottom address{font-size:14px;line-height:1.9}
.site-footer .footer-right{align-items:flex-start;flex-direction:column;font-size:14px;gap:14px;margin-top:22px}
}
@media(max-width:380px){
.original-members .original-people-row{grid-template-columns:1fr;gap:20px}
.original-members .original-people-row .original-text>div>div{padding:16px 0 0!important}
.original-home .original-home-statement{font-size:24px}
.original-home .original-home-contact h2{font-size:27px}
}
@media(prefers-reduced-motion:reduce){main .btn,main .text-link,.original-home .original-home-contact-button{transition:none;transform:none}}
/* Keep text-only profiles aligned without inventing replacement portraits. */
.original-members .original-people-row .original-text>div>div>div:first-child:empty{min-height:126px;margin:0 0 18px!important}
@media(max-width:900px){.sidebar nav{scrollbar-width:none;-ms-overflow-style:none}.sidebar nav::-webkit-scrollbar{display:none;width:0;height:0}}
`;
