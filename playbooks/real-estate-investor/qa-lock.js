const REI_QA = {
  coverAsset: 'approved high-resolution Real Estate Investor retail-book image',
  coverAssetDimensions: '700 x 1074 WebP',
  master: 'Insurance Agent Digital Product',
  cover: 'Approved Real Estate Investor retail book',
  firstPageFit: 'Book fills the left-page canvas without clipping, stretching, or low-resolution enlargement',
  readingMode: 'Focused centered reader with sidebar removed and expanded book canvas',
  productionRoute: '/playbooks/real-estate-investor/',
  accessPdf: 'OCG_LAB_Real_Estate_Investor_AI_Playbook_ETSY_FINAL.pdf',
  release: 'pending-live-visual-qa',
  qa: {
    route200: true,
    coverAsset200: true,
    coverResolutionVerified: true,
    readingModeCodeVerified: true,
    readingModeVisualVerified: false,
    navigationCodeVerified: true,
    responsiveCodeVerified: true,
    responsiveVisualVerified: false,
    pdfRenderedVerified: true,
    pdfLinkVerified: true,
    pdfLinkTarget: 'https://ocg-lab-products.vercel.app/playbooks/real-estate-investor/',
    runtimeErrors: null
  }
};
window.REI_QA = REI_QA;
