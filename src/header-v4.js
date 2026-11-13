/* One shared navigation panel (one column per group). No dependencies beyond route aliases. */
import { canonicalPath } from './navigation.js';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const localPath = value => {
  const path = String(value ?? '');
  return /^\/(?!\/)/.test(path) ? canonicalPath(path) : '/';
};
const cleanRoute = value => canonicalPath(String(value ?? '/').split(/[?#]/)[0].replace(/\/$/, '') || '/');

/* Feature menu: one group may set feature:true. It is drawn as a highlighted pill in the top bar and as an illustrated card in the panel. */
const featureIcon = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><polygon points="2,11 10,8.2 18,11 10,13.8" fill="#8cc16b"/><polygon points="2,11 10,13.8 18,11 12.4,18 7.6,18" fill="#8a6a4f"/><polygon points="6.6,10.4 10,2 13.4,10.4" fill="#2f6b4b"/></svg>';
const featureArrow = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const featureArt = '<svg class="v4-feature-art" viewBox="0 0 200 118" aria-hidden="true" focusable="false">'
  + '<path d="M18 38h34a9 9 0 0 0-10-10 12 12 0 0 0-22 3 7 7 0 0 0-2 7z" fill="#fff" opacity=".92"/>'
  + '<path d="M150 58h26a7 7 0 0 0-8-8 9 9 0 0 0-17 2 5 5 0 0 0-1 6z" fill="#fff" opacity=".8"/>'
  + '<ellipse cx="166" cy="22" rx="9" ry="11" fill="#204b39"/><path d="M166 11v22" stroke="#f3ecdc" stroke-width="3.4"/><path d="M160 31l4 6h4l4-6" fill="none" stroke="#6f543e" stroke-width=".8"/><rect x="163.6" y="37" width="4.8" height="4" fill="#8a6a4f"/>'
  + '<polygon points="34,72 166,72 132,96 106,114 84,100 58,94" fill="#8a6a4f"/><polygon points="106,114 132,96 166,72 112,72" fill="#6f543e"/><polygon points="58,94 84,100 76,72 34,72" fill="#9a7a5c"/>'
  + '<polygon points="26,68 58,55 108,51 152,55 174,68 152,78 100,82 50,78" fill="#8cc16b"/><polygon points="58,55 108,51 100,82 50,78 26,68" fill="#a3d07e"/>'
  + '<polygon points="60,74 86,66 96,69 70,79" fill="#e9dfc4"/><polygon points="120,68 138,64 152,70 134,75" fill="#8fcbe0"/>'
  + '<polygon points="44,68 52,46 60,68" fill="#2f6b4b"/><polygon points="58,72 65,54 72,72" fill="#3f8a5c"/><polygon points="136,62 143,43 150,62" fill="#2f6b4b"/><polygon points="150,68 156,52 162,68" fill="#e0a13a"/><polygon points="120,60 125,47 130,60" fill="#3f8a5c"/>'
  + '<rect x="84" y="46" width="26" height="18" fill="#f3ecdc"/><polygon points="80,47 97,34 114,47" fill="#2f6b4b"/><rect x="94" y="54" width="6" height="10" fill="#8a6a4f"/><rect x="87" y="51" width="4" height="4" fill="#b9d9e6"/><rect x="103" y="51" width="4" height="4" fill="#b9d9e6"/>'
  + '<rect x="108" y="31" width="10" height="33" fill="#e7dfcc"/><polygon points="106,32 113,20 120,32" fill="#204b39"/><circle cx="113" cy="40" r="2.8" fill="#fff" stroke="#204b39" stroke-width="1"/>'
  + '</svg>';
function navItem(group, current) {
  const state = group.current ? ' is-current' : '';
  const attrs = `href="${escapeHTML(group.href)}" data-v4-category="${group.index}" aria-controls="v4-header-panel" aria-expanded="false"${group.href === current ? ' aria-current="page"' : ''}`;
  if (group.feature) return `<a class="v4-header-category v4-header-feature${state}" ${attrs}>${featureIcon}<span>${escapeHTML(group.title)}</span><span class="v4-header-feature-badge" aria-hidden="true">3D</span></a>`;
  return `<a class="v4-header-category${state}" ${attrs}>${escapeHTML(group.title)}</a>`;
}
function panelColumn(group, current) {
  if (group.feature) return `<section class="v4-header-column v4-header-feature-col${group.current ? ' is-current' : ''}" data-v4-column="${group.index}" aria-labelledby="v4-header-title-${group.index}"><a class="v4-feature-card" href="${escapeHTML(group.href)}"${group.href === current ? ' aria-current="page"' : ''}>${featureArt}<div class="v4-feature-body">${group.label ? `<div class="v4-feature-eyebrow">${escapeHTML(group.label)}</div>` : ''}<h2 class="v4-feature-title" id="v4-header-title-${group.index}">${escapeHTML(group.title)}</h2>${group.desc ? `<div class="v4-feature-desc">${escapeHTML(group.desc)}</div>` : ''}<div class="v4-feature-cta">${escapeHTML(group.cta || '바로 가기')}${featureArrow}</div></div></a></section>`;
  return `<section class="v4-header-column${group.current ? ' is-current' : ''}" data-v4-column="${group.index}" aria-labelledby="v4-header-title-${group.index}"><h2 class="v4-header-column-title" id="v4-header-title-${group.index}">${escapeHTML(group.title)}</h2><ul class="v4-header-links">${(group.items || []).map(([path, title]) => `<li><a href="${escapeHTML(localPath(path))}"${cleanRoute(path) === current ? ' aria-current="page"' : ''}>${escapeHTML(title)}</a></li>`).join('')}</ul></section>`;
}

export function renderHeader({ groups = [], route = '/' } = {}) {
  const current = cleanRoute(route);
  const sections = groups.map((group, index) => ({
    ...group,
    index,
    href: localPath(group.items?.[0]?.[0] || group.path),
    current: cleanRoute(group.path) === current || (group.items || []).some(([path]) => cleanRoute(path) === current)
  }));
  return `<a class="skip-link" href="#main">본문으로 바로가기</a>
<header class="v4-header" data-v4-header>
  <div class="v4-header-inner">
    <a class="v4-header-brand" href="/" aria-label="대한민국 ESG정원정책포럼 홈"><img src="/assets/8d2ffcf55fb09.png" alt="ESG정원정책포럼 ESG Garden Policy Forum" width="327" height="72" fetchpriority="high"></a>
    <nav class="v4-header-nav" aria-label="주 메뉴">${sections.map(group => navItem(group, current)).join('')}</nav>
    <div class="v4-header-actions"><a class="v4-header-contact" href="/contact">함께하기<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a><button class="v4-header-toggle" type="button" aria-label="전체 메뉴 열기" aria-controls="v4-header-panel" aria-expanded="false"><span class="v4-header-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span></button></div>
  </div>
  <nav class="v4-header-panel v4-panel" id="v4-header-panel" aria-label="전체 메뉴">
    <div class="v4-header-panel-inner" style="--v4-cols:${sections.length}">${sections.map(group => panelColumn(group, current)).join('')}</div>
  </nav>
</header>
<div class="v4-header-overlay" data-v4-overlay aria-hidden="true"></div>
<noscript><style>.v4-header{position:relative}.v4-header .v4-header-panel{display:block;position:static;visibility:visible;opacity:1;transform:none;max-height:none;overflow:visible;pointer-events:auto}.v4-header-toggle{display:none!important}.v4-header-overlay{display:none!important}</style></noscript>`;
}

export const headerV4Styles = `
.v4-header{--v4-forest:#204b39;--v4-ink:#243f32;--v4-muted:#637267;--v4-line:#e1e5dc;--v4-paper:#fdfdf8;--v4-height:80px;position:sticky;top:0;z-index:110;background:var(--v4-paper);border-bottom:1px solid var(--v4-line);color:var(--v4-ink);font-family:var(--sans,Pretendard,-apple-system,BlinkMacSystemFont,'Malgun Gothic',sans-serif);isolation:isolate}
.v4-header,.v4-header *{box-sizing:border-box}
.v4-header a{text-decoration:none;color:inherit}
.v4-header button{font:inherit}
.v4-header-inner{width:100%;max-width:1360px;height:var(--v4-height);margin:0 auto;padding:0 32px;display:flex;align-items:center;gap:26px}
.v4-header-brand{display:flex;align-items:center;flex:0 0 218px;width:218px;min-height:48px}
.v4-header-brand img{display:block;width:218px;max-width:100%;height:auto;object-fit:contain}
.v4-header-nav{align-self:stretch;display:flex;align-items:stretch;justify-content:center;gap:clamp(16px,2.2vw,34px);flex:1;min-width:0;margin-left:auto}
.v4-header-category{position:relative;display:flex;align-items:center;justify-content:center;min-height:48px;padding:0 2px;white-space:nowrap;font-size:16px;font-weight:650;letter-spacing:-.035em;transition:color .16s}
.v4-header-category::after{content:'';position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--v4-forest);transform:scaleX(0);transition:transform .16s}
.v4-header-category.is-current{color:var(--v4-forest)}
.v4-header-category.is-current::after{transform:scaleX(.36);opacity:.4}
.v4-header-category:hover,.v4-header-category:focus-visible,.v4-header-category.is-pointed{color:#34654a}
.v4-header-category:hover::after,.v4-header-category:focus-visible::after,.v4-header-category.is-pointed::after{transform:scaleX(1);opacity:1}
.v4-header-actions{display:flex;align-items:center;gap:14px;flex:none}
.v4-header .v4-header-contact{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:42px;padding:9px 15px;border-radius:3px;background:var(--v4-forest);color:#fff;font-size:14px;font-weight:600;white-space:nowrap;transition:background .16s}
.v4-header-contact svg{width:17px;height:17px;flex:none}
.v4-header .v4-header-contact:hover{background:#326448}
.v4-header-toggle{display:flex;align-items:center;justify-content:center;flex:none;width:44px;height:44px;padding:10px;border:1px solid #d9e0d7;border-radius:3px;background:transparent;color:var(--v4-forest);cursor:pointer;transition:background .16s,border-color .16s}
.v4-header-toggle:hover,.v4-header-toggle[aria-expanded="true"]{background:#eef2e9;border-color:#abbca8}
.v4-header-toggle-icon{position:relative;display:block;width:20px;height:16px}
.v4-header-toggle-icon span{position:absolute;left:0;display:block;width:20px;height:1.5px;background:currentColor;transition:transform .18s,opacity .18s,top .18s}
.v4-header-toggle-icon span:nth-child(1){top:0}.v4-header-toggle-icon span:nth-child(2){top:7px}.v4-header-toggle-icon span:nth-child(3){top:14px}
.v4-header[data-v4-open="true"] .v4-header-toggle-icon span:nth-child(1){top:7px;transform:rotate(45deg)}
.v4-header[data-v4-open="true"] .v4-header-toggle-icon span:nth-child(2){opacity:0}
.v4-header[data-v4-open="true"] .v4-header-toggle-icon span:nth-child(3){top:7px;transform:rotate(-45deg)}
.v4-header-panel{position:absolute;top:100%;left:0;right:0;visibility:hidden;opacity:0;transform:translateY(-5px);pointer-events:none;background:var(--v4-paper);border-top:1px solid var(--v4-line);border-bottom:1px solid #d9e0d4;box-shadow:0 15px 28px #193b2b12;max-height:calc(100vh - var(--v4-height));max-height:calc(100dvh - var(--v4-height));overflow-y:auto;overscroll-behavior:contain;transition:opacity .16s,transform .16s,visibility .16s}
.v4-header[data-v4-open="true"] .v4-header-panel,.v4-header:not([data-v4-ready]):focus-within .v4-header-panel{visibility:visible;opacity:1;transform:none;pointer-events:auto}
.v4-header-panel-inner{max-width:1360px;margin:0 auto;padding:30px 32px 34px;display:grid;grid-template-columns:repeat(var(--v4-cols,5),minmax(0,1fr));gap:0}
.v4-header-column{min-width:0;padding:0 22px;border-left:1px solid var(--v4-line);transition:background .16s;scroll-margin-top:20px}
.v4-header-column:first-child{border-left:0;padding-left:0}.v4-header-column:last-child{padding-right:0}
.v4-header-column-title{font:inherit;font-size:17px;font-weight:700;letter-spacing:-.035em;line-height:1.6;margin:0 0 14px;color:var(--v4-forest);transition:color .16s}
.v4-header-column-title::after{content:'';display:block;width:22px;height:2px;background:#b7c8b0;margin-top:13px;transition:width .16s,background .16s}
.v4-header-column.is-pointed .v4-header-column-title::after,.v4-header-column:focus-within .v4-header-column-title::after{width:42px;background:var(--v4-forest)}
.v4-header-links{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1px}
.v4-header-links li{margin:0;padding:0}
.v4-header .v4-header-links a{display:flex;align-items:center;min-height:42px;padding:9px 10px;margin-left:-10px;border-radius:3px;color:#54655a;font-size:15px;line-height:1.65;letter-spacing:-.025em;transition:color .15s,background .15s}
.v4-header .v4-header-links a:hover,.v4-header .v4-header-links a:focus-visible{background:#eef3e9;color:var(--v4-forest)}
.v4-header .v4-header-links a[aria-current="page"]{background:#edf2e7;color:var(--v4-forest);font-weight:650}
.v4-header a:focus-visible,.v4-header button:focus-visible{outline:2px solid #6f925d;outline-offset:4px}
.v4-header-overlay{position:fixed;inset:80px 0 0;z-index:109;background:#10291e29;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .16s,visibility .16s}
.v4-header-overlay[data-v4-visible="true"]{opacity:1;visibility:visible;pointer-events:auto}
@media(max-width:1150px) and (min-width:1051px){.v4-header-inner{padding:0 24px;gap:20px}.v4-header-nav{gap:18px}.v4-header-actions{gap:10px}.v4-header-category{font-size:15px}.v4-header .v4-header-contact{padding:9px 12px;gap:8px}.v4-header-panel-inner{padding-left:24px;padding-right:24px}.v4-header-column{padding-left:18px;padding-right:18px}}
@media(max-width:1050px){.v4-header{--v4-height:72px}.v4-header-inner{height:72px;padding:0 24px;gap:18px;justify-content:space-between}.v4-header-brand{width:166px;flex-basis:166px}.v4-header-brand img{width:166px}.v4-header-nav{display:none}.v4-header-actions{margin-left:auto;gap:14px}.v4-header-panel{transform:none;-webkit-overflow-scrolling:touch}.v4-header-panel-inner{grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 28px;padding:28px 24px 36px}.v4-header-column,.v4-header-column:first-child,.v4-header-column:last-child{border-left:0;padding:0 0 16px;border-bottom:1px solid var(--v4-line)}.v4-header-column-title{font-size:17px;margin-bottom:10px}.v4-header-links a{min-height:44px}.v4-header-overlay{top:72px}}
@media(max-width:560px){.v4-header-inner{padding:0 20px}.v4-header .v4-header-contact{display:none}.v4-header-panel-inner{grid-template-columns:1fr;gap:24px;padding:24px 24px 40px}.v4-header-column-title{font-size:17px}.v4-header .v4-header-links a{font-size:15px;min-height:44px;padding-top:10px;padding-bottom:10px}.v4-header-column-title::after{margin-top:10px}}
@media(prefers-reduced-motion:reduce){.v4-header *,.v4-header *::after,.v4-header-overlay{transition:none!important}}
.v4-header-category.v4-header-feature{align-self:center;min-height:40px;padding:0 9px 0 11px;gap:7px;border:1px solid #bcd3b1;border-radius:999px;background:linear-gradient(120deg,#eef6e4 0%,#e3f1f4 100%);color:var(--v4-forest);font-weight:700;box-shadow:inset 0 1px 0 #fff,0 2px 6px #204b3914;transition:transform .16s,box-shadow .16s,border-color .16s}
.v4-header-category.v4-header-feature::after{display:none}
.v4-header-feature>svg{width:20px;height:20px;flex:none}
.v4-header-feature-badge{flex:none;padding:4px 7px;border-radius:999px;background:var(--v4-forest);color:#fff;font-size:10.5px;font-weight:800;letter-spacing:.03em;line-height:1}
.v4-header-category.v4-header-feature:hover,.v4-header-category.v4-header-feature:focus-visible,.v4-header-category.v4-header-feature.is-pointed{color:var(--v4-forest);border-color:#7fa873;transform:translateY(-1px);box-shadow:inset 0 1px 0 #fff,0 7px 16px #204b3926}
.v4-header-category.v4-header-feature.is-current{border-color:var(--v4-forest);background:linear-gradient(120deg,#e2efd4 0%,#d7ebee 100%)}
.v4-header-column.v4-header-feature-col{display:flex;align-items:flex-start}
.v4-header .v4-feature-card{display:flex;flex-direction:column;width:100%;border:1px solid #cfe0c6;border-radius:14px;overflow:hidden;background:linear-gradient(165deg,#e2f0f4 0%,#eef6e4 60%);color:var(--v4-ink);transition:transform .18s,box-shadow .18s,border-color .18s}
.v4-header .v4-feature-card:hover,.v4-header .v4-feature-card:focus-visible,.v4-header-feature-col.is-pointed .v4-feature-card{transform:translateY(-2px);border-color:#8fb383;box-shadow:0 12px 24px #204b3921}
.v4-header .v4-feature-card[aria-current="page"]{border-color:var(--v4-forest)}
.v4-feature-art{display:block;width:100%;height:auto;aspect-ratio:200/118}
.v4-feature-body{display:flex;flex-direction:column;gap:6px;min-width:0;padding:2px 16px 16px}
.v4-feature-eyebrow{font-size:10.5px;font-weight:700;letter-spacing:.14em;line-height:1.5;color:#4f7f5c}
.v4-header .v4-feature-title{font:inherit;font-size:17px;font-weight:750;letter-spacing:-.035em;line-height:1.4;margin:0;color:var(--v4-forest)}
.v4-feature-desc{font-size:13.5px;line-height:1.6;letter-spacing:-.02em;color:#54655a}
.v4-feature-cta{display:inline-flex;align-items:center;align-self:flex-start;gap:6px;margin-top:8px;padding:8px 13px;border-radius:999px;background:var(--v4-forest);color:#fff;font-size:13.5px;font-weight:650;line-height:1.3;white-space:nowrap}
.v4-feature-cta svg{width:15px;height:15px;flex:none}
@media(max-width:1240px) and (min-width:1051px){.v4-header-feature-badge{display:none}.v4-header-category.v4-header-feature{padding-right:13px}}
@media(max-width:1150px) and (min-width:1051px){.v4-feature-body{padding:2px 13px 14px}.v4-feature-desc{font-size:13px}}
@media(max-width:1050px){.v4-header-column.v4-header-feature-col{grid-column:1/-1;order:-1;padding:0;border-bottom:0}.v4-header .v4-feature-card{flex-direction:row;align-items:center}.v4-feature-art{flex:none;width:150px}.v4-feature-body{flex:1;padding:14px 16px 14px 4px}}
@media(max-width:560px){.v4-feature-art{width:112px}.v4-feature-body{gap:4px;padding:12px 14px 12px 2px}.v4-header .v4-feature-title{font-size:16px}.v4-feature-desc{font-size:13px}.v4-feature-cta{margin-top:6px;padding:7px 12px;font-size:13px}}
@media(prefers-reduced-motion:reduce){.v4-header-category.v4-header-feature,.v4-header .v4-feature-card{transition:none!important;transform:none!important}}
`;

export const headerV4Script = String.raw`
(function () {
  function initHeaderV4() {
    var header = document.querySelector('[data-v4-header]');
    if (!header || header.dataset.v4Ready) return;
    var panel = header.querySelector('.v4-header-panel');
    var nav = header.querySelector('.v4-header-nav');
    var toggle = header.querySelector('.v4-header-toggle');
    var overlay = document.querySelector('[data-v4-overlay]');
    if (!panel || !nav || !toggle) return;
    var mobile = window.matchMedia('(max-width: 1050px)');
    var hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    var topLinks = Array.from(nav.querySelectorAll('[data-v4-category]'));
    var columns = Array.from(panel.querySelectorAll('[data-v4-column]'));
    var opened = false;
    var pinned = false;
    var closeTimer = 0;
    var bodyState = null;
    header.dataset.v4Ready = 'true';

    function stopClose() { window.clearTimeout(closeTimer); closeTimer = 0; }
    function pointAt(index) {
      topLinks.forEach(function (link) { link.classList.toggle('is-pointed', link.dataset.v4Category === String(index)); });
      columns.forEach(function (column) { column.classList.toggle('is-pointed', column.dataset.v4Column === String(index)); });
    }
    function restoreBody() {
      if (!bodyState) return;
      ['overflow', 'padding-right'].forEach(function (name) {
        var saved = bodyState[name];
        if (saved.value) document.body.style.setProperty(name, saved.value, saved.priority);
        else document.body.style.removeProperty(name);
      });
      bodyState = null;
    }
    function syncBody() {
      if (!opened || !mobile.matches) { restoreBody(); return; }
      if (bodyState) return;
      bodyState = {};
      ['overflow', 'padding-right'].forEach(function (name) {
        bodyState[name] = { value: document.body.style.getPropertyValue(name), priority: document.body.style.getPropertyPriority(name) };
      });
      var scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      if (scrollbar) document.body.style.setProperty('padding-right', (parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar) + 'px');
      document.body.style.setProperty('overflow', 'hidden');
    }
    function renderState() {
      header.dataset.v4Open = String(opened);
      header.dataset.v4Pinned = String(pinned);
      panel.inert = !opened;
      panel.setAttribute('aria-hidden', String(!opened));
      toggle.setAttribute('aria-expanded', String(opened));
      toggle.setAttribute('aria-label', opened ? '전체 메뉴 닫기' : '전체 메뉴 열기');
      topLinks.forEach(function (link) { link.setAttribute('aria-expanded', String(opened)); });
      if (overlay) overlay.dataset.v4Visible = String(opened && (mobile.matches || pinned));
      syncBody();
    }
    function openMenu(pin) {
      stopClose();
      opened = true;
      if (pin) pinned = true;
      renderState();
    }
    function closeMenu(returnFocus) {
      stopClose();
      var activeInPanel = panel.contains(document.activeElement);
      opened = false;
      pinned = false;
      if (returnFocus && activeInPanel) toggle.focus({ preventScroll: true });
      pointAt(null);
      renderState();
    }
    function scheduleClose(fromPointer) {
      stopClose();
      closeTimer = window.setTimeout(function () {
        if (pinned) return;
        if (!fromPointer && header.contains(document.activeElement)) return;
        closeMenu(false);
      }, 160);
    }
    function desktopHover(event) {
      return !mobile.matches && hover.matches && event.pointerType !== 'touch';
    }
    topLinks.forEach(function (link) {
      link.addEventListener('pointerenter', function (event) {
        if (!desktopHover(event)) return;
        pointAt(link.dataset.v4Category);
        openMenu(false);
      });
    });
    nav.addEventListener('pointerenter', function (event) {
      if (desktopHover(event)) openMenu(false);
    });
    header.addEventListener('pointerenter', stopClose);
    header.addEventListener('pointerleave', function (event) {
      if (desktopHover(event)) scheduleClose(true);
    });
    columns.forEach(function (column) {
      column.addEventListener('pointerenter', function (event) {
        if (desktopHover(event)) { stopClose(); pointAt(column.dataset.v4Column); }
      });
    });
    header.addEventListener('focusin', function (event) {
      stopClose();
      var category = event.target.closest('[data-v4-category]');
      var column = event.target.closest('[data-v4-column]');
      if (category && !mobile.matches) { pointAt(category.dataset.v4Category); openMenu(false); }
      else if (column) pointAt(column.dataset.v4Column);
    });
    header.addEventListener('focusout', function (event) {
      if (event.relatedTarget && header.contains(event.relatedTarget)) return;
      stopClose();
      closeTimer = window.setTimeout(function () {
        if (!header.contains(document.activeElement)) closeMenu(false);
      }, 160);
    });
    toggle.addEventListener('click', function () {
      if (opened && (pinned || mobile.matches)) closeMenu(false);
      else openMenu(true);
    });
    header.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) closeMenu(false);
    });
    document.addEventListener('click', function (event) {
      if (opened && !header.contains(event.target)) closeMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (!opened) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (event.key !== 'Tab' || !mobile.matches) return;
      var focusables = Array.from(header.querySelectorAll('a[href],button:not([disabled])')).filter(function (element) {
        return !element.closest('[inert]') && element.getClientRects().length;
      });
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    function viewportChanged() { closeMenu(true); restoreBody(); }
    if (mobile.addEventListener) mobile.addEventListener('change', viewportChanged);
    else mobile.addListener(viewportChanged);
    window.addEventListener('pagehide', function () { closeMenu(false); restoreBody(); });
    renderState();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHeaderV4, { once: true });
  else initHeaderV4();
})();
`;
