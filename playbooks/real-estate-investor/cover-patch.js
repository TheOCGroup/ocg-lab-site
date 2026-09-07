// OCG LAB REI production presentation lock.
// Keeps the approved Insurance Agent chassis while fitting the REI retail-book cover and reader cleanly.
if (typeof spreads !== 'undefined' && spreads[0]) {
  spreads[0].left = `<div class="approved-book-stage"><img class="approved-book-visual" src="${window.REI_APPROVED_BOOK_COVER}" alt="Real Estate Investor AI Playbook approved retail book cover" /></div>`;
}

(() => {
  const style = document.createElement('style');
  style.id = 'rei-final-polish';
  style.textContent = `
    /* Desktop fit: keep the full two-page book visible inside the viewport. */
    .stage{grid-template-columns:clamp(238px,18vw,276px) minmax(0,1fr)!important}
    .sidebar{padding:20px 14px!important}
    .reader{padding:18px clamp(12px,2vw,26px) 28px!important;min-width:0!important;overflow:hidden!important}
    .book-wrap{width:min(1160px,100%)!important;max-width:100%!important;margin:auto!important}
    .book{width:100%!important;min-height:0!important;height:auto!important;aspect-ratio:1.46/1!important;max-height:calc(100vh - 154px)!important;perspective:2200px!important;filter:drop-shadow(0 26px 58px rgba(18,47,84,.20))!important}
    .spread{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;overflow:visible!important;transform-origin:center center}
    .page{min-width:0!important;padding:22px 26px 50px!important;scrollbar-gutter:auto!important}
    .page.left{border-radius:24px 3px 3px 24px!important}
    .page.right{border-radius:3px 24px 24px 3px!important}
    .controls{width:100%!important;margin-top:12px!important}

    /* Approved retail-book presentation. */
    .cover-page{background:linear-gradient(155deg,#f8fbfd 0%,#edf4f8 100%)!important;overflow:hidden!important}
    .approved-book-stage{height:100%!important;width:100%!important;display:grid!important;place-items:center!important;padding:16px 18px!important;background:radial-gradient(circle at 50% 32%,#fff 0%,#f7fafc 48%,#edf4f8 100%)!important;overflow:hidden!important}
    .approved-book-visual{display:block!important;width:auto!important;height:auto!important;max-width:92%!important;max-height:94%!important;object-fit:contain!important;filter:drop-shadow(0 20px 24px rgba(14,38,67,.20))!important;transform:translateZ(0)!important;transition:transform .45s cubic-bezier(.2,.75,.2,1),filter .45s ease!important}
    .spread.active .approved-book-visual{animation:reiCoverSettle .55s cubic-bezier(.2,.75,.2,1) both}
    @keyframes reiCoverSettle{from{opacity:.82;transform:translateY(8px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}

    /* Make opening spread breathe at laptop widths. */
    .opening{padding:6px 0!important}
    .opening blockquote{font-size:clamp(28px,3vw,43px)!important;margin:8px 0 12px!important}
    .opening p{font-size:clamp(14px,1.25vw,17px)!important;line-height:1.5!important}
    .metric-row{gap:9px!important;margin-top:12px!important}
    .metric{padding:14px!important;border-radius:15px!important}
    .metric b{font-size:24px!important}
    .signature{margin-top:16px!important}

    /* Subtle book motion. */
    .rei-turn-out-next{animation:reiTurnOutNext .20s ease both!important}
    .rei-turn-out-prev{animation:reiTurnOutPrev .20s ease both!important}
    .rei-turn-in-next{animation:reiTurnInNext .28s ease both!important}
    .rei-turn-in-prev{animation:reiTurnInPrev .28s ease both!important}
    @keyframes reiTurnOutNext{to{opacity:.55;transform:translateX(-10px) scale(.994) rotateY(-1.2deg)}}
    @keyframes reiTurnOutPrev{to{opacity:.55;transform:translateX(10px) scale(.994) rotateY(1.2deg)}}
    @keyframes reiTurnInNext{from{opacity:.4;transform:translateX(12px) scale(.994)}to{opacity:1;transform:none}}
    @keyframes reiTurnInPrev{from{opacity:.4;transform:translateX(-12px) scale(.994)}to{opacity:1;transform:none}}

    /* Tablet/mobile: one readable page at a time, no horizontal clipping. */
    @media(max-width:980px){
      .stage{grid-template-columns:1fr!important}
      .sidebar{position:relative!important;top:auto!important;height:auto!important;border-right:0!important;border-bottom:1px solid var(--line)!important;display:none!important}
      .reader{padding:14px 12px 24px!important}
      .book-wrap{width:100%!important}
      .book{aspect-ratio:auto!important;min-height:0!important;max-height:none!important;height:auto!important}
      .spread{position:relative!important;inset:auto!important;display:none!important;grid-template-columns:1fr!important;opacity:1!important;transform:none!important}
      .spread.active{display:grid!important}
      .page{min-height:min(760px,calc(100vh - 150px))!important;border-radius:20px!important;padding:22px 22px 48px!important}
      .page.right{margin-top:12px!important}
      .approved-book-stage{min-height:620px!important}
      .approved-book-visual{max-width:min(86vw,560px)!important;max-height:590px!important}
    }
    @media(max-width:620px){
      .topbar{height:auto!important;min-height:64px!important;padding:8px 10px!important;gap:8px!important}
      .top-actions{gap:5px!important;flex-wrap:wrap!important;justify-content:flex-end!important}
      .top-actions .pill-btn{padding:8px 9px!important;font-size:11px!important}
      .reader{padding:8px 6px 18px!important}
      .page{padding:18px 16px 44px!important;min-height:0!important}
      .approved-book-stage{min-height:500px!important;padding:10px!important}
      .approved-book-visual{max-width:94vw!important;max-height:480px!important}
      .controls{padding:0 4px!important}
      .navbtn{padding:9px 10px!important;font-size:12px!important}
      .controls .center{font-size:11px!important}
    }
    @media(prefers-reduced-motion:reduce){
      .approved-book-visual,.spread{animation:none!important;transition:none!important}
    }
  `;
  document.head.appendChild(style);

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const wrapNavigation = (name, direction) => {
    const original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function(...args){
      const active = document.querySelector('.spread.active');
      if (!active || active.dataset.reiAnimating === '1') return original.apply(this,args);
      active.dataset.reiAnimating='1';
      active.classList.add(direction === 'next' ? 'rei-turn-out-next' : 'rei-turn-out-prev');
      window.setTimeout(() => {
        active.classList.remove('rei-turn-out-next','rei-turn-out-prev');
        delete active.dataset.reiAnimating;
        original.apply(this,args);
        requestAnimationFrame(() => {
          const incoming=document.querySelector('.spread.active');
          if (!incoming) return;
          incoming.classList.add(direction === 'next' ? 'rei-turn-in-next' : 'rei-turn-in-prev');
          window.setTimeout(()=>incoming.classList.remove('rei-turn-in-next','rei-turn-in-prev'),320);
        });
      },140);
    };
  };
  wrapNavigation('nextSpread','next');
  wrapNavigation('prevSpread','prev');
})();
