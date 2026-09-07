// Production cover lock: use the approved Real Estate Investor retail book visual.
if (typeof spreads !== 'undefined' && spreads[0]) {
  spreads[0].left = `<div class="approved-book-stage"><img class="approved-book-visual" src="${window.REI_APPROVED_BOOK_COVER}" alt="Real Estate Investor AI Playbook approved retail book cover" /></div>`;
}
