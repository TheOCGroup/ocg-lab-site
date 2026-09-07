if (typeof spreads !== 'undefined' && spreads[0]) {
  spreads[0].left = `<div class="approved-book-stage"><img class="approved-book-visual" src="/playbooks/real-estate-investor/rei-approved-book.webp?v=2" alt="Real Estate Investor AI Playbook retail book cover" /></div>`;
}

(() => {
  const style = document.createElement('style');
  style.id = 'rei-final-polish';
  style.textContent = `
    .stage{grid-template-columns:250px minmax(0,1fr)!important}
    .sidebar{padding:18px 12px!important}
    .reader{padding:14px 18px 22px!important;min-width:0!important;overflow:hidden!important}
    .book-wrap{width:min(1120px,100%)!important;max-width:100%!important;margin:auto!important}
    .book{width:100%!important;min-height:0!important;height:min(760px,calc(100vh - 138px))!important;aspect-ratio:auto!important;perspective:2200px!important;filter:drop-shadow(0 24px 54px rgba(18,47,84,.18))!important}
    .spread{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;overflow:hidden!important}
    .page{min-width:0!important;padding:20px 24px 46px!important;overflow:auto!important}
    .spread:first-child .page.left{padding:0!important;overflow:hidden!important}
    .controls{width:100%!important;margin-top:10px!important}

    /* FIRST PAGE: physical book should visually fill the page, not float as a small card. */
    .approved-book-stage{height:100%!important;width:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:8px 10px 10px!important;background:radial-gradient(circle at 50% 38%,#fff 0%,#f7fafc 54%,#edf4f8 100%)!important;overflow:hidden!important}
    .approved-book-visual{display:block!important;width:auto!important;height:96%!important;max-width:97%!important;max-height:96%!important;object-fit:contain!important;filter:drop-shadow(0 20px 26px rgba(14,38,67,.22))!important;transform-origin:center center!important;animation:reiCoverSettle .5s cubic-bezier(.2,.75,.2,1) both!important}
    @keyframes reiCoverSettle{from{opacity:.75;transform:translateY(7px) scale(.985)}to{opacity:1;transform:none}}

    .opening{padding:4px 0!important}
    .opening blockquote{font-size:clamp(27px,2.8vw,42px)!important;margin:7px 0 11px!important}
    .opening p{font-size:clamp(13px,1.15vw,16px)!important;line-height:1.5!important}
    .metric-row{gap:8px!important;margin-top:10px!important}
    .metric{padding:13px!important;border-radius:14px!important}
    .metric b{font-size:23px!important}
    .signature{margin-top:14px!important}
    .spread{transition:opacity .28s ease,transform .34s cubic-bezier(.2,.75,.2,1)!important}
    .spread:not(.active){transform:translateY(8px) scale(.995)!important}
    .spread.active{transform:none!important}

    @media(max-width:1050px){
      .stage{grid-template-columns:220px minmax(0,1fr)!important}
      .reader{padding:12px!important}
      .book{height:min(720px,calc(100vh - 132px))!important}
      .approved-book-stage{padding:6px 8px 8px!important}
      .approved-book-visual{height:96%!important;max-width:98%!important;max-height:96%!important}
    }

    @media(max-width:860px){
      .stage{grid-template-columns:1fr!important}
      .sidebar{display:none!important}
      .reader{padding:10px!important;overflow:visible!important}
      .book{height:auto!important}
      .spread{position:relative!important;inset:auto!important;display:none!important;grid-template-columns:1fr!important;opacity:1!important;transform:none!important;overflow:visible!important}
      .spread.active{display:grid!important}
      .page{min-height:calc(100vh - 150px)!important;border-radius:18px!important}
      .page.right{margin-top:10px!important}
      .spread:first-child .page.left{min-height:calc(100vh - 150px)!important;padding:0!important}
      .approved-book-stage{min-height:calc(100vh - 150px)!important;padding:8px!important}
      .approved-book-visual{width:auto!important;height:auto!important;max-width:96%!important;max-height:calc(100vh - 170px)!important}
      .controls{position:sticky!important;bottom:8px!important;z-index:20!important;background:color-mix(in srgb,var(--paper) 88%,transparent)!important;padding:7px!important;border-radius:14px!important;backdrop-filter:blur(12px)!important}
    }

    @media(max-width:560px){
      .topbar{height:auto!important;min-height:62px!important;padding:7px 8px!important}
      .top-actions{gap:4px!important}
      .top-actions .pill-btn{font-size:10px!important;padding:7px 8px!important}
      .approved-book-stage{min-height:500px!important;padding:6px!important}
      .approved-book-visual{max-width:98%!important;max-height:488px!important}
      .page{padding:17px 14px 42px!important;min-height:0!important}
      .spread:first-child .page.left{padding:0!important;min-height:500px!important}
      .navbtn{padding:8px 9px!important;font-size:11px!important}
      .controls .center{font-size:10px!important}
    }

    @media(prefers-reduced-motion:reduce){.approved-book-visual,.spread{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);
})();
