/* Original home section sequence and copy, with the existing public site's visual system.
 * Header, footer and routing remain owned by ui.js. No post data is rendered here.
 */
export function homeV2(posts) {
  return `<main id="main" class="original-home">
  <section class="original-home-hero" aria-labelledby="original-home-title">
    <picture><source media="(min-width: 761px)" srcset="/assets/6b57cfb61290a.jpg"><img class="original-home-hero-image" src="/assets/2b38d1e346508.jpg" width="1920" height="1280" alt="초록 잎이 우거진 정원" fetchpriority="high" decoding="async"></picture>
    <div class="original-home-hero-shade" aria-hidden="true"></div>
    <div class="original-home-wrap original-home-hero-content">
      <h1 id="original-home-title">정원에서 희망을<br><span>ESG에서 미래를</span></h1>
    </div>
  </section>

  <section class="original-home-purpose" aria-labelledby="original-home-purpose-title">
    <div class="original-home-wrap">
      <h2 id="original-home-purpose-title" class="original-home-statement">정원은 환경·사회·거버넌스를 통합하는 공익플랫폼입니다.</h2>
      <div class="original-home-pillars">
        <article class="original-home-pillar">
          <div class="original-home-pillar-heading"><span class="original-home-letter" aria-hidden="true">E</span><h3>환경</h3></div>
          <h4>탄소흡수원·자연기반해법(NbS)</h4>
          <p>정원을 통한 탄소중립 실현과 기후위기 대응</p>
        </article>
        <article class="original-home-pillar">
          <div class="original-home-pillar-heading"><span class="original-home-letter" aria-hidden="true">S</span><h3>사회</h3></div>
          <h4>시민참여 지역 활성화·공동체 재생</h4>
          <p>시민참여형 정원을 통한 공동체 회복과 지역발전</p>
          <p>탄소중립 실천을 위한 지역사회 운동 전개</p>
        </article>
        <article class="original-home-pillar">
          <div class="original-home-pillar-heading"><span class="original-home-letter" aria-hidden="true">G</span><h3>거버넌스</h3></div>
          <h4>투명한 제도·참여 거버넌스</h4>
          <p>민주적 의사결정과 투명한 정책 실행 체계 구축</p>
        </article>
      </div>
    </div>
  </section>

  <section class="original-home-founding" aria-label="창립식 및 특강">
    <figure class="original-home-wrap original-home-founding-figure">
      <img src="/assets/00bf5c513c5fe.jpg" width="1440" height="638" alt="대한민국 ESG정원정책포럼 창립식 및 특강 현장 단체사진" loading="lazy" decoding="async">
      <figcaption>창립식 및 특강</figcaption>
    </figure>
  </section>

  <section class="original-home-strategy" aria-labelledby="original-home-strategy-title">
    <div class="original-home-wrap">
      <h2 id="original-home-strategy-title" class="original-home-statement">ESG 가치를 정원정책으로 구현하여 지속가능한 미래를 만들어갑니다.</h2>
      <div class="original-home-cards">
        <article class="original-home-card">
          <div class="original-home-card-image"><img src="/assets/57173eeeff8cb.jpg" width="1280" height="648" alt="정원도시 모델 확립을 보여주는 정원 풍경" loading="lazy" decoding="async"></div>
          <div class="original-home-card-copy"><p class="original-home-card-label" lang="en">Garden City</p><h3>정원도시 모델 확립</h3><p>정원을 기반으로 지속가능한 도시환경과 지역경재력을 구축합니다.</p></div>
        </article>
        <article class="original-home-card">
          <div class="original-home-card-image"><img src="/assets/5cdac63092f2a.jpg" width="882" height="488" alt="탄소중립 실천을 위한 숲과 산책로" loading="lazy" decoding="async"></div>
          <div class="original-home-card-copy"><p class="original-home-card-label" lang="en">Net-zero Transition</p><h3>탄소중립 실천 및 탄소정원 정책화</h3><p>정원을 탄소저감과 생물다양성 회복을 위한 자연기반해법으로 정책화합니다. (탄소흡수원, 탄소크레딧)</p></div>
        </article>
        <article class="original-home-card">
          <div class="original-home-card-image"><img src="/assets/63e4b74a22838.jpg" width="810" height="540" alt="통합적 정원문화를 보여주는 나무와 정원 풍경" loading="lazy" decoding="async"></div>
          <div class="original-home-card-copy"><p class="original-home-card-label" lang="en">Integrated Garden Ecosystem</p><h3>통합적 정원문화 창출</h3><p>정원에 문화 예술 과학기술을 융합하여 새로운 가치를 창출합니다.</p></div>
        </article>
      </div>
    </div>
  </section>

  <section class="original-home-why" aria-labelledby="original-home-why-title">
    <div class="original-home-wrap">
      <div class="original-home-why-grid">
        <div class="original-home-why-heading"><h2 id="original-home-why-title">왜 '정원' 인가</h2><p>정원은 기후위기 대응과 지역사회 재생을 동시에 이끄는 전략자산입니다.</p></div>
        <div class="original-home-why-body"><p>순천만 국가정원과 울산 태화강 국가정원의 성공은 정원이 단순한 녹지공간이 아닌, 도시의 미래를 바꾸는 전략적 도구임을 증명했습니다.</p><p>자연기반해법(NbS)를 통해 탄소를 흡수하고, 생물다양성을 보전하며, 시민들의 삶의 질을 높이는 통합적 플랫폼 - 그것이 바로 우리가 추구하는 ESG정원입니다.</p></div>
      </div>
      <figure class="original-home-vision"><blockquote>정원은 도시의 희망이자, 지역이 자산이며, 미래의 해법입니다.</blockquote><figcaption>- 대한민국ESG정원정책포럼 비전 선언문 -</figcaption></figure>
    </div>
  </section>

  <section class="original-home-contact" aria-labelledby="original-home-contact-title">
    <img class="original-home-contact-image" src="/assets/1209762897719.jpg" width="1200" height="1800" alt="" aria-hidden="true" loading="lazy" decoding="async">
    <div class="original-home-contact-shade" aria-hidden="true"></div>
    <div class="original-home-wrap original-home-contact-content"><p class="original-home-contact-label">협력 및 후원 문의</p><h2 id="original-home-contact-title">ESG 정원정책포럼과 함께 하시겠어요?</h2><p>아래 버튼을 클릭하시면 후원 및 협력 문의를 하실 수 있습니다.</p><a class="original-home-contact-button" href="/contact"><span>문의하기</span><span aria-hidden="true">↗</span></a></div>
  </section>
</main>`;
}

export const homeV2Styles = `
.original-home{--oh-paper:var(--paper,#f8f7f2);--oh-ink:var(--ink,#19372b);--oh-forest:var(--forest,#173d2d);--oh-lime:var(--lime,#d4ec92);--oh-muted:var(--muted,#6a746b);--oh-line:var(--line,#dedfd5);background:var(--oh-paper);color:var(--oh-ink);font-family:var(--sans,Pretendard,'Malgun Gothic',sans-serif);line-height:1.7;word-break:keep-all;overflow-wrap:break-word}
.original-home *,.original-home *::before,.original-home *::after{box-sizing:border-box}
.original-home h1,.original-home h2,.original-home h3,.original-home h4,.original-home p,.original-home figure,.original-home blockquote{margin:0}
.original-home img{display:block;max-width:100%;height:auto}
.original-home .original-home-wrap{width:min(1280px,calc(100% - 112px));margin-inline:auto}
.original-home .original-home-hero{position:relative;isolation:isolate;min-height:400px;height:420px;display:grid;align-items:center;background:#153d27;overflow:hidden}
.original-home .original-home-hero-image,.original-home .original-home-contact-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.original-home .original-home-hero-image{object-position:center 48%}
.original-home .original-home-hero-shade{position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(9,34,21,.65),rgba(9,34,21,.28) 62%,rgba(9,34,21,.1))}
.original-home .original-home-hero-content{padding-block:45px}
.original-home .original-home-hero h1{font-family:var(--serif,'Noto Serif KR',Batang,serif);font-size:clamp(42px,4.4vw,66px);font-weight:600;letter-spacing:-.055em;line-height:1.5;color:#fff;text-shadow:0 2px 24px rgba(0,0,0,.12)}
.original-home .original-home-hero h1 span{color:#e5efcd}
.original-home .original-home-purpose{padding:88px 0 64px}
.original-home .original-home-statement{max-width:1000px;margin-inline:auto;text-align:center;font-family:var(--serif,'Noto Serif KR',Batang,serif);font-size:clamp(25px,2.5vw,36px);line-height:1.65;letter-spacing:-.05em;font-weight:600;text-wrap:balance}
.original-home .original-home-pillars{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin-top:54px}
.original-home .original-home-pillar{min-width:0;padding:0 34px;border-left:1px solid var(--oh-line)}
.original-home .original-home-pillar:first-child{border-left:0;padding-left:0}
.original-home .original-home-pillar:last-child{padding-right:0}
.original-home .original-home-pillar-heading{display:flex;align-items:center;gap:18px;margin-bottom:24px}
.original-home .original-home-letter{font-size:58px;font-weight:400;line-height:1;letter-spacing:-.06em;color:var(--oh-forest)}
.original-home .original-home-pillar h3{font-size:17px;font-weight:650;color:var(--oh-forest)}
.original-home .original-home-pillar h4{font-size:18px;line-height:1.65;font-weight:650;letter-spacing:-.035em;margin-bottom:10px}
.original-home .original-home-pillar p{font-size:15px;color:var(--oh-muted);line-height:1.85;letter-spacing:-.02em}
.original-home .original-home-pillar p+p{margin-top:7px}
.original-home .original-home-founding{padding:0 0 16px}
.original-home .original-home-founding-figure img{width:100%;height:auto;aspect-ratio:1440/638;object-fit:contain;background:#e8e9df}
.original-home .original-home-founding-figure figcaption{padding-top:13px;font-size:13px;letter-spacing:.025em;color:var(--oh-muted);text-align:right}
.original-home .original-home-strategy{padding:77px 0 96px}
.original-home .original-home-strategy .original-home-statement{max-width:920px}
.original-home .original-home-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;margin-top:48px}
.original-home .original-home-card{min-width:0;background:#fff;border:1px solid #e3e4db;border-radius:3px;overflow:hidden}
.original-home .original-home-card-image{background:#e8e9df;overflow:hidden}
.original-home .original-home-card-image img{width:100%;height:auto;aspect-ratio:16/10;object-fit:cover}
.original-home .original-home-card-copy{padding:28px 25px 32px}
.original-home .original-home-card-label{font-size:12px;font-weight:650;letter-spacing:.035em;line-height:1.5;color:#48724c;margin-bottom:13px;min-height:18px}
.original-home .original-home-card h3{font-size:21px;font-weight:650;letter-spacing:-.04em;line-height:1.55;margin-bottom:13px;min-height:65px}
.original-home .original-home-card-copy>p:last-child{font-size:15px;line-height:1.85;color:var(--oh-muted);letter-spacing:-.02em}
/* The captured original uses a solid green section here, not a photograph.
 * 1209762897719.jpg belongs to the original contact section below. */
.original-home .original-home-why{background:var(--oh-forest);color:#fff;padding:88px 0 74px}
.original-home .original-home-why-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:78px;align-items:start}
.original-home .original-home-why-heading h2{font-family:var(--serif,'Noto Serif KR',Batang,serif);font-size:clamp(31px,3vw,42px);font-weight:500;line-height:1.5;letter-spacing:-.05em;margin-bottom:22px}
.original-home .original-home-why-heading>p{font-size:23px;line-height:1.7;letter-spacing:-.035em;max-width:460px;color:#ecf0e5}
.original-home .original-home-why-body{padding-top:7px}
.original-home .original-home-why-body p{font-size:16px;line-height:1.95;letter-spacing:-.015em;color:#dce4d8}
.original-home .original-home-why-body p+p{margin-top:20px}
.original-home .original-home-vision{margin-top:56px;padding-top:40px;border-top:1px solid rgba(255,255,255,.22);text-align:center}
.original-home .original-home-vision blockquote{max-width:920px;margin-inline:auto;font-family:var(--serif,'Noto Serif KR',Batang,serif);font-size:clamp(24px,2.55vw,34px);font-weight:500;line-height:1.7;letter-spacing:-.04em;color:var(--oh-lime);text-wrap:balance}
.original-home .original-home-vision figcaption{margin-top:20px;color:#c4d0c0;font-size:13px;letter-spacing:.02em}
.original-home .original-home-contact{position:relative;isolation:isolate;overflow:hidden;background:#1a3223;color:white;padding:80px 0 84px;text-align:center}
.original-home .original-home-contact-image{object-position:center 48%}
.original-home .original-home-contact-shade{position:absolute;inset:0;z-index:-1;background:rgba(9,31,21,.69)}
.original-home .original-home-contact-label{font-size:14px;letter-spacing:.07em;color:#e1edcd;margin-bottom:20px}
.original-home .original-home-contact h2{font-family:var(--serif,'Noto Serif KR',Batang,serif);font-weight:500;font-size:clamp(27px,3vw,40px);letter-spacing:-.045em;line-height:1.6;text-wrap:balance}
.original-home .original-home-contact-content>p:not(.original-home-contact-label){margin-top:19px;font-size:16px;color:#ecf1e9;line-height:1.8}
.original-home .original-home-contact-button{display:inline-flex;min-width:174px;min-height:54px;align-items:center;justify-content:space-between;gap:35px;margin-top:30px;padding:14px 24px;color:#173d2d;background:var(--oh-lime);border:1px solid var(--oh-lime);font-size:15px;font-weight:650;text-decoration:none;border-radius:2px;transition:background .18s,border-color .18s}
.original-home .original-home-contact-button:hover{background:#e4f4b9;border-color:#e4f4b9}
.original-home .original-home-contact-button:focus-visible{outline:3px solid #fff;outline-offset:5px}
@media(min-width:1500px){.original-home .original-home-hero{height:440px}}
@media(max-width:1100px){.original-home .original-home-wrap{width:calc(100% - 72px)}.original-home .original-home-pillar{padding-inline:24px}.original-home .original-home-pillar h4{font-size:17px}.original-home .original-home-cards{gap:20px}.original-home .original-home-card-copy{padding:23px 20px 27px}.original-home .original-home-card h3{font-size:19px}.original-home .original-home-why-grid{gap:42px}}
@media(max-width:760px){.original-home .original-home-wrap{width:calc(100% - 40px)}.original-home .original-home-hero{height:380px;min-height:380px}.original-home .original-home-hero h1{font-size:clamp(35px,7.8vw,50px);line-height:1.65}.original-home .original-home-hero-shade{background:linear-gradient(90deg,rgba(9,34,21,.65),rgba(9,34,21,.22))}.original-home .original-home-purpose{padding:55px 0 38px}.original-home .original-home-statement{font-size:25px;line-height:1.7}.original-home .original-home-pillars{grid-template-columns:1fr;margin-top:32px}.original-home .original-home-pillar,.original-home .original-home-pillar:first-child,.original-home .original-home-pillar:last-child{padding:26px 0;border-left:0;border-top:1px solid var(--oh-line)}.original-home .original-home-pillar:last-child{padding-bottom:0}.original-home .original-home-pillar-heading{margin-bottom:15px;gap:15px}.original-home .original-home-letter{font-size:46px}.original-home .original-home-pillar h4{font-size:18px}.original-home .original-home-founding .original-home-wrap{width:100%}.original-home .original-home-founding-figure figcaption{padding-inline:20px;font-size:12px}.original-home .original-home-strategy{padding:49px 0 56px}.original-home .original-home-cards{grid-template-columns:1fr;gap:24px;margin-top:31px}.original-home .original-home-card-copy{padding:24px}.original-home .original-home-card h3{min-height:0;font-size:22px;margin-bottom:10px}.original-home .original-home-card-label{margin-bottom:11px}.original-home .original-home-card-image img{aspect-ratio:auto;object-fit:contain}.original-home .original-home-why{padding:52px 0 48px}.original-home .original-home-why-grid{grid-template-columns:1fr;gap:26px}.original-home .original-home-why-heading h2{font-size:32px;margin-bottom:18px}.original-home .original-home-why-heading>p{font-size:22px}.original-home .original-home-why-body{padding-top:0}.original-home .original-home-why-body p{font-size:15px;line-height:1.9}.original-home .original-home-vision{margin-top:32px;padding-top:28px}.original-home .original-home-vision blockquote{font-size:25px}.original-home .original-home-vision figcaption{font-size:11px;letter-spacing:0;line-height:1.8}.original-home .original-home-contact{padding:56px 0 60px}.original-home .original-home-contact h2{font-size:29px}.original-home .original-home-contact-content>p:not(.original-home-contact-label){font-size:15px}.original-home .original-home-contact-label{font-size:13px;margin-bottom:17px}}
@media(prefers-reduced-motion:reduce){.original-home .original-home-contact-button{transition:none}}
`;
