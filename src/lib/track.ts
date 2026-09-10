const partnerNames: Record<string, string> = {
  'bjak.my': 'bjak',
  'policystreet.com': 'policystreet',
  'myeg.com.my': 'myeg',
};

let initialized = false;

export function track(event: string, params?: Record<string, unknown>): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export function initGlobalTracking(): void {
  if (initialized) return;
  initialized = true;

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const cta = target.closest<HTMLElement>('[data-cta]');
    if (cta) {
      const link = cta.closest<HTMLAnchorElement>('a[href]');
      const destination = link ? new URL(link.href, window.location.href).pathname : '';

      track('cta_click', {
        destination,
        location: cta.dataset.cta ?? '',
        text: cta.innerText.trim().slice(0, 60),
      });
    }

    const link = target.closest<HTMLAnchorElement>('a[href^="http"]');
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    const hostname = url.hostname.toLowerCase();
    if (hostname === 'insurans.co') return;

    const partnerHost = hostname.replace(/^www\./, '');
    track('outbound_click', {
      partner: partnerNames[partnerHost] ?? hostname,
      outbound_url: url.href,
      location: link.closest<HTMLElement>('[data-section]')?.dataset.section ?? 'body',
    });
  });

  document.addEventListener('toggle', (event) => {
    const faq = event.target;
    if (!(faq instanceof HTMLDetailsElement) || !faq.matches('details.faq-item') || !faq.open) return;

    track('faq_open', {
      faq_question: faq.querySelector('summary')?.innerText.trim().slice(0, 100) ?? '',
      page_type: document.body?.dataset.pageType ?? 'page',
    });
  }, true);
}
